"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/container";
import { isActivePath, primaryNav } from "@/lib/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="h-0.5 bg-accent" />
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="BloodyCoTech, về trang chủ" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <nav aria-label="Chính" className="hidden items-center gap-1 md:flex">
            {primaryNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "rounded-full bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent"
                      : "rounded-full px-3 py-1.5 text-sm text-muted hover:text-ink"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface md:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </Container>
      {open ? (
        <div id="site-menu" className="border-t border-line md:hidden">
          <nav aria-label="Di động" className="mx-auto flex w-full max-w-6xl flex-col px-4 py-3">
            {primaryNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="rounded-lg px-2 py-3 text-base hover:bg-surface"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
