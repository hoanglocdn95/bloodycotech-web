import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

const description =
  "BloodyCoTech là developer blog tiếng Việt và chỗ đứng cho các sản phẩm phần mềm độc lập sau này.";

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
        <PageHeader eyebrow="Về BloodyCoTech" title="Giới thiệu" description={description} />
      </div>
      <div className="article-body mt-8 max-w-3xl">
        <h2>Website này làm gì</h2>
        <p>
          BloodyCoTech xuất bản bài viết tiếng Việt về phát triển giao diện, TypeScript và game
          chạy trong trình duyệt. Mỗi bài cố gắng trả lời một câu cụ thể: công cụ này khác gì
          thứ cạnh nó, khi nào nên dùng, và khi nào nó làm code khó hơn.
        </p>
        <p>
          Ví dụ trong bài là code ngắn, bám API của phiên bản thư viện được nêu trong bài. Không
          có bảng điểm hiệu năng tự đo, không có câu chuyện khách hàng, và không có tiểu sử cá
          nhân. Những thứ đó chỉ được viết khi có dữ liệu thật.
        </p>
        <h2>Định hướng studio</h2>
        <p>
          Ngoài blog, BloodyCoTech là tên cho hướng làm sản phẩm độc lập: web game, công cụ tương
          tác và phần mềm nhỏ. Trang{" "}
          <Link href="/projects/">Dự án</Link> để trống cho đến khi có bản phát hành công khai.
          Bài viết về lưu game, âm thanh và giao diện cảm ứng là phần kỹ thuật dùng chung, không
          phải catalog sản phẩm.
        </p>
        <p>
          AI-assisted development là chủ đề sẽ được viết khi có bài đủ cụ thể. Trang này không
          biến nó thành khẩu hiệu, và cũng không gắn một quy trình làm việc chưa được mô tả công
          khai.
        </p>
        <h2>Cách đọc bài</h2>
        <p>
          Tác giả ghi trên bài là BloodyCoTech, tức tòa soạn của website, không phải một bút danh
          cá nhân. Ngày xuất bản và ngày cập nhật lấy từ metadata của từng file. Nếu hai ngày
          trùng nhau, bài chưa có lần sửa sau khi đăng.
        </p>
        <p>
          Cuối bài có liên kết nội bộ và liên kết tới tài liệu của React, Next.js, MDN hoặc nhà
          phát triển thư viện. Đó là chỗ để đối chiếu nếu API đổi sau ngày viết.
        </p>
        <h2>Những gì website không làm</h2>
        <p>
          Không có tài khoản, không có diễn đàn, không có thanh toán, và không có quảng cáo ở thời
          điểm này. Chi tiết về dữ liệu nằm trong{" "}
          <Link href="/privacy-policy/">chính sách bảo mật</Link>. Cách liên hệ nằm ở{" "}
          <Link href="/contact/">trang liên hệ</Link>.
        </p>
      </div>
    </Container>
  );
}
