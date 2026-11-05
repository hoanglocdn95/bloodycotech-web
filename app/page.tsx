import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Gamepad2, Terminal } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { PixelHero } from "@/components/pixel-hero";
import { categories } from "@/lib/categories";
import { getCategoryCounts, getFeaturedPosts, getLatestPosts, getPublishedPosts } from "@/lib/posts";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  description: site.description,
  path: "/",
});

export default function HomePage() {
  const published = getPublishedPosts();
  const featured = getFeaturedPosts();
  const latest = getLatestPosts(5);
  const counts = getCategoryCounts();

  return (
    <Container className="py-10 sm:py-14">
      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
        <div>
          <p className="hud-label">SAVE_POINT // PERSONAL DEV LOG</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
            Viết code. Gỡ lỗi. <span className="text-accent">Ghi lại đường đi.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            BloodyCoTech là góc làm việc cá nhân của mình: ghi chú frontend đã tự kiểm tra,
            bài luyện phỏng vấn đang dùng và những game nhỏ còn nằm trên bàn làm việc.
            Không phải một “studio” bóng bẩy—chỉ là nơi mình làm nghề công khai hơn một chút.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/blog/" className="pixel-button gap-2">
              <BookOpen className="size-4" aria-hidden="true" /> Đọc ghi chú
            </Link>
            <Link href="/interview/" className="pixel-button pixel-button--quiet gap-2">
              <Terminal className="size-4" aria-hidden="true" /> Vào phòng luyện tập
            </Link>
          </div>
          <dl className="mt-9 grid max-w-2xl grid-cols-3 gap-3">
            <Stat value={String(published.length).padStart(2, "0")} label="ghi chú" />
            <Stat value="04" label="chủ đề" />
            <Stat value="VI/EN" label="giao diện" />
          </dl>
        </div>
        <PixelHero />
      </section>

      <section className="mt-20" aria-labelledby="featured-heading">
        <SectionHeading
          id="featured-heading"
          eyebrow="QUEST_LOG"
          title="Bắt đầu từ đây"
          href="/blog/"
          linkLabel="Xem toàn bộ bài viết"
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {featured.map((post) => <ArticleCard key={post.slug} post={post} headingLevel="h3" />)}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="pixel-card p-6 sm:p-8">
          <p className="hud-label">NEW_MODE // INTERVIEW PREP</p>
          <h2 className="mt-4 text-3xl font-bold">Ôn Frontend theo một JD thật</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted">
            Mình vừa gom lại lộ trình cho vị trí ReactJS từ 2 năm kinh nghiệm: JavaScript,
            TypeScript, React, state, REST API, responsive, performance, Git và cách phối hợp
            trong dự án outsourcing Nhật. Có câu hỏi tự kiểm tra, ví dụ và bài tập thực hành.
          </p>
          <Link href="/interview/" className="mt-6 inline-flex items-center gap-2 font-semibold text-accent">
            Mở bộ ôn tập <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="pixel-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Gamepad2 className="size-6 text-accent-2" aria-hidden="true" />
            <p className="hud-label">BUILD_QUEUE</p>
          </div>
          <h2 className="mt-4 text-2xl font-bold">Sản phẩm chưa cần giả vờ đã xong</h2>
          <p className="mt-3 leading-7 text-muted">
            Trang dự án sẽ có cả bản thử nghiệm và bản phát hành. Mỗi mục phải nói rõ trạng thái,
            điều đang học và đường dẫn có thể kiểm chứng.
          </p>
          <Link href="/projects/" className="mt-5 inline-flex items-center gap-2 font-semibold text-accent">
            Xem hàng đợi <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="latest-heading">
        <SectionHeading id="latest-heading" eyebrow="RECENT_DROPS" title="Ghi chú gần đây" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => <ArticleCard key={post.slug} post={post} headingLevel="h3" />)}
        </div>
      </section>

      <section className="mt-20" aria-labelledby="topics-heading">
        <SectionHeading id="topics-heading" eyebrow="SKILL_TREE" title="Mình đang viết về" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(Object.keys(categories) as Array<keyof typeof categories>).map((key, index) => (
            <Link key={key} href={`/blog/#${key}`} className="pixel-card flex items-center gap-4 p-5 hover:-translate-y-0.5">
              <span className="font-mono text-sm text-accent">0{index + 1}</span>
              <span className="flex-1">
                <span className="block font-display text-lg font-bold">{categories[key].label}</span>
                <span className="mt-1 block text-sm text-muted">{categories[key].description}</span>
              </span>
              <span className="font-mono text-xs text-muted">{counts[key]} bài</span>
            </Link>
          ))}
        </div>
      </section>
    </Container>
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

function SectionHeading({
  id,
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  id: string;
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="hud-label">{"// "}{eyebrow}</p>
        <h2 id={id} className="mt-2 text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {href && linkLabel ? <Link href={href} className="font-mono text-xs text-accent hover:underline">{linkLabel} →</Link> : null}
    </div>
  );
}
