import Link from "next/link";
import { categories, type CategorySlug } from "@/lib/categories";

export function CategoryBadge({ category }: { category: CategorySlug }) {
  return (
    <Link
      href={`/blog/#${category}`}
      className="inline-flex rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
    >
      {categories[category].label}
    </Link>
  );
}
