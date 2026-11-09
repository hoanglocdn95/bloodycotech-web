import type { Metadata } from "next";
import Link from "next/link";
import { InformationPage } from "@/components/information-page";

export const metadata: Metadata = { title: "Điều khoản sử dụng", description: "Phạm vi, giới hạn và trách nhiệm khi sử dụng BloodyCoTech.", alternates: { canonical: "/terms/", languages: { vi: "/terms/", en: "/en/terms/" } } };

export default function TermsPage() {
  return <InformationPage locale="vi" alternateHref="/en/terms/" eyebrow="Điều khoản sử dụng" title="Dùng để khám phá, không dùng để chẩn đoán" intro="Có hiệu lực từ 09/11/2026. Việc tiếp tục sử dụng website đồng nghĩa bạn hiểu phạm vi của một sản phẩm thử nghiệm chạy trên trình duyệt.">
    <h2>Mục đích</h2><p>BloodyCoTech cung cấp công cụ vẽ, các app nhỏ, trò chơi và nội dung đọc ngắn để giải trí, tập trung hoặc nghỉ giữa giờ. Kết quả phân tích nét vẽ chỉ dùng để sắp xếp các trải nghiệm này.</p>
    <h2>Không phải tư vấn chuyên môn</h2><p>Những con số và lời giải thích không phải đánh giá tâm lý, y tế, pháp lý, tài chính hoặc nghề nghiệp. Không dùng chúng để tự chẩn đoán hay đưa ra quyết định có ảnh hưởng lớn.</p>
    <h2>Dữ liệu trên thiết bị</h2><p>Hồ sơ cá nhân hóa nằm trong trình duyệt của bạn. Xóa dữ liệu trình duyệt, dùng chế độ riêng tư hoặc đổi thiết bị có thể làm mất hồ sơ. BloodyCoTech không thể khôi phục dữ liệu đó.</p>
    <h2>Trò chơi và nội dung</h2><p>Các trò chơi được cung cấp ở trạng thái hiện có. Điểm số không có giá trị tiền tệ, không thể đổi thưởng và không liên quan tới cờ bạc. Các câu trích dẫn ghi tên tác giả khi có nguồn gán phổ biến; nếu phát hiện gán sai, vui lòng báo qua <Link href="/contact/">trang liên hệ</Link>.</p>
    <h2>Tính khả dụng</h2><p>Tính năng có thể được sửa, thay đổi hoặc tạm ngừng để khắc phục lỗi. Website không cam kết hoạt động không gián đoạn trên mọi trình duyệt cũ.</p>
    <h2>Quyền riêng tư</h2><p>Cách website xử lý dữ liệu và trạng thái kết nối quảng cáo được mô tả trong <Link href="/privacy/">chính sách riêng tư</Link>.</p>
  </InformationPage>;
}
