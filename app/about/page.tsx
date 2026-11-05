import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

const description =
  "BloodyCoTech là góc web cá nhân để mình ghi chép việc học, luyện nghề và chia sẻ những thứ đang xây.";

export const metadata: Metadata = createMetadata({
  title: "Giới thiệu",
  description,
  path: "/about/",
});

export default function AboutPage() {
  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Giới thiệu", path: "/about/" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu" },
        ]}
      />
      <div className="mt-6">
        <PageHeader eyebrow="PLAYER_PROFILE" title="BloodyCoTech là ai?" description={description} />
      </div>
      <div className="article-body mt-8 max-w-3xl">
        <p>
          Mình làm trang này vì bookmark ngày một dài còn trí nhớ thì không. Một link được lưu
          lại chưa có nghĩa là mình đã hiểu. Viết ra buộc mình phải chọn ví dụ, nói rõ đánh đổi
          và nhận ra chỗ nào vẫn còn mơ hồ.
        </p>
        <h2>Ở đây có gì</h2>
        <p>
          Trọng tâm hiện tại là frontend: React, TypeScript, browser API, responsive, hiệu năng
          và vài mảnh ghép để làm game chạy trên web. Mục ôn phỏng vấn là tài liệu mình thực sự
          dùng, bám theo một JD ReactJS thay vì gom câu hỏi cho đủ số lượng.
        </p>
        <p>
          Ví dụ code được typecheck hoặc test khi hợp lý. Nếu API có thể đổi, bài sẽ ghi phiên bản
          và dẫn tài liệu gốc để người đọc kiểm lại. Nếu mình chưa biết hoặc chưa đo, mình sẽ nói
          đúng như vậy.
        </p>
        <h2>Từ blog tới sản phẩm</h2>
        <p>
          Mình muốn BloodyCoTech dần có web game, công cụ tương tác và phần mềm nhỏ. Trang{" "}
          <Link href="/projects/">Dự án</Link> sẽ ghi cả thử nghiệm lẫn bản phát hành, nhưng mỗi mục
          phải có trạng thái rõ ràng và một thứ có thể kiểm chứng. Repo trống không được gọi là sản phẩm.
        </p>
        <h2>Nguyên tắc mình muốn giữ</h2>
        <ul>
          <li>Không bịa khách hàng, người dùng, lượt tải hay testimonial.</li>
          <li>Không giấu phần chưa xong sau những câu chữ nghe có vẻ chuyên nghiệp.</li>
          <li>Ưu tiên ví dụ nhỏ chạy được hơn một bài dài nhưng không kiểm chứng.</li>
          <li>Sửa bài khi phát hiện sai và cập nhật ngày thay vì âm thầm thay nội dung.</li>
        </ul>
        <h2>Ngôn ngữ</h2>
        <p>
          Giao diện và các trang thông tin có tiếng Việt lẫn tiếng Anh. Bài chia sẻ vẫn ưu tiên
          tiếng Việt để mình viết tự nhiên và đều hơn; không dịch máy chỉ để có thêm một URL.
          Chi tiết dữ liệu và trạng thái quảng cáo nằm trong{" "}<Link href="/privacy-policy/">chính sách bảo mật</Link>.
        </p>
      </div>
    </Container>
  );
}
