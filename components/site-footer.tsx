"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { chromeCopy, localeFromPath, localizedPath } from "@/lib/i18n";
import { site } from "@/lib/site";

export function SiteFooter() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const copy = chromeCopy[locale];
  const year = new Date().getUTCFullYear();

  return (
    <footer className="mt-auto border-t-2 border-line bg-surface">
      <div className="pixel-progress" aria-hidden="true" />
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 font-display text-sm text-accent">{site.tagline}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{copy.footerNote}</p>
        </div>
        <nav aria-label={copy.footerNav}>
          <p className="hud-label">MENU</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {copy.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted hover:text-accent">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="hud-label">INFO</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href={localizedPath(locale, "/contact/")} className="text-muted hover:text-accent">{copy.contact}</Link>
            <Link href={localizedPath(locale, "/privacy-policy/")} className="text-muted hover:text-accent">{copy.privacy}</Link>
            {site.contactEmail ? <a href={`mailto:${site.contactEmail}`} className="text-accent">{site.contactEmail}</a> : null}
          </div>
        </div>
      </Container>
      <div className="border-t-2 border-line">
        <Container className="flex flex-wrap items-center justify-between gap-2 py-4 font-mono text-xs text-muted">
          <span>© {year} {site.name}</span>
          <span>BUILD_2026 // VI + EN</span>
        </Container>
      </div>
    </footer>
  );
}
