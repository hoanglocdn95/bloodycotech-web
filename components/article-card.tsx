import Link from "next/link";
import { CategoryBadge } from "@/components/category-badge";
import { formatDate } from "@/lib/format";
import type { PostSummary } from "@/lib/posts";

export function ArticleCard({
  post,
  headingLevel = "h2",
}: {
  post: PostSummary;
  headingLevel?: "h2" | "h3";
}) {
  const Title = headingLevel;

  return (
    <article className="pixel-card group flex h-full flex-col p-5 transition-transform hover:-translate-y-1">
      <CategoryBadge category={post.category} />
      <Title className="mt-3 text-lg font-semibold tracking-tight">
        <Link href={`/blog/${post.slug}/`} className="hover:text-accent">
          {post.title}
        </Link>
      </Title>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{post.description}</p>
      <p className="mt-4 font-mono text-xs text-muted">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </p>
    </article>
  );
}
