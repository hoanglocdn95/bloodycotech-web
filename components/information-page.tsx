import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/personalization";

const navigation = {
  vi: [
    ["Cách hoạt động", "/how-it-works/"],
    ["Giới thiệu", "/about/"],
    ["Riêng tư", "/privacy/"],
    ["Điều khoản", "/terms/"],
    ["Liên hệ", "/contact/"],
  ],
  en: [
    ["How it works", "/en/how-it-works/"],
    ["About", "/en/about/"],
    ["Privacy", "/en/privacy/"],
    ["Terms", "/en/terms/"],
    ["Contact", "/en/contact/"],
  ],
} as const;

export function InformationPage({
  locale,
  eyebrow,
  title,
  intro,
  alternateHref,
  children,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  intro: string;
  alternateHref: string;
  children: ReactNode;
}) {
  return <div className="information-shell" lang={locale}>
    <header className="information-header">
      <Link className="information-brand" href={locale === "vi" ? "/" : "/en/"}><span>B</span><strong>BloodyCoTech</strong></Link>
      <nav aria-label={locale === "vi" ? "Điều hướng trang thông tin" : "Information navigation"}>
        <Link href={locale === "vi" ? "/" : "/en/"}>{locale === "vi" ? "Mở ứng dụng" : "Open the app"}</Link>
        <Link href={alternateHref}>{locale === "vi" ? "EN" : "VI"}</Link>
      </nav>
    </header>
    <main className="information-page">
      <p className="information-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="information-intro">{intro}</p>
      <article>{children}</article>
    </main>
    <footer className="information-footer">
      <span>© 2026 BloodyCoTech</span>
      <nav aria-label={locale === "vi" ? "Thông tin BloodyCoTech" : "BloodyCoTech information"}>
        {navigation[locale].map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
    </footer>
  </div>;
}
