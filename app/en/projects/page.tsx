import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { createMetadata } from "@/lib/seo";

const description = "A transparent build queue for experiments, active work, and released products.";
export const metadata: Metadata = createMetadata({ title: "Projects", description, path: "/en/projects/" });

export default function EnglishProjectsPage() {
  return <div lang="en"><Container className="py-10 sm:py-14">
    <Breadcrumb items={[{ label: "Home", href: "/en/" }, { label: "Projects" }]} />
    <div className="mt-7"><PageHeader eyebrow="BUILD_QUEUE" title="Projects" description={description} /></div>
    <div className="article-body mt-10 max-w-3xl">
      <p>This page will not pretend a repository is a product. When something appears here it will have a status, a usable link or demo, what I was trying to learn, and the decisions that did not work.</p>
      <h2>Status system</h2>
      <ul><li><strong>Experiment:</strong> a narrow idea that can already be tried.</li><li><strong>Building:</strong> active work with an incomplete edge.</li><li><strong>Released:</strong> a public version with a stable URL.</li><li><strong>Archived:</strong> useful lessons, no active development.</li></ul>
    </div>
    <div className="mt-10"><EmptyState title="No public build yet">The queue is honest, not abandoned. Meanwhile, the <Link href="/en/interview/" className="text-accent underline">interview guide</Link> is the first substantial new section shipped in this rebuild.</EmptyState></div>
  </Container></div>;
}
