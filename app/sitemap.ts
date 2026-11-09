import type { MetadataRoute } from "next";
export const dynamic = "force-static";
const base = "https://bloodycotech.com";
const pairs = [
  ["/", "/en/"],
  ["/about/", "/en/about/"],
  ["/how-it-works/", "/en/how-it-works/"],
  ["/privacy/", "/en/privacy/"],
  ["/terms/", "/en/terms/"],
  ["/contact/", "/en/contact/"],
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return pairs.flatMap(([vi, en]) => [vi, en].map((path) => ({
    url: new URL(path, base).toString(),
    lastModified: "2026-11-09",
    changeFrequency: path === "/" || path === "/en/" ? "weekly" as const : "monthly" as const,
    priority: path === "/" || path === "/en/" ? 1 : .7,
    alternates: { languages: { vi: new URL(vi, base).toString(), en: new URL(en, base).toString() } },
  })));
}
