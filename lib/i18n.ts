export type Locale = "vi" | "en";

export const locales = ["vi", "en"] as const;

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "vi";
}

export function localizedPath(locale: Locale, path: string): string {
  const normalized = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === "vi") return normalized;
  return normalized === "/" ? "/en/" : `/en${normalized}`;
}

export function alternateLocalePath(pathname: string): string {
  if (pathname.includes("_not-found")) return localeFromPath(pathname) === "en" ? "/" : "/en/";
  if (localeFromPath(pathname) === "en") {
    const vietnamese = pathname.replace(/^\/en(?=\/|$)/, "");
    return vietnamese || "/";
  }

  // Blog posts are intentionally Vietnamese-only for now.
  if (pathname === "/blog" || pathname.startsWith("/blog/")) return "/en/";
  return pathname === "/" ? "/en/" : `/en${pathname}`;
}

export const chromeCopy = {
  vi: {
    nav: [
      { href: "/blog/", label: "Bài viết" },
      { href: "/interview/", label: "Ôn phỏng vấn" },
      { href: "/projects/", label: "Dự án" },
      { href: "/about/", label: "Giới thiệu" },
    ],
    contact: "Liên hệ",
    privacy: "Bảo mật",
    languageLabel: "Chuyển sang tiếng Anh",
    languageShort: "EN",
    menuOpen: "Mở menu",
    menuClose: "Đóng menu",
    primaryNav: "Điều hướng chính",
    mobileNav: "Điều hướng di động",
    footerNav: "Điều hướng chân trang",
    footerNote:
      "Một góc web cá nhân để ghi chép, luyện nghề và đóng gói những thứ mình đang xây.",
  },
  en: {
    nav: [
      { href: "/blog/", label: "Blog (VI)" },
      { href: "/en/interview/", label: "Interview prep" },
      { href: "/en/projects/", label: "Projects" },
      { href: "/en/about/", label: "About" },
    ],
    contact: "Contact",
    privacy: "Privacy",
    languageLabel: "Switch to Vietnamese",
    languageShort: "VI",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    primaryNav: "Primary navigation",
    mobileNav: "Mobile navigation",
    footerNav: "Footer navigation",
    footerNote:
      "A personal corner of the web for notes, deliberate practice, and things I am building.",
  },
} as const;
