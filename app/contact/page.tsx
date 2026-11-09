import type { Metadata } from "next";
import { InformationPage } from "@/components/information-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Liên hệ", description: "Liên hệ BloodyCoTech để báo lỗi, góp ý trải nghiệm hoặc trao đổi về quyền riêng tư.", alternates: { canonical: "/contact/", languages: { vi: "/contact/", en: "/en/contact/" } } };

export default function ContactPage() {
  return <InformationPage locale="vi" alternateHref="/en/contact/" eyebrow="Kênh liên hệ" title="Báo lỗi hoặc góp ý" intro="BloodyCoTech là dự án cá nhân. Email là cách liên hệ trực tiếp và không có biểu mẫu trung gian thu thập dữ liệu.">
    <h2>Email</h2><p><a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></p>
    <h2>Một báo lỗi hữu ích</h2><ul><li>Cho biết bạn dùng điện thoại hay máy tính và tên trình duyệt.</li><li>Mô tả các bước ngay trước khi lỗi xuất hiện.</li><li>Nếu có thể, ghi tên app hoặc game đang mở.</li></ul>
    <h2>Về dữ liệu cá nhân</h2><p>Không cần gửi bức vẽ hoặc hồ sơ số của bạn để báo lỗi. Nếu bạn chủ động gửi email, nội dung thư được dùng để đọc và trả lời, không được bán hoặc thêm vào danh sách quảng cáo.</p>
  </InformationPage>;
}
