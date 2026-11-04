import fs from "node:fs";
import path from "node:path";

type CodeNode = {
  type: string;
  value?: string;
  meta?: string | null;
  children?: CodeNode[];
};

function walk(node: CodeNode, visit: (node: CodeNode) => void) {
  visit(node);
  for (const child of node.children ?? []) {
    walk(child, visit);
  }
}

export function remarkIncludeExamples() {
  return (tree: CodeNode) => {
    walk(tree, (node) => {
      if (node.type !== "code" || !node.meta) return;
      const match = node.meta.match(/(?:^|\s)include=(\S+)/);
      if (!match) return;

      const relative = match[1];
      if (!relative.startsWith("examples/") || relative.includes("..")) {
        throw new Error(`Đường dẫn ví dụ không hợp lệ: ${relative}`);
      }

      const fullPath = path.join(process.cwd(), relative);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Không tìm thấy file ví dụ: ${relative}`);
      }

      node.value = fs.readFileSync(fullPath, "utf8").replace(/\s+$/, "");
      const nextMeta = node.meta.replace(match[0], "").trim();
      node.meta = nextMeta || null;
    });
  };
}
