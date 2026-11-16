import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const required = [
  "index.html",
  "en/index.html",
  "about/index.html",
  "en/about/index.html",
  "how-it-works/index.html",
  "en/how-it-works/index.html",
  "privacy/index.html",
  "en/privacy/index.html",
  "terms/index.html",
  "en/terms/index.html",
  "contact/index.html",
  "en/contact/index.html",
  "ads.txt",
  "_redirects",
  "sitemap.xml",
  "robots.txt",
];
const missing = required.filter((file) => !existsSync(join("out", file)));
if (missing.length) throw new Error(`Missing static output: ${missing.join(", ")}`);

const home = readFileSync(join("out", "index.html"), "utf8");
const english = readFileSync(join("out", "en/index.html"), "utf8");
const about = readFileSync(join("out", "about/index.html"), "utf8");
const method = readFileSync(join("out", "how-it-works/index.html"), "utf8");
const privacy = readFileSync(join("out", "privacy/index.html"), "utf8");
const adsTxt = readFileSync(join("out", "ads.txt"), "utf8").trim();
const sitemap = readFileSync(join("out", "sitemap.xml"), "utf8");
if (!home.includes("BloodyCoTech") || !home.includes("Chào bạn!!!")) throw new Error("Vietnamese app shell is incomplete.");
if (!english.includes("Hello!!!")) throw new Error("English app shell is incomplete.");
if (!home.includes('name="google-adsense-account"') || !home.includes("ca-pub-4663633976089574")) throw new Error("AdSense ownership meta is missing.");
if (adsTxt !== "google.com, pub-4663633976089574, DIRECT, f08c47fec0942fa0") throw new Error("ads.txt is missing or malformed.");
if (!about.includes("một người") || !method.includes("Không có AI đọc suy nghĩ") || !privacy.includes("Google AdSense")) throw new Error("Original product and policy content is incomplete.");
if (sitemap.includes("/blog/") || sitemap.includes("/interview/")) throw new Error("Legacy URLs remain in the new sitemap.");
for (const route of ["/about/", "/how-it-works/", "/privacy/", "/terms/", "/contact/"]) if (!sitemap.includes(route)) throw new Error(`Sitemap is missing ${route}`);
if (home.includes("pagead2.googlesyndication.com")) throw new Error("AdSense must not load in the drawing experience.");
const leaked = filesIn("out").filter((file) => {
  const text = readFileSync(file);
  return text.includes("bc-console") || text.includes("/api/admin") || text.includes("ACCESS_AUD") || text.includes("ACCESS_TEAM_DOMAIN");
});
if (leaked.length) throw new Error(`Public output reveals the management path: ${leaked.join(", ")}`);
console.log("site check passed: client-only VI/EN app, original info pages, AdSense verification, clean sitemap, no ad script in canvas");

function filesIn(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) filesIn(path, found);
    else found.push(path);
  }
  return found;
}
