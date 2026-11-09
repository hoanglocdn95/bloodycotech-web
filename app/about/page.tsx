import type { Metadata } from "next";
import Link from "next/link";
import { InformationPage } from "@/components/information-page";

export const metadata: Metadata = { title: "Giới thiệu", description: "Vì sao BloodyCoTech bắt đầu từ một trang vẽ và trở thành một góc trải nghiệm cá nhân trên trình duyệt.", alternates: { canonical: "/about/", languages: { vi: "/about/", en: "/en/about/" } } };

export default function AboutPage() {
  return <InformationPage locale="vi" alternateHref="/en/about/" eyebrow="Một dự án cá nhân" title="BloodyCoTech đang được xây bởi một người" intro="Mình muốn biến domain này thành một nơi có ích ngay cả khi người ghé qua không muốn đăng ký, nhập thông tin hay đọc một bài dài.">
    <p>BloodyCoTech từng là nơi mình ghi chép về frontend. Phiên bản hiện tại đi theo một hướng cụ thể hơn: bạn vẽ vài nét, ứng dụng quan sát những đặc điểm có thể đo được và đề xuất một hoạt động nhỏ để thử ngay.</p>
    <h2>Vì sao bắt đầu bằng nét vẽ?</h2>
    <p>Một trang trắng ít gây áp lực hơn một bảng câu hỏi. Bạn không cần đặt tên cảm xúc hoặc kể chuyện riêng tư. Nét vẽ chỉ là đầu vào cho một thuật toán nhỏ chạy trên máy của bạn, không phải bài kiểm tra tính cách.</p>
    <h2>Điều mình muốn giữ</h2>
    <ul><li>Không giả vờ biết chắc người dùng đang nghĩ gì.</li><li>Không bắt tạo tài khoản để dùng những tính năng cơ bản.</li><li>Không tải tranh lên máy chủ hoặc bán dữ liệu cá nhân.</li><li>Mỗi app và game phải dùng được thật, không chỉ là một chiếc thẻ “sắp ra mắt”.</li></ul>
    <h2>Đây vẫn là một sản phẩm đang lớn lên</h2>
    <p>Pomodoro, vận động, không gian làm việc, các mini-game và bàn cờ là bộ trải nghiệm đầu tiên. Phản hồi “hợp” hoặc “chưa hợp” chỉ điều chỉnh hồ sơ cục bộ trên thiết bị. Bạn có thể xem hoặc xóa hồ sơ đó bất cứ lúc nào trong Góc của mình.</p>
    <p>Chi tiết kỹ thuật được giải thích tại <Link href="/how-it-works/">Cách BloodyCoTech hoạt động</Link>.</p>
  </InformationPage>;
}
