import type { Metadata } from "next";
import Link from "next/link";
import { InformationPage } from "@/components/information-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Chính sách riêng tư", description: "Dữ liệu nào BloodyCoTech lưu trên thiết bị, điều gì không được gửi đi và trạng thái kết nối AdSense.", alternates: { canonical: "/privacy/", languages: { vi: "/privacy/", en: "/en/privacy/" } } };

export default function PrivacyPage() {
  return <InformationPage locale="vi" alternateHref="/en/privacy/" eyebrow="Chính sách riêng tư" title="Riêng tư, nói cho rõ" intro="Có hiệu lực từ 09/11/2026. BloodyCoTech là ứng dụng tĩnh chạy trong trình duyệt và không có hệ thống tài khoản.">
    <h2>Tranh của bạn</h2><p>Tranh và từng nét vẽ chỉ tồn tại trong bộ nhớ của trang đang mở. Ứng dụng không tải tranh lên máy chủ, không gọi API phân tích và không lưu ảnh hoặc danh sách nét trong <code>localStorage</code>. Tải lại hoặc đóng trang sẽ xóa dữ liệu nét vẽ.</p>
    <h2>Hồ sơ bằng số</h2><p>Sau khi hoàn thành một bức vẽ, ứng dụng tính các thông số như phạm vi, vị trí, tốc độ, số nét, độ cong, màu chủ đạo và sáu tín hiệu gợi ý. Chỉ các con số này, lượt mở trải nghiệm và phản hồi hợp/chưa hợp được lưu dưới khóa <code>bloodycotech:personal-profile:v1</code> trên thiết bị.</p><p>Các tín hiệu không phải chẩn đoán tâm lý. Bạn có thể xem và xóa toàn bộ hồ sơ trong “Góc của mình”.</p>
    <h2>Hosting và nhật ký kỹ thuật</h2><p>Website được phục vụ qua Cloudflare. Cloudflare có thể xử lý địa chỉ IP, URL, thời gian truy cập và thông tin kết nối để vận hành, bảo mật và phân phối nội dung theo <a href="https://www.cloudflare.com/privacypolicy/">chính sách riêng tư của Cloudflare</a>. BloodyCoTech hiện không cài Google Analytics hoặc hệ thống analytics riêng.</p>
    <h2>Google AdSense</h2><p>Website công bố Publisher ID bằng thẻ meta <code>google-adsense-account</code> và file <code>ads.txt</code> để Google xác minh quyền quản lý tên miền. Hiện luồng vẽ và các trải nghiệm không tải script AdSense, không có ad unit và không đặt cookie quảng cáo.</p><p>Nếu quảng cáo được bật trong tương lai, chính sách này sẽ được cập nhật và cơ chế xin lựa chọn/đồng ý phù hợp sẽ được triển khai trước khi quảng cáo cá nhân hóa hoạt động. Chính sách Google: <a href="https://policies.google.com/privacy">policies.google.com/privacy</a>.</p>
    <h2>Email</h2><p>Nếu bạn chủ động gửi email tới <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>, nội dung thư được dùng để đọc và trả lời yêu cầu. Email không được bán hoặc thêm vào danh sách quảng cáo.</p>
    <h2>Liên kết bên ngoài</h2><p>Các trang thông tin có thể dẫn tới Cloudflare hoặc Google. Khi mở liên kết đó, chính sách của bên tương ứng được áp dụng.</p>
    <h2>Thay đổi và liên hệ</h2><p>Khi hành vi dữ liệu thay đổi, ngày hiệu lực và nội dung trang này sẽ được cập nhật. Câu hỏi về riêng tư có thể gửi qua <Link href="/contact/">trang liên hệ</Link>.</p>
  </InformationPage>;
}
