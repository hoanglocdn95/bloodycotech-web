import "@/lib/shiki-node-polyfill";
import Link from "next/link";
import type { ComponentProps } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type LineElement } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";
import { remarkIncludeExamples } from "@/lib/remark-include";

function MdxLink({ href = "", children, ...props }: ComponentProps<"a">) {
  if (href.startsWith("/")) {
    const [path, hash] = href.split("#");
    const normalized = path.endsWith("/") ? path : `${path}/`;
    const finalHref = hash ? `${normalized}#${hash}` : normalized;
    return (
      <Link href={finalHref} {...props}>
        {children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (mở tab mới)</span>
    </a>
  );
}

function MdxTable(props: ComponentProps<"table">) {
  return (
    <div className="my-6 overflow-x-auto">
      <table {...props} />
    </div>
  );
}

const components = {
  a: MdxLink,
  pre: CodeBlock,
  table: MdxTable,
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="article-body">
      <MDXRemote
        source={source}
        components={components}
        options={{
          blockJS: true,
          blockDangerousJS: true,
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkIncludeExamples],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypePrettyCode,
                {
                  theme: "github-dark",
                  keepBackground: false,
                  bypassInlineCode: true,
                  defaultLang: "text",
                  onVisitLine(node: LineElement) {
                    if (node.children.length === 0) {
                      node.children.push({ type: "text", value: " " });
                    }
                  },
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
