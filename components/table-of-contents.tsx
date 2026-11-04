"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

function TocLinks({ items, active }: { items: TocItem[]; active: string }) {
  return (
    <ol className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.id} className={item.depth === 3 ? "pl-3" : undefined}>
          <a
            href={`#${item.id}`}
            aria-current={active === item.id ? "location" : undefined}
            className={
              active === item.id
                ? "font-medium text-accent"
                : "text-muted hover:text-ink"
            }
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: [0, 1] },
    );

    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      <details className="toc-panel rounded-2xl border border-line bg-surface p-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold">Mục lục</summary>
        <div className="mt-3">
          <TocLinks items={items} active={active} />
        </div>
      </details>
      <nav aria-label="Mục lục" className="toc-panel sticky top-24 hidden lg:block">
        <p className="text-sm font-semibold">Mục lục</p>
        <div className="mt-3">
          <TocLinks items={items} active={active} />
        </div>
      </nav>
    </>
  );
}
