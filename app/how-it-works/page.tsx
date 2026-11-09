import type { Metadata } from "next";
import { InformationPage } from "@/components/information-page";

export const metadata: Metadata = { title: "Cách hoạt động", description: "BloodyCoTech phân tích nét vẽ và cá nhân hóa đề xuất như thế nào mà không tải tranh lên máy chủ.", alternates: { canonical: "/how-it-works/", languages: { vi: "/how-it-works/", en: "/en/how-it-works/" } } };

export default function HowItWorksPage() {
  return <InformationPage locale="vi" alternateHref="/en/how-it-works/" eyebrow="Bên trong ứng dụng" title="Từ vài nét vẽ đến một đề xuất" intro="Không có AI đọc suy nghĩ ở đây. BloodyCoTech dùng những phép đo hình học và màu sắc đơn giản, rồi so chúng với đặc điểm của từng trải nghiệm trong thư viện.">
    <h2>1. Nét vẽ chỉ nằm trong bộ nhớ tạm</h2>
    <p>Khi bạn vẽ, trình duyệt giữ danh sách điểm để hiển thị canvas, hoàn tác và làm lại. Danh sách đó không được ghi vào <code>localStorage</code>, không gửi tới API và biến mất khi tải lại hoặc đóng trang.</p>
    <h2>2. Ứng dụng biến tranh thành các con số</h2>
    <p>Sau khi nhấn “Xong rồi”, thuật toán đo số nét, độ phủ trang, tâm của hình, tốc độ di chuyển, mức dùng rìa, độ cong, độ cân bằng trái–phải, độ sáng, độ bão hòa và màu chủ đạo. Từ đó nó tạo sáu tín hiệu gợi ý: năng lượng, áp lực, độ mở, tập trung, ấm áp và tính chơi.</p>
    <p className="information-note">Các tín hiệu này là quy ước thiết kế để xếp hạng trải nghiệm. Chúng không phải chẩn đoán tâm lý, không chứng minh cảm xúc và không dùng cho quyết định y tế hay nghề nghiệp.</p>
    <h2>3. Xếp hạng trải nghiệm</h2>
    <p>Mỗi app, game hoặc đoạn chữ có một hồ sơ mục tiêu. Hệ thống tính khoảng cách giữa hồ sơ đó với lần vẽ hiện tại, sau đó cộng thêm phản hồi “hợp/chưa hợp” và ưu tiên một chút cho nội dung bạn chưa mở gần đây.</p>
    <h2>4. Cá nhân hóa dần trên thiết bị</h2>
    <p>Từ lần thứ hai, đề xuất kết hợp 70% tín hiệu hiện tại và 30% trung bình lịch sử. Chỉ hồ sơ số, lượt mở và phản hồi được lưu. Bạn có thể xóa toàn bộ bằng một nút trong Góc của mình.</p>
    <h2>5. Không có backend ẩn phía sau</h2>
    <p>Ứng dụng được xuất bản như các file tĩnh. Âm thanh ở Góc làm việc được tổng hợp bằng Web Audio sau khi bạn bấm phát. Không có request phân tích, tài khoản hoặc đồng bộ đám mây.</p>
  </InformationPage>;
}
