import type { Metadata } from "next";
import Link from "next/link";
import { InformationPage } from "@/components/information-page";

export const metadata: Metadata = { title: "Terms of use", description: "Scope, limits, and responsibilities when using BloodyCoTech.", alternates: { canonical: "/en/terms/", languages: { vi: "/terms/", en: "/en/terms/" } } };

export default function EnglishTermsPage() {
  return <InformationPage locale="en" alternateHref="/terms/" eyebrow="Terms of use" title="For exploration, not diagnosis" intro="Effective November 9, 2026. By continuing to use the website, you understand the scope of an experimental browser-based product.">
    <h2>Purpose</h2><p>BloodyCoTech offers a drawing tool, small apps, games, and short writing for entertainment, focus, or a break. Drawing signals are only used to arrange these experiences.</p>
    <h2>Not professional advice</h2><p>The numbers and explanations are not psychological, medical, legal, financial, or employment assessments. Do not use them to self-diagnose or make high-impact decisions.</p>
    <h2>On-device data</h2><p>Your personalisation profile lives in your browser. Clearing browser data, using private mode, or changing devices may remove it. BloodyCoTech cannot recover that local data.</p>
    <h2>Games and content</h2><p>Games are provided as they currently work. Scores have no monetary value, cannot be exchanged for prizes, and are unrelated to gambling. Quotes name an author when there is a commonly accepted attribution; report a suspected error through the <Link href="/en/contact/">contact page</Link>.</p>
    <h2>Availability</h2><p>Features may be fixed, changed, or temporarily removed. The website does not promise uninterrupted operation in every older browser.</p>
    <h2>Privacy</h2><p>Data handling and advertising-connection status are described in the <Link href="/en/privacy/">privacy policy</Link>.</p>
  </InformationPage>;
}
