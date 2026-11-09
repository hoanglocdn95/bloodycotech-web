import type { Metadata } from "next";
import { InformationPage } from "@/components/information-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Contact", description: "Contact BloodyCoTech to report a bug, share product feedback, or ask about privacy.", alternates: { canonical: "/en/contact/", languages: { vi: "/contact/", en: "/en/contact/" } } };

export default function EnglishContactPage() {
  return <InformationPage locale="en" alternateHref="/contact/" eyebrow="Contact channel" title="Report a bug or share feedback" intro="BloodyCoTech is an independent project. Email is the direct contact channel; there is no intermediary form collecting your details.">
    <h2>Email</h2><p><a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></p>
    <h2>A useful bug report</h2><ul><li>Tell me whether you used a phone or computer and name the browser.</li><li>Describe the steps immediately before the problem.</li><li>If possible, include the app or game that was open.</li></ul>
    <h2>Personal data</h2><p>You do not need to send your drawing or numeric profile to report a bug. If you email voluntarily, the message is used to read and reply to your request. It is not sold or added to an advertising list.</p>
  </InformationPage>;
}
