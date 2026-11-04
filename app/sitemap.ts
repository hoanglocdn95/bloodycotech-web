import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const newest = getPublishedPosts()[0]?.updatedAt ?? site.contentUpdatedAt;
  const staticPages = [
    { path: "/", lastModified: newest },
    { path: "/blog/", lastModified: newest },
    { path: "/projects/", lastModified: site.contentUpdatedAt },
    { path: "/about/", lastModified: site.contentUpdatedAt },
    { path: "/contact/", lastModified: site.contentUpdatedAt },
    { path: "/privacy-policy/", lastModified: site.contentUpdatedAt },
  ];

  return [
    ...staticPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: page.lastModified,
    })),
    ...getPublishedPosts().map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}/`),
      lastModified: post.updatedAt,
    })),
  ];
}
