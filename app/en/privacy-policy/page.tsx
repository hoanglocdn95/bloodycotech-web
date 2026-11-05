import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const description = "A plain-language summary of storage, hosting, advertising, and data handling on BloodyCoTech.";
export const metadata: Metadata = createMetadata({ title: "Privacy", description, path: "/en/privacy-policy/" });

export default function EnglishPrivacyPage() {
  return <div lang="en"><Container className="py-10 sm:py-14">
    <Breadcrumb items={[{ label: "Home", href: "/en/" }, { label: "Privacy" }]} />
    <div className="mt-7"><PageHeader eyebrow="SYSTEM_POLICY" title="Privacy, in plain language" description={description} /></div>
    <div className="article-body mt-10 max-w-3xl">
      <p>Effective November 5, 2026. This page describes what the site does now, not what it might do later.</p>
      <h2>What the site stores</h2><p>There are no accounts, comments, payments, or contact forms. The browser stores only the light/dark preference under <code>{site.themeStorageKey}</code>. That value is not sent to a BloodyCoTech API.</p>
      <h2>Hosting logs</h2><p>The static site is intended for Cloudflare Pages. Cloudflare may process IP addresses, request times, and URLs as part of serving and protecting the site under its own policy.</p>
      <h2>AdSense status</h2><p>Every page loads Google’s AdSense script, <code>adsbygoogle.js</code>, with the configured publisher ID. The ownership meta tag and <code>ads.txt</code> remain in place. The site does not place ad units in the content. Google may process request data and set cookies under its own policy when that script runs, including before an ad is shown. BloodyCoTech does not sell personal data.</p>
      <h2>External links</h2><p>Technical notes link to third-party documentation. Those sites apply their own privacy policies.</p>
      <h2>Changes</h2><p>The effective date changes when the actual behavior changes. A future analytics tool, form, or account system will not be quietly covered by this old text.</p>
    </div>
  </Container></div>;
}
