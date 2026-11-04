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
  "Định hướng sản phẩm độc lập của BloodyCoTech. Chỉ liệt kê dự án khi có bản phát hành công khai.";

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
        <PageHeader eyebrow="Studio" title="Dự án" description={description} />
      </div>
      <div className="article-body mt-8 max-w-3xl">
        <p>
          BloodyCoTech viết blog trước, rồi mới khoe sản phẩm. Hướng làm là các web game,
          công cụ tương tác và phần mềm nhỏ có thể chạy trên web. Một mục trên trang này cần đủ
          ba thứ: tên thật, mô tả đúng việc sản phẩm làm, và đường dẫn tới bản phát hành mà người
          đọc mở được.
        </p>
        <p>
          Không có lời chứng thực, lượt tải hay ảnh chụp được bịa để trang trông đầy hơn. Khi một
          sản phẩm chưa ra mắt, nó không xuất hiện ở đây. Các bài về âm thanh, lưu trạng thái và
          giao diện game là phần chuẩn bị kỹ thuật, không phải thông báo phát hành.
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
          Sản phẩm đang công khai
        </h2>
        {projects.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Chưa có sản phẩm công khai">
              Danh sách đang trống vì chưa có bản phát hành để kiểm chứng. Khi có, mỗi mục sẽ kèm
              ngày phát hành và liên kết ra sản phẩm.
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
