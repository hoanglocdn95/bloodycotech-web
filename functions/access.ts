import type { PagesEnv } from "./env";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const defaultAdminEmail = "hoanglocdn95@gmail.com";

type JsonWebKeyWithId = JsonWebKey & { kid?: string; alg?: string };

let signingKeys: { issuer: string; expires: number; keys: JsonWebKeyWithId[] } | null = null;

export async function allowAdmin(request: Request, env: PagesEnv): Promise<boolean> {
  if (isLocalDev(request)) return true;
  const issuer = teamIssuer(env.ACCESS_TEAM_DOMAIN);
  const audience = env.ACCESS_AUD?.trim();
  if (!issuer || !audience) return false;
  const token = accessToken(request);
  if (!token) return false;
  try {
    const claims = await verifyAccessToken(token, issuer, audience);
    return emailAllowed(claims?.email, env.ADMIN_EMAIL);
  } catch {
    return false;
  }
}

export function forbidden(): Response {
  return new Response("Forbidden", {
    status: 403,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex",
      "referrer-policy": "no-referrer",
    },
  });
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) return false;
  return origin === new URL(request.url).origin;
}

function isLocalDev(request: Request): boolean {
  const url = new URL(request.url);
  return url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1");
}

function teamIssuer(value: string | undefined): string | null {
  if (!value) return null;
  const withProtocol = value.trim().replace(/\/$/, "");
  const candidate = withProtocol.startsWith("https://") ? withProtocol : `https://${withProtocol}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".cloudflareaccess.com")) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function emailAllowed(value: unknown, configured: string | undefined): boolean {
  if (typeof value !== "string") return false;
  const expected = (configured?.trim() || defaultAdminEmail).toLowerCase();
  return value.trim().toLowerCase() === expected;
}

function accessToken(request: Request): string | null {
  const header = request.headers.get("Cf-Access-Jwt-Assertion");
  if (header) return header;
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;
  for (const part of cookie.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === "CF_Authorization") return decodeURIComponent(rest.join("="));
  }
  return null;
}

async function verifyAccessToken(token: string, issuer: string, audience: string): Promise<Record<string, unknown> | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const header = parseJson(parts[0]);
  const claims = parseJson(parts[1]);
  if (!isRecord(header) || !isRecord(claims)) return null;
  if (header.alg !== "RS256" || typeof header.kid !== "string") return null;
  if (claims.iss !== issuer) return null;
  if (!audienceMatches(claims.aud, audience)) return null;
  const now = Date.now() / 1000;
  if (typeof claims.exp !== "number" || now >= claims.exp) return null;
  if (typeof claims.nbf === "number" && now < claims.nbf) return null;
  const jwk = await keyFor(issuer, header.kid);
  if (!jwk || jwk.kty !== "RSA" || typeof jwk.n !== "string" || typeof jwk.e !== "string") return null;
  const key = await crypto.subtle.importKey(
    "jwk",
    { kty: "RSA", n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    toArrayBuffer(decodeBase64Url(parts[2])),
    toArrayBuffer(textEncoder.encode(`${parts[0]}.${parts[1]}`)),
  );
  return valid ? claims : null;
}

async function keyFor(issuer: string, kid: string): Promise<JsonWebKeyWithId | null> {
  const keys = await loadKeys(issuer, false);
  const found = keys.find((key) => key.kid === kid);
  if (found) return found;
  const refreshed = await loadKeys(issuer, true);
  return refreshed.find((key) => key.kid === kid) ?? null;
}

async function loadKeys(issuer: string, force: boolean): Promise<JsonWebKeyWithId[]> {
  const now = Date.now();
  if (!force && signingKeys && signingKeys.issuer === issuer && signingKeys.expires > now) return signingKeys.keys;
  const response = await fetch(`${issuer}/cdn-cgi/access/certs`);
  if (!response.ok) return [];
  const body: unknown = await response.json();
  if (!isRecord(body) || !Array.isArray(body.keys)) return [];
  const keys = body.keys.filter(isJwk);
  signingKeys = { issuer, expires: now + 10 * 60 * 1000, keys };
  return keys;
}

function audienceMatches(value: unknown, audience: string): boolean {
  const audiences = Array.isArray(value) ? value : [value];
  return audiences.some((item) => item === audience);
}

function parseJson(segment: string): unknown {
  return JSON.parse(textDecoder.decode(decodeBase64Url(segment)));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function decodeBase64Url(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (input.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function isJwk(value: unknown): value is JsonWebKeyWithId {
  return isRecord(value) && typeof value.kid === "string" && typeof value.kty === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
