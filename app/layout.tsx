import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const sans = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "600"], variable: "--font-sans", display: "swap" });
const serif = Lora({ subsets: ["latin", "vietnamese"], weight: ["400", "600"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://bloodycotech.com"),
  title: { default: "BloodyCoTech — Draw Something. Discover Something.", template: "%s · BloodyCoTech" },
  description: "Vẽ một điều gì đó. BloodyCoTech sẽ tìm một app, game hoặc câu chuyện có thể phù hợp với bạn ngay lúc này.",
  applicationName: "BloodyCoTech",
  authors: [{ name: "BloodyCoTech", url: siteConfig.url }],
  creator: "BloodyCoTech",
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
  alternates: { canonical: "/", languages: { vi: "/", en: "/en/", "x-default": "/" } },
  openGraph: { type: "website", url: "https://bloodycotech.com", siteName: "BloodyCoTech", title: "BloodyCoTech — Draw Something. Discover Something.", description: "A private, client-only drawing experience that gradually becomes your own." },
  other: { "google-adsense-account": siteConfig.adsensePublisherId },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi" data-scroll-behavior="smooth" className={`${sans.variable} ${serif.variable}`}><body>{children}</body></html>;
}
