import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  description: "Đường dẫn này không có trên BloodyCoTech.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="py-20">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Không tìm thấy trang
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">
        Đường dẫn không khớp trang nào đang xuất bản. Có thể bài đã được giữ ở trạng thái nháp,
        hoặc địa chỉ bị gõ thiếu.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent"
        >
          Về trang chủ
        </Link>
        <Link
          href="/blog/"
          className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm font-semibold"
        >
          Xem blog
        </Link>
      </div>
    </Container>
  );
}
