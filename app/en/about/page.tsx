import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { createMetadata } from "@/lib/seo";

const description = "The person, working principles, and direction behind BloodyCoTech.";
export const metadata: Metadata = createMetadata({ title: "About", description, path: "/en/about/" });

export default function EnglishAboutPage() {
  return <div lang="en"><Container className="py-10 sm:py-14">
    <Breadcrumb items={[{ label: "Home", href: "/en/" }, { label: "About" }]} />
    <div className="mt-7"><PageHeader eyebrow="PLAYER_PROFILE" title="About BloodyCoTech" description={description} /></div>
    <div className="article-body mt-10 max-w-3xl">
      <p>BloodyCoTech is my personal corner of the web. I use it to make my learning visible: notes I have checked, interview topics I am actively revising, and small web products that can be opened and tested.</p>
      <h2>Why this site exists</h2>
      <p>Bookmarks are good for collecting links but poor at proving understanding. Writing forces me to choose an example, name a trade-off, and notice what I still cannot explain. When an article becomes outdated, I want the date and source links to make that visible too.</p>
      <h2>What I write about</h2>
      <p>The current focus is frontend engineering: React, TypeScript, browser APIs, responsive interfaces, web performance, and the small game systems that make the browser fun to work with.</p>
      <h2>Ground rules</h2>
      <ul><li>No invented clients, users, download counts, or testimonials.</li><li>Examples should run or be type-checked where practical.</li><li>A project gets an honest status: experiment, active build, released, or archived.</li><li>Corrections are welcome; quiet confidence is better than pretending to know everything.</li></ul>
      <p>Start with the <Link href="/en/interview/">interview training room</Link>, or read the <Link href="/blog/">Vietnamese technical notes</Link>.</p>
    </div>
  </Container></div>;
}
