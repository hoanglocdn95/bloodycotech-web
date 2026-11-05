import Link from "next/link";
import { categories, type CategorySlug } from "@/lib/categories";

export function CategoryBadge({ category }: { category: CategorySlug }) {
  return (
    <Link
      href={`/blog/#${category}`}
      className="inline-flex border border-accent bg-accent-soft px-2.5 py-1 font-mono text-[0.7rem] font-medium uppercase tracking-wide text-accent"
    >
      {categories[category].label}
    </Link>
  );
}
