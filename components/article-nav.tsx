import Link from "next/link";
import type { PostSummary } from "@/lib/posts";

export function ArticleNav({
  newer,
  older,
}: {
  newer: PostSummary | null;
  older: PostSummary | null;
}) {
  if (!newer && !older) return null;

  return (
    <nav aria-label="Bài viết liền kề" className="mt-10 grid gap-3 sm:grid-cols-2">
      {older ? (
        <Link
          href={`/blog/${older.slug}/`}
          className="rounded-2xl border border-line bg-surface p-4 hover:border-accent"
        >
          <span className="text-xs font-medium text-muted">Bài cũ hơn</span>
          <span className="mt-1 block font-semibold">{older.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {newer ? (
        <Link
          href={`/blog/${newer.slug}/`}
          className="rounded-2xl border border-line bg-surface p-4 hover:border-accent sm:text-right"
        >
          <span className="text-xs font-medium text-muted">Bài mới hơn</span>
          <span className="mt-1 block font-semibold">{newer.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
