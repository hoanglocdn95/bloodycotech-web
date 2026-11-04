export const primaryNav = [
  { href: "/blog/", label: "Blog" },
  { href: "/projects/", label: "Dự án" },
  { href: "/about/", label: "Giới thiệu" },
  { href: "/contact/", label: "Liên hệ" },
] as const;

export const footerNav = [
  ...primaryNav,
  { href: "/privacy-policy/", label: "Chính sách bảo mật" },
] as const;

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function isActivePath(pathname: string, href: string): boolean {
  const current = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === "/") return current === "/";
  return current === target || current.startsWith(`${target}/`);
}
