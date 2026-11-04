import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const description =
  "Cách liên hệ BloodyCoTech. Website chỉ hiển thị email khi địa chỉ chính thức đã được cấu hình.";

export const metadata: Metadata = createMetadata({
  title: "Liên hệ",
  description,
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Liên hệ", path: "/contact/" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Liên hệ" },
        ]}
      />
      <div className="mt-6">
        <PageHeader eyebrow="Liên hệ" title="Liên hệ" description={description} />
      </div>
      <div className="article-body mt-8 max-w-3xl">
        {site.contactEmail ? (
          <>
            <h2>Email</h2>
            <p>
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </p>
          </>
        ) : (
          <>
            <h2>Email chưa được công bố</h2>
            <p>
              BloodyCoTech chưa có địa chỉ email chính thức trên website. Trang này không dùng
              địa chỉ giả và không có biểu mẫu, vì không có máy chủ để nhận dữ liệu. Khi email
              được thêm vào cấu hình, nó sẽ hiện tại đây, ở chân trang và trong chính sách bảo mật.
            </p>
          </>
        )}
        <h2>Nên viết gì khi đã có hộp thư</h2>
        <p>Hộp thư dự kiến dùng cho ba việc:</p>
        <ul>
          <li>Báo một lỗi kỹ thuật trong bài, kèm đường dẫn bài và đoạn code liên quan.</li>
          <li>Góp ý về cách giải thích, nếu chỗ đó không khớp tài liệu được trích.</li>
          <li>Trao đổi về một sản phẩm khi BloodyCoTech đã có bản phát hành công khai.</li>
        </ul>
        <p>
          Website không nhận hỗ trợ bài tập, không sửa dự án riêng của người đọc, và không đăng
          bài viết khách để đổi liên kết.
        </p>
        <h2>Trong lúc chưa có email</h2>
        <p>
          Có thể đối chiếu bài viết với tài liệu được dẫn ở cuối mỗi bài, hoặc đọc{" "}
          <Link href="/about/">giới thiệu</Link> và{" "}
          <Link href="/privacy-policy/">chính sách bảo mật</Link> để biết website đang thu thập
          những gì. Câu trả lời hiện tại: không có tài khoản, không có form, và giao diện sáng tối
          chỉ lưu trên trình duyệt của bạn.
        </p>
      </div>
    </Container>
  );
}
