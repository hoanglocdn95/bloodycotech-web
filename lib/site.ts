import integrations from "@/config/integrations.json";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const verificationPattern = /^[A-Za-z0-9_-]{8,128}$/;
const adsensePublisherPattern = /^ca-pub-\d{16}$/;
const adsTxtPattern = /^google\.com, pub-\d{10,20}, DIRECT, f08c47fec0942fa0$/;

function readEmail(value: string): string {
  if (!value) return "";
  if (!emailPattern.test(value)) {
    throw new Error("contactEmail trong config/integrations.json không đúng dạng email.");
  }
  return value;
}

function readVerification(value: string): string {
  if (!value) return "";
  if (!verificationPattern.test(value)) {
    throw new Error(
      "googleSiteVerification chỉ được chứa chữ, số, gạch ngang và gạch dưới.",
    );
  }
  return value;
}

function readAdsensePublisherId(value: string): string {
  if (!value) return "";
  if (!adsensePublisherPattern.test(value)) {
    throw new Error(
      "adsensePublisherId phải là mã ca-pub- và 16 chữ số do Google AdSense cấp.",
    );
  }
  return value;
}

function readAdsTxt(value: string): string {
  if (!value) return "";
  if (!adsTxtPattern.test(value)) {
    throw new Error(
      "adsTxt phải là đúng một dòng do Google AdSense cung cấp, dạng: google.com, pub-..., DIRECT, f08c47fec0942fa0",
    );
  }
  return value;
}

export const site = {
  name: "BloodyCoTech",
  tagline: "Code. Build. Play.",
  url: "https://bloodycotech.com",
  locale: "vi_VN",
  language: "vi",
  description:
    "Góc web cá nhân để ghi chép frontend, ôn phỏng vấn và chia sẻ những game hoặc công cụ nhỏ đang được xây dựng.",
  contentUpdatedAt: "2026-11-05",
  themeStorageKey: "bloodycotech-theme",
  authorName: "BloodyCoTech",
  contactEmail: readEmail(integrations.contactEmail),
  googleSiteVerification: readVerification(integrations.googleSiteVerification),
  adsensePublisherId: readAdsensePublisherId(integrations.adsensePublisherId),
  adsTxt: readAdsTxt(integrations.adsTxt),
} as const;

export const themeInitScript = `(function(){try{var k=${JSON.stringify(site.themeStorageKey)};var s=localStorage.getItem(k);var t=s==="light"||s==="dark"?s:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(t==="dark")document.documentElement.classList.add("dark");document.documentElement.style.colorScheme=t;}catch(e){}})();`;

export function absoluteUrl(pathname: string): string {
  const hasExtension = pathHasExtension(pathname);
  const normalized = hasExtension
    ? pathname
    : pathname === "/" || pathname.endsWith("/")
      ? pathname
      : `${pathname}/`;
  return new URL(normalized, site.url).toString();
}

function pathHasExtension(pathname: string): boolean {
  const last = pathname.split("/").pop() ?? "";
  return last.includes(".");
}
