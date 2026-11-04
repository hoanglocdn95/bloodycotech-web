import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { formatDate } from "@/lib/format";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const description =
  "Chính sách bảo mật của BloodyCoTech: dữ liệu lưu trên trình duyệt, nhà cung cấp hạ tầng, và quảng cáo chưa được bật.";

export const metadata: Metadata = createMetadata({
  title: "Chính sách bảo mật",
  description,
  path: "/privacy-policy/",
});

export default function PrivacyPage() {
  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Chính sách bảo mật", path: "/privacy-policy/" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Chính sách bảo mật" },
        ]}
      />
      <div className="mt-6">
        <PageHeader
          eyebrow="Pháp lý"
          title="Chính sách bảo mật"
          description={description}
        />
      </div>
      <div className="article-body mt-8 max-w-3xl">
        <p>
          Có hiệu lực từ{" "}
          <time dateTime={site.contentUpdatedAt}>{formatDate(site.contentUpdatedAt)}</time>.
          Chính sách này mô tả đúng những gì website đang làm, và tách riêng những dịch vụ chưa
          được bật.
        </p>
        <h2>Ai điều hành website</h2>
        <p>
          BloodyCoTech là tên của website tại {site.url}. Trang này không công bố thông tin đăng
          ký doanh nghiệp, địa chỉ văn phòng hay tên người đại diện. Nếu những thông tin đó được
          bổ sung sau, chúng sẽ được ghi công khai cùng lúc.
        </p>
        <h2>Website không có tài khoản</h2>
        <p>
          Không có đăng ký, đăng nhập, bình luận, thanh toán hay biểu mẫu gửi dữ liệu về máy chủ
          của BloodyCoTech. Vì vậy website không giữ hồ sơ người dùng, mật khẩu hay danh sách email
          do chính nó thu thập.
        </p>
        {site.contactEmail ? (
          <p>
            Email liên hệ hiện tại là <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
            Thư bạn gửi tới địa chỉ đó được đọc để trả lời, không được bán.
          </p>
        ) : (
          <p>
            Email liên hệ chưa được công bố, nên cũng chưa có hộp thư của website để nhận dữ liệu
            từ người đọc. Xem <Link href="/contact/">trang liên hệ</Link>.
          </p>
        )}
        <h2>Dữ liệu lưu trên thiết bị của bạn</h2>
        <p>
          Trình duyệt lưu lựa chọn giao diện sáng hoặc tối trong <code>localStorage</code>, với
          khóa <code>{site.themeStorageKey}</code>. Giá trị chỉ là <code>light</code> hoặc{" "}
          <code>dark</code>. Khóa này nằm trên máy bạn, không được gửi về một API của
          BloodyCoTech. Bạn có thể xóa nó trong phần dữ liệu trang của trình duyệt.
        </p>
        <p>
          Các bài viết có ví dụ về <code>localStorage</code> và Web Audio. Đó là code minh họa
          trong nội dung, không phải tính năng đang ghi dữ liệu của người đọc khi họ chỉ xem bài.
        </p>
        <h2>Nhà cung cấp hạ tầng</h2>
        <p>
          Website được xuất bản dạng trang tĩnh trên Cloudflare Pages. Cloudflare xử lý kết nối tới
          website và có thể ghi nhật ký kỹ thuật như địa chỉ IP, thời điểm và URL theo chính sách
          của họ. BloodyCoTech không vận hành một sản phẩm phân tích truy cập riêng, và không nhúng
          Google Analytics.
        </p>
        <p>
          Chính sách của Cloudflare:{" "}
          <a href="https://www.cloudflare.com/privacypolicy/">cloudflare.com/privacypolicy</a>.
        </p>
        <h2>Cookie</h2>
        <p>
          BloodyCoTech không đặt cookie của riêng mình cho theme, thống kê hay quảng cáo. Lựa chọn
          giao diện dùng <code>localStorage</code>, không phải cookie. Website cũng không hiện một
          bảng đồng ý cookie giả cho một dịch vụ chưa được gắn.
        </p>
        <h2>Quảng cáo</h2>
        <p>
          Website hiện không hiển thị quảng cáo và không nhúng script Google AdSense. Không có đơn
          vị quảng cáo giả trên trang.
        </p>
        {site.adsensePublisherId ? (
          <p>
            Trang có thẻ meta <code>google-adsense-account</code> với publisher ID đã cấu hình, để
            Google kiểm tra quyền sở hữu site. Thẻ này không tải script quảng cáo và không đặt
            cookie quảng cáo.
          </p>
        ) : null}
        <p>
          Nếu sau này có tài khoản Google AdSense được chấp thuận và quảng cáo được bật, Google có
          thể dùng cookie để đo lượt hiển thị và, tùy cài đặt, cá nhân hóa quảng cáo. Khi việc đó
          xảy ra, chính sách này sẽ được cập nhật trước hoặc cùng lúc với lúc bật quảng cáo, và
          trang sẽ nói rõ cơ chế đồng ý nếu pháp luật yêu cầu. BloodyCoTech không bán dữ liệu cá
          nhân.
        </p>
        <h2>Liên kết ra ngoài</h2>
        <p>
          Bài viết dẫn tới tài liệu của bên thứ ba như React, Next.js, MDN, Cloudflare và các thư
          viện được nhắc tới. Những trang đó có chính sách riêng. BloodyCoTech không kiểm soát nội
          dung của họ.
        </p>
        <h2>Trẻ em</h2>
        <p>
          Nội dung dành cho người đang học lập trình. Website không cố ý thu thập dữ liệu của trẻ
          em, và cũng không có tài khoản để làm việc đó.
        </p>
        <h2>Thay đổi chính sách</h2>
        <p>
          Khi chính sách đổi, ngày ở đầu trang sẽ đổi theo. Bản đang hiển thị là bản áp dụng cho
          website tại thời điểm bạn đọc.
        </p>
        <h2>Liên hệ về chính sách</h2>
        <p>
          {site.contactEmail ? (
            <>
              Viết tới <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> nếu bạn có
              câu hỏi về chính sách này.
            </>
          ) : (
            <>
              Chưa có email công khai để nhận yêu cầu về chính sách. Khi địa chỉ được công bố, nó
              sẽ nằm trên <Link href="/contact/">trang liên hệ</Link>.
            </>
          )}
        </p>
      </div>
    </Container>
  );
}
