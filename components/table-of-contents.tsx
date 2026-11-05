"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { TocItem } from "@/lib/toc";
import { localeFromPath } from "@/lib/i18n";

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
  const locale = localeFromPath(usePathname());
  const title = locale === "en" ? "On this page" : "Mục lục";
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
      <details className="toc-panel pixel-card p-4 lg:hidden">
        <summary className="cursor-pointer font-display text-sm font-semibold">{title}</summary>
        <div className="mt-3">
          <TocLinks items={items} active={active} />
        </div>
      </details>
      <nav aria-label={title} className="toc-panel sticky top-24 hidden border-l-2 border-line pl-4 lg:block">
        <p className="hud-label">{title}</p>
        <div className="mt-3">
          <TocLinks items={items} active={active} />
        </div>
      </nav>
    </>
  );
}
