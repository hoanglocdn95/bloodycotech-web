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
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent">
      <CategoryBadge category={post.category} />
      <Title className="mt-3 text-lg font-semibold tracking-tight">
        <Link href={`/blog/${post.slug}/`} className="hover:text-accent">
          {post.title}
        </Link>
      </Title>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{post.description}</p>
      <p className="mt-4 text-sm text-muted">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </p>
    </article>
  );
}
