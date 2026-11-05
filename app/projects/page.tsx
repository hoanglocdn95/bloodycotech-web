import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { getPublishedPosts } from "@/lib/posts";
import { projects } from "@/lib/projects";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";

const description =
  "Hàng đợi công khai cho thử nghiệm, sản phẩm đang làm, bản đã phát hành và những thứ đã lưu kho.";

export const metadata: Metadata = createMetadata({
  title: "Dự án",
  description,
  path: "/projects/",
});

const preparationSlugs = [
  "giao-dien-game-responsive",
  "localstorage-trang-thai-ung-dung-va-game",
  "web-audio-api",
];

export default function ProjectsPage() {
  const preparation = getPublishedPosts().filter((post) =>
    preparationSlugs.includes(post.slug),
  );

  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Dự án", path: "/projects/" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Dự án" },
        ]}
      />
      <div className="mt-6">
        <PageHeader eyebrow="BUILD_QUEUE" title="Dự án" description={description} />
      </div>
      <div className="article-body mt-8 max-w-3xl">
        <p>
          Mình từng đặt tiêu chuẩn “chỉ hiện khi phát hành xong”, nhưng cách đó làm mọi thứ đang
          học biến mất khỏi trang. Từ bây giờ, thử nghiệm có thể xuất hiện sớm hơn—miễn là có thứ
          để mở, trạng thái rõ ràng và ghi đúng phần còn thiếu.
        </p>
        <p>
          Mỗi dự án sẽ thuộc một trong bốn trạng thái: <strong>thử nghiệm</strong>,{" "}
          <strong>đang làm</strong>, <strong>đã phát hành</strong> hoặc <strong>lưu kho</strong>.
          Không có số người dùng, testimonial hay tiến độ được bịa để lấp chỗ trống.
        </p>
        {preparation.length > 0 ? (
          <>
            <h2>Bài kỹ thuật đang có</h2>
            <ul>
              {preparation.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
      <section className="mt-10" aria-labelledby="released-heading">
        <h2 id="released-heading" className="text-2xl font-semibold tracking-tight">
          Bản có thể mở ngay
        </h2>
        {projects.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Hàng đợi hiện chưa có bản chơi được">
              Đây là trạng thái thật ở thời điểm hiện tại. Mục ôn phỏng vấn là phần lớn đầu tiên
              được thêm trong lần dựng lại này; thử nghiệm game sẽ chỉ lên đây khi có URL chạy được.
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4">
            {projects.map((project) => (
              <li key={project.slug} className="rounded-2xl border border-line bg-surface p-5">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="mt-2 text-muted">{project.summary}</p>
                <p className="mt-3 text-sm text-muted">
                  Phát hành <time dateTime={project.releasedAt}>{formatDate(project.releasedAt)}</time>
                </p>
                <a
                  href={project.url}
                  className="mt-3 inline-flex text-sm font-semibold text-accent"
                  rel="noopener noreferrer"
                >
                  Xem sản phẩm
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="mt-8 text-sm text-muted">
        Trong lúc chờ sản phẩm, có thể đọc{" "}
        <Link href="/blog/" className="text-accent underline underline-offset-4">
          blog
        </Link>{" "}
        hoặc phần{" "}
        <Link href="/about/" className="text-accent underline underline-offset-4">
          giới thiệu
        </Link>
        .
      </p>
    </Container>
  );
}
