import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Terminal } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { PixelHero } from "@/components/pixel-hero";
import { getFeaturedPosts, getPublishedPosts } from "@/lib/posts";
import { createMetadata } from "@/lib/seo";

const description =
  "A personal developer log about frontend engineering, interview practice, and small web games.";

export const metadata: Metadata = createMetadata({
  title: "Personal developer log",
  description,
  path: "/en/",
});

export default function EnglishHomePage() {
  const posts = getPublishedPosts();
  const featured = getFeaturedPosts();

  return (
    <div lang="en">
      <Container className="py-10 sm:py-14">
        <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
          <div>
            <p className="hud-label">SAVE_POINT // PERSONAL DEV LOG</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
              Write code. Debug it. <span className="text-accent">Leave a useful trail.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              BloodyCoTech is my public workbench for checked frontend notes, deliberate interview
              practice, and small games that are still taking shape. It is a personal site, not a
              polished fictional studio.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/blog/" className="pixel-button gap-2">
                <BookOpen className="size-4" aria-hidden="true" /> Read the Vietnamese notes
              </Link>
              <Link href="/en/interview/" className="pixel-button pixel-button--quiet gap-2">
                <Terminal className="size-4" aria-hidden="true" /> Enter interview training
              </Link>
            </div>
            <dl className="mt-9 grid max-w-2xl grid-cols-3 gap-3">
              <Stat value={String(posts.length).padStart(2, "0")} label="notes" />
              <Stat value="04" label="topics" />
              <Stat value="VI/EN" label="interface" />
            </dl>
          </div>
          <PixelHero />
        </section>

        <section className="mt-20">
          <p className="hud-label">{"// CURRENT_MODE"}</p>
          <h2 className="mt-2 text-3xl font-bold">What I am working on</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="pixel-card p-6 sm:p-8">
              <h3 className="text-2xl font-bold">Frontend interview preparation</h3>
              <p className="mt-3 leading-7 text-muted">
                A practical curriculum built from a real React role: JavaScript, TypeScript,
                React state, REST APIs, responsive UI, web performance, Git, code review, and
                communication in an international outsourcing project.
              </p>
              <Link href="/en/interview/" className="mt-5 inline-flex items-center gap-2 font-semibold text-accent">
                Open the curriculum <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="pixel-card p-6 sm:p-8">
              <h3 className="text-2xl font-bold">Small web products</h3>
              <p className="mt-3 leading-7 text-muted">
                Experiments and releases will live together, with an honest status on each item.
                No made-up users, launch numbers, or testimonials.
              </p>
              <Link href="/en/projects/" className="mt-5 inline-flex items-center gap-2 font-semibold text-accent">
                View the build queue <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <p className="hud-label">{"// VIETNAMESE_NOTES"}</p>
          <h2 className="mt-2 text-3xl font-bold">Selected technical notes</h2>
          <p className="mt-3 max-w-2xl text-muted">
            The article library is intentionally Vietnamese-only for now. Interface pages and the
            interview guide are available in both languages.
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {featured.map((post) => <ArticleCard key={post.slug} post={post} headingLevel="h3" />)}
          </div>
        </section>
      </Container>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l-2 border-accent pl-3">
      <dt className="font-display text-xl font-bold">{value}</dt>
      <dd className="font-mono text-[0.68rem] uppercase tracking-wide text-muted">{label}</dd>
    </div>
  );
}
