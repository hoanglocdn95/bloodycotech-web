import GithubSlugger from "github-slugger";

export type TocItem = {
  depth: 2 | 3;
  text: string;
  id: string;
};

export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length === 2 ? 2 : 3;
    const text = match[2].replace(/[`*_]/g, "").trim();
    items.push({ depth, text, id: slugger.slug(text) });
  }

  return items;
}
