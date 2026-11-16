import { experienceCatalog } from "./experience-catalog";
import type { ExperienceDefinition, ExperienceId, ExperienceKind } from "./personalization";

const signalKeys = ["energy", "pressure", "openness", "focus", "warmth", "playfulness"] as const;
const known = new Map(experienceCatalog.map((item) => [item.id, item.kind] as const));

export async function loadPublishedCatalog(): Promise<ExperienceDefinition[] | null> {
  try {
    const response = await fetch("/api/catalog", { headers: { accept: "application/json" }, cache: "no-store" });
    if (!response.ok) return null;
    return parsePublishedCatalog(await response.json());
  } catch {
    return null;
  }
}

export function parsePublishedCatalog(body: unknown): ExperienceDefinition[] | null {
  if (!isRecord(body) || !Array.isArray(body.experiences)) return null;
  const parsed: ExperienceDefinition[] = [];
  const seen = new Set<string>();
  for (const item of body.experiences) {
    const experience = parseExperience(item);
    if (!experience || seen.has(experience.id)) return null;
    seen.add(experience.id);
    parsed.push(experience);
  }
  return parsed;
}

function parseExperience(item: unknown): ExperienceDefinition | null {
  if (!isRecord(item) || typeof item.id !== "string" || typeof item.kind !== "string") return null;
  const kind = known.get(item.id as ExperienceId);
  if (!kind || item.kind !== kind) return null;
  const title = localized(item.title, 120);
  const description = localized(item.description, 600);
  const target = scores(item.target);
  const icon = cleanText(item.icon, 8);
  if (!title || !description || !target || !icon) return null;
  return { id: item.id as ExperienceId, kind: kind as ExperienceKind, icon, title, description, target };
}

function localized(value: unknown, max: number): Record<"vi" | "en", string> | null {
  if (!isRecord(value)) return null;
  const vi = cleanText(value.vi, max);
  const en = cleanText(value.en, max);
  if (!vi || !en) return null;
  return { vi, en };
}

function scores(value: unknown): ExperienceDefinition["target"] | null {
  if (!isRecord(value)) return null;
  const target = {} as ExperienceDefinition["target"];
  for (const key of signalKeys) {
    const score = value[key];
    if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 100) return null;
    target[key] = score;
  }
  return target;
}

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  let result = "";
  for (const char of value.trim()) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 32 || code === 127) continue;
    result += char;
  }
  if (!result || result.length > max) return null;
  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
