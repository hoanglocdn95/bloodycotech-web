import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const description = "How to reach BloodyCoTech about a correction, a project, or frontend work.";
export const metadata: Metadata = createMetadata({ title: "Contact", description, path: "/en/contact/" });

export default function EnglishContactPage() {
  return <div lang="en"><Container className="py-10 sm:py-14">
    <Breadcrumb items={[{ label: "Home", href: "/en/" }, { label: "Contact" }]} />
    <div className="mt-7"><PageHeader eyebrow="MESSAGE_CHANNEL" title="Contact" description={description} /></div>
    <div className="article-body mt-10 max-w-3xl">
      {site.contactEmail ? <><h2>Email</h2><p><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p></> : <><h2>The inbox is not public yet</h2><p>I have not configured a public address, so there is no placeholder form that sends nowhere. Once an address is ready, it will appear here and in the footer.</p></>}
      <h2>Useful messages</h2><ul><li>A technical correction with the article URL and a reproducible example.</li><li>Feedback about an explanation that is difficult to follow.</li><li>A concrete conversation about frontend work or a released project.</li></ul>
    </div>
  </Container></div>;
}
