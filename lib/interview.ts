import fs from "node:fs";
import path from "node:path";
import { extractToc } from "@/lib/toc";
import type { Locale } from "@/lib/i18n";

export function getInterviewGuide(locale: Locale) {
  const filename = locale === "en" ? "en.mdx" : "vi.mdx";
  const content = fs.readFileSync(path.join(process.cwd(), "content/interview", filename), "utf8").trim();
  return { content, toc: extractToc(content) };
}
