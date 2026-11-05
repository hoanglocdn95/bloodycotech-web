import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const description =
  "Nơi gửi một correction, góp ý cách giải thích hoặc trao đổi cụ thể về công việc frontend.";

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
        <PageHeader eyebrow="MESSAGE_CHANNEL" title="Liên hệ" description={description} />
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
            <h2>Hộp thư chưa mở</h2>
            <p>
              Mình chưa cấu hình địa chỉ công khai nên sẽ không đặt một form bấm gửi nhưng chẳng
              đi đâu. Khi hộp thư sẵn sàng, địa chỉ sẽ xuất hiện ở đây và dưới chân trang.
            </p>
          </>
        )}
        <h2>Một tin nhắn hữu ích nên có gì?</h2>
        <ul>
          <li>Báo một lỗi kỹ thuật trong bài, kèm đường dẫn bài và đoạn code liên quan.</li>
          <li>Góp ý về cách giải thích, nếu chỗ đó không khớp tài liệu được trích.</li>
          <li>Một đề nghị công việc hoặc trao đổi dự án có bối cảnh và đầu việc cụ thể.</li>
        </ul>
        <p>
          Mình không nhận bài guest post để đổi backlink và khó hỗ trợ debug một repository riêng
          nếu không có ví dụ tối thiểu để tái hiện.
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
