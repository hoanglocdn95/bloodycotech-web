"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { alternateLocalePath, chromeCopy, localeFromPath } from "@/lib/i18n";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const copy = chromeCopy[locale];

  return (
    <Link
      href={alternateLocalePath(pathname)}
      hrefLang={locale === "vi" ? "en" : "vi"}
      className="hud-button gap-1.5"
      aria-label={copy.languageLabel}
      title={copy.languageLabel}
    >
      <Languages className="size-3.5" aria-hidden="true" />
      <span>{copy.languageShort}</span>
    </Link>
  );
}
