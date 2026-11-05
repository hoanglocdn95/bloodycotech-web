import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog-index";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { getPublishedPosts } from "@/lib/posts";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

const description =
  "Ghi chú kỹ thuật mình muốn tìm lại sau này: React, TypeScript, browser API và những mảnh nhỏ để làm game trên web.";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description,
  path: "/blog/",
});

export default function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Blog", path: "/blog/" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Blog" },
        ]}
      />
      <div className="mt-6">
        <PageHeader
          eyebrow="QUEST_LOG"
          title="Ghi chú kỹ thuật"
          description={description}
        />
      </div>
      <div className="mt-8">
        <BlogIndex posts={posts} />
      </div>
    </Container>
  );
}
