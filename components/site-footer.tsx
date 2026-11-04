import Link from "next/link";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { footerNav } from "@/lib/navigation";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="mt-auto border-t border-line">
      <div className="h-0.5 bg-accent" />
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 text-sm font-medium">{site.tagline}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{site.description}</p>
        </div>
        <nav aria-label="Chân trang">
          <p className="text-sm font-semibold">Trang</p>
          <ul className="mt-3 space-y-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold">Liên hệ</p>
          {site.contactEmail ? (
            <a
              className="mt-3 inline-block text-sm text-accent underline underline-offset-4"
              href={`mailto:${site.contactEmail}`}
            >
              {site.contactEmail}
            </a>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted">
              Email chính thức chưa được công bố. Xem{" "}
              <Link href="/contact/" className="text-accent underline underline-offset-4">
                trang liên hệ
              </Link>
              .
            </p>
          )}
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="py-4 text-sm text-muted">
          © {year} {site.name}
        </Container>
      </div>
    </footer>
  );
}
