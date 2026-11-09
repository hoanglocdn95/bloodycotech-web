import type { Metadata } from "next";
import Link from "next/link";
import { InformationPage } from "@/components/information-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Privacy policy", description: "What BloodyCoTech stores on your device, what is not transmitted, and the current AdSense connection status.", alternates: { canonical: "/en/privacy/", languages: { vi: "/privacy/", en: "/en/privacy/" } } };

export default function EnglishPrivacyPage() {
  return <InformationPage locale="en" alternateHref="/privacy/" eyebrow="Privacy policy" title="Privacy, in plain language" intro="Effective November 9, 2026. BloodyCoTech is a static browser application without an account system.">
    <h2>Your drawing</h2><p>The drawing and its individual marks exist only in the open page’s memory. The app does not upload the drawing, call an analysis API, or store the image or stroke list in <code>localStorage</code>. Reloading or closing the page removes stroke data.</p>
    <h2>Your numeric profile</h2><p>After a drawing is completed, the app calculates measurements such as range, position, speed, stroke count, curvature, dominant colour, and six suggestion signals. Only those numbers, experience opens, and fit feedback are stored under <code>bloodycotech:personal-profile:v1</code> on this device.</p><p>The signals are not a psychological diagnosis. You can inspect and erase the full profile from My corner.</p>
    <h2>Hosting and technical logs</h2><p>The website is served through Cloudflare. Cloudflare may process IP address, URL, access time, and connection details to operate, secure, and deliver the site under the <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare privacy policy</a>. BloodyCoTech currently has no Google Analytics or first-party analytics system.</p>
    <h2>Google AdSense</h2><p>The website publishes its Publisher ID through a <code>google-adsense-account</code> meta tag and an <code>ads.txt</code> file so Google can verify control of the domain. The drawing flow and experiences currently load no AdSense script or ad unit and set no advertising cookie.</p><p>If advertising is enabled later, this policy will be updated and an appropriate consent/choice mechanism will be implemented before personalised advertising operates. Google policy: <a href="https://policies.google.com/privacy">policies.google.com/privacy</a>.</p>
    <h2>Email</h2><p>If you voluntarily email <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>, the message is used to read and answer your request. It is not sold or added to an advertising list.</p>
    <h2>External links</h2><p>Information pages may link to Cloudflare or Google. Their own policies apply when you open those destinations.</p>
    <h2>Changes and contact</h2><p>If data behaviour changes, the effective date and this page will be updated. Privacy questions can be sent through the <Link href="/en/contact/">contact page</Link>.</p>
  </InformationPage>;
}
