import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { ArticleNav } from "@/components/article-nav";
import { Breadcrumb } from "@/components/breadcrumb";
import { CategoryBadge } from "@/components/category-badge";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/table-of-contents";
import { categories } from "@/lib/categories";
import { formatDate } from "@/lib/format";
import { getAdjacentPosts, getPost, getPublishedPosts, getRelatedPosts } from "@/lib/posts";
import { articleJsonLd, breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return createMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}/`,
    article: post,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug);
  const adjacent = getAdjacentPosts(post.slug);

  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Blog", path: "/blog/" },
          { name: post.title, path: `/blog/${post.slug}/` },
        ])}
      />
      <JsonLd data={articleJsonLd(post)} />
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Blog", href: "/blog/" },
          { label: post.title },
        ]}
      />
      <div className="mt-6 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,42rem)_16rem] lg:justify-center">
        <article className="min-w-0">
          <header>
            <CategoryBadge category={post.category} />
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{post.description}</p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <div>
                <dt className="inline">Tác giả </dt>
                <dd className="inline text-ink">{post.author}</dd>
              </div>
              <div>
                <dt className="inline">Xuất bản </dt>
                <dd className="inline">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </dd>
              </div>
              <div>
                <dt className="inline">Cập nhật </dt>
                <dd className="inline">
                  <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Chủ đề</dt>
                <dd className="inline">{categories[post.category].label}</dd>
              </div>
            </dl>
          </header>
          {post.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover}
              alt=""
              className="mt-8 w-full rounded-2xl border border-line"
            />
          ) : null}
          <div className="mt-8 lg:hidden">
            <TableOfContents items={post.toc} />
          </div>
          <div className="mt-8">
            <MdxContent source={post.content} />
          </div>
          <p className="mt-8 text-sm text-muted">
            Thẻ: {post.tags.join(", ")}
          </p>
          <ArticleNav newer={adjacent.newer} older={adjacent.older} />
          {related.length > 0 ? (
            <section className="mt-12" aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-xl font-semibold tracking-tight">
                Bài liên quan
              </h2>
              <div className="mt-4 grid gap-4">
                {related.map((item) => (
                  <ArticleCard key={item.slug} post={item} headingLevel="h3" />
                ))}
              </div>
            </section>
          ) : null}
        </article>
        <aside className="hidden min-w-0 lg:block">
          <TableOfContents items={post.toc} />
        </aside>
      </div>
    </Container>
  );
}
