"use client";

import { useSyncExternalStore } from "react";
import { ArticleCard } from "@/components/article-card";
import { EmptyState } from "@/components/empty-state";
import { categories, isCategorySlug, type CategorySlug } from "@/lib/categories";
import type { PostSummary } from "@/lib/posts";

const categoryOrder = Object.keys(categories) as CategorySlug[];
const categoryEvent = "bloodycotech-blog-category";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  window.addEventListener(categoryEvent, onStoreChange);
  return () => {
    window.removeEventListener("hashchange", onStoreChange);
    window.removeEventListener(categoryEvent, onStoreChange);
  };
}

function categoryFromLocation(): CategorySlug | "all" {
  const id = window.location.hash.replace("#", "");
  return isCategorySlug(id) ? id : "all";
}

export function BlogIndex({ posts }: { posts: PostSummary[] }) {
  const category = useSyncExternalStore(
    subscribe,
    categoryFromLocation,
    () => "all" as const,
  );

  function select(next: CategorySlug | "all") {
    const url = next === "all" ? "/blog/" : `/blog/#${next}`;
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(categoryEvent));
  }

  const visible =
    category === "all" ? posts : posts.filter((post) => post.category === category);

  return (
    <div>
      <div role="group" aria-label="Lọc theo chủ đề" className="flex flex-wrap gap-2">
        <FilterButton pressed={category === "all"} onClick={() => select("all")}>
          Tất cả
        </FilterButton>
        {categoryOrder.map((item) => (
          <FilterButton
            key={item}
            id={item}
            pressed={category === item}
            onClick={() => select(item)}
          >
            {categories[item].label}
          </FilterButton>
        ))}
      </div>
      {visible.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Không có bài trong chủ đề này">
            Chọn chủ đề khác hoặc xem toàn bộ bài viết.
          </EmptyState>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {visible.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  id,
  pressed,
  onClick,
  children,
}: {
  id?: string;
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      id={id}
      aria-pressed={pressed}
      onClick={onClick}
      className={
        pressed
          ? "border-2 border-line bg-accent px-3 py-1.5 font-mono text-xs font-medium text-on-accent shadow-[2px_2px_0_var(--pixel-shadow)]"
          : "border-2 border-line bg-surface px-3 py-1.5 font-mono text-xs text-muted hover:border-accent hover:text-accent"
      }
    >
      {children}
    </button>
  );
}
