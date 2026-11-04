import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { categories } from "@/lib/categories";
import { formatDate } from "@/lib/format";
import {
  getCategoryCounts,
  getFeaturedPosts,
  getLatestPosts,
  getPublishedPosts,
} from "@/lib/posts";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  description: site.description,
  path: "/",
});

export default function HomePage() {
  const featured = getFeaturedPosts();
  const [lead, ...restFeatured] = featured;
  const latest = getLatestPosts(5);
  const counts = getCategoryCounts();
  const newest = getPublishedPosts()[0];

  return (
    <Container className="py-12 sm:py-16">
      <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <div>
          <p className="text-sm font-medium text-accent">Developer blog</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{site.name}</h1>
          <p className="mt-4 text-xl font-medium text-accent">{site.tagline}</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            Ghi chú thực hành về React, TypeScript và game trên web. Sản phẩm riêng sẽ xuất hiện
            khi có bản phát hành để kiểm chứng.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/blog/"
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent"
            >
              Đọc blog
            </Link>
            <Link
              href="/projects/"
              className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm font-semibold"
            >
              Xem định hướng sản phẩm
            </Link>
          </div>
        </div>
        <aside className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-mono text-xs text-muted">{"// mới xuất bản"}</p>
          <ul className="mt-4 space-y-4">
            {getPublishedPosts()
              .slice(0, 4)
              .map((post) => (
                <li key={post.slug}>
                  <p className="font-mono text-xs text-muted">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </p>
                  <Link href={`/blog/${post.slug}/`} className="mt-1 block font-medium hover:text-accent">
                    {post.title}
                  </Link>
                </li>
              ))}
          </ul>
        </aside>
      </section>

      {lead ? (
        <section className="mt-16" aria-labelledby="featured-heading">
          <div className="flex items-end justify-between gap-4">
            <h2 id="featured-heading" className="text-2xl font-semibold tracking-tight">
              Bài nổi bật
            </h2>
            <Link href="/blog/" className="text-sm font-medium text-accent">
              Tất cả bài viết
            </Link>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)]">
            <article className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <p className="text-sm font-medium text-accent">{categories[lead.category].label}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                <Link href={`/blog/${lead.slug}/`} className="hover:text-accent">
                  {lead.title}
                </Link>
              </h3>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">{lead.description}</p>
              <p className="mt-6 text-sm text-muted">
                <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time>
              </p>
            </article>
            <div className="grid gap-4">
              {restFeatured.map((post) => (
                <ArticleCard key={post.slug} post={post} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-16" aria-labelledby="latest-heading">
        <h2 id="latest-heading" className="text-2xl font-semibold tracking-tight">
          Bài mới
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <ArticleCard key={post.slug} post={post} headingLevel="h3" />
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="text-2xl font-semibold tracking-tight">
          Chủ đề
        </h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {(Object.keys(categories) as Array<keyof typeof categories>).map((key) => (
            <li key={key}>
              <Link
                href={`/blog/#${key}`}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span>
                  <span className="font-semibold">{categories[key].label}</span>
                  <span className="mt-1 block text-sm text-muted sm:mt-0 sm:inline sm:before:mx-2 sm:before:content-['·']">
                    {categories[key].description}
                  </span>
                </span>
                <span className="text-sm text-muted">{counts[key]} bài</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Sản phẩm độc lập</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          BloodyCoTech hướng tới web game, công cụ tương tác và phần mềm nhỏ. Trang dự án chỉ liệt
          kê những gì đã phát hành công khai. Hiện chưa có sản phẩm nào đủ điều kiện đó.
        </p>
        <Link href="/projects/" className="mt-5 inline-flex text-sm font-semibold text-accent">
          Đọc định hướng sản phẩm
        </Link>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="text-2xl font-semibold tracking-tight">Đọc tiếp trên blog</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          {newest
            ? `Bài mới nhất là “${newest.title}”. Mỗi bài có ví dụ, trường hợp nên dùng và trường hợp không nên dùng.`
            : "Các bài viết nằm trong mục blog."}
        </p>
        <Link
          href="/blog/"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent"
        >
          Vào blog
        </Link>
      </section>
    </Container>
  );
}
