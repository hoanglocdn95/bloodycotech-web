"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/container";
import { chromeCopy, localeFromPath } from "@/lib/i18n";
import { isActivePath } from "@/lib/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const copy = chromeCopy[locale];
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
    <header className="site-chrome sticky top-0 z-40 border-b-2 border-line bg-bg/95 backdrop-blur-md">
      <div className="pixel-progress" aria-hidden="true" />
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href={locale === "en" ? "/en/" : "/"}
          aria-label={locale === "en" ? "BloodyCoTech, home" : "BloodyCoTech, về trang chủ"}
          onClick={() => setOpen(false)}
        >
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <nav aria-label={copy.primaryNav} className="hidden items-center gap-1 md:flex">
            {copy.nav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "nav-chip nav-chip--active"
                      : "nav-chip"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className="hud-button mobile-menu-button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? copy.menuClose : copy.menuOpen}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </Container>
      {open ? (
        <div id="site-menu" className="border-t-2 border-line bg-bg md:hidden">
          <nav aria-label={copy.mobileNav} className="mx-auto flex w-full max-w-6xl flex-col px-4 py-3">
            {copy.nav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={active ? "mobile-nav-link mobile-nav-link--active" : "mobile-nav-link"}
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
