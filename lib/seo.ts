import type { Metadata } from "next";
import type { CategorySlug } from "@/lib/categories";
import { categories } from "@/lib/categories";
import { absoluteUrl, site } from "@/lib/site";
import type { PostSummary } from "@/lib/posts";

type PageMetaInput = {
  title?: string;
  description: string;
  path: string;
  article?: PostSummary;
};

export function createMetadata({
  title,
  description,
  path,
  article,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const isEnglish = path === "/en/" || path.startsWith("/en/");
  const isBlog = path === "/blog/" || path.startsWith("/blog/");
  const vietnamesePath = isEnglish ? path.replace(/^\/en(?=\/)/, "") : path;
  const englishPath = isEnglish ? path : path === "/" ? "/en/" : `/en${path}`;
  const socialTitle = title ? `${title} · ${site.name}` : `${site.name} — ${site.tagline}`;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: url,
      languages: isBlog
        ? { vi: absoluteUrl(path), "x-default": absoluteUrl(path) }
        : {
            vi: absoluteUrl(vietnamesePath || "/"),
            en: absoluteUrl(englishPath),
            "x-default": absoluteUrl(vietnamesePath || "/"),
          },
    },
    openGraph: article
      ? {
          title: socialTitle,
          description,
          url,
          siteName: site.name,
          locale: isEnglish ? "en_US" : site.locale,
          type: "article",
          publishedTime: article.publishedAt,
          modifiedTime: article.updatedAt,
          authors: [article.author],
          tags: article.tags,
        }
      : {
          title: socialTitle,
          description,
          url,
          siteName: site.name,
          locale: isEnglish ? "en_US" : site.locale,
          type: "website",
        },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
    },
  };
}

export function siteJsonLd() {
  const organization: Record<string, unknown> = {
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
  };

  if (site.contactEmail) {
    organization.email = site.contactEmail;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        name: site.name,
        url: site.url,
        description: site.description,
        inLanguage: site.language,
        publisher: {
          "@type": "Organization",
          name: site.name,
          url: site.url,
        },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(post: PostSummary) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: site.language,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}/`),
    articleSection: categories[post.category].label,
    keywords: post.tags,
    author: {
      "@type": "Organization",
      name: post.author,
      url: site.url,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
  };
}

export function categoryLabel(category: CategorySlug): string {
  return categories[category].label;
}
