import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { categories, isCategorySlug, type CategorySlug } from "@/lib/categories";
import { site } from "@/lib/site";
import { extractToc, type TocItem } from "@/lib/toc";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");
const PUBLIC_ROUTES = new Set([
  "/",
  "/blog",
  "/projects",
  "/about",
  "/contact",
  "/privacy-policy",
]);

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  category: CategorySlug;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  cover?: string;
  draft: boolean;
  featured: boolean;
};

export type Post = PostSummary & {
  content: string;
  toc: TocItem[];
};

type LoadResult = {
  posts: Post[];
  errors: string[];
};

let cache: Post[] | null = null;

function asDateString(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    ) {
      return value;
    }
  }
  return null;
}

function stripFences(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, " ");
}

function proseWordCount(markdown: string): number {
  return stripFences(markdown)
    .split(/\s+/)
    .filter((word) => word.trim().length > 0).length;
}

function normalizeRoute(href: string): string {
  const [withoutHash] = href.split("#");
  const pathOnly = withoutHash.split("?")[0];
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) {
    return pathOnly.slice(0, -1);
  }
  return pathOnly || "/";
}

function collectLinks(markdown: string): string[] {
  const links: string[] = [];
  const pattern = /\[[^\]]*\]\(([^)\s]+)\)/g;
  for (const match of stripFences(markdown).matchAll(pattern)) {
    links.push(match[1]);
  }
  return links;
}

function loadPosts(): LoadResult {
  const errors: string[] = [];
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"));

  const posts: Post[] = [];

  for (const file of files) {
    const filenameSlug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const parsed = matter(raw);
    const data = parsed.data as Record<string, unknown>;
    const where = file;

    const slug = typeof data.slug === "string" ? data.slug : "";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      errors.push(`${where}: slug phải là kebab-case.`);
    }
    if (slug !== filenameSlug) {
      errors.push(`${where}: slug phải trùng tên file.`);
    }

    const title = typeof data.title === "string" ? data.title.trim() : "";
    if (title.length < 12 || title.length > 100) {
      errors.push(`${where}: title cần từ 12 đến 100 ký tự.`);
    }

    const description =
      typeof data.description === "string" ? data.description.trim() : "";
    if (description.length < 60 || description.length > 180) {
      errors.push(
        `${where}: description dài ${description.length} ký tự, cần từ 60 đến 180.`,
      );
    }

    const category = typeof data.category === "string" ? data.category : "";
    if (!isCategorySlug(category)) {
      errors.push(
        `${where}: category phải là một trong ${Object.keys(categories).join(", ")}.`,
      );
    }

    const tags = Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === "string")
      : [];
    if (
      tags.length < 1 ||
      tags.length > 6 ||
      tags.some((tag) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag))
    ) {
      errors.push(`${where}: tags cần 1 đến 6 mục kebab-case.`);
    }

    const author = typeof data.author === "string" ? data.author : "";
    if (author !== site.authorName) {
      errors.push(`${where}: author phải là ${site.authorName}.`);
    }

    const publishedAt = asDateString(data.publishedAt);
    const updatedAt = asDateString(data.updatedAt);
    if (!publishedAt || !updatedAt) {
      errors.push(`${where}: publishedAt và updatedAt phải là YYYY-MM-DD.`);
    } else if (updatedAt < publishedAt) {
      errors.push(`${where}: updatedAt không được sớm hơn publishedAt.`);
    }

    if (typeof data.draft !== "boolean") {
      errors.push(`${where}: draft phải là true hoặc false.`);
    }
    const draft = data.draft === true;
    const featured = data.featured === true;

    let cover: string | undefined;
    if (data.cover != null) {
      if (typeof data.cover !== "string" || !data.cover.startsWith("/")) {
        errors.push(`${where}: cover phải là đường dẫn bắt đầu bằng /.`);
      } else if (!fs.existsSync(path.join(process.cwd(), "public", data.cover))) {
        errors.push(`${where}: không thấy file cover ${data.cover}.`);
      } else {
        cover = data.cover;
      }
    }

    const content = parsed.content.trim();
    if (/^#\s+/m.test(stripFences(content))) {
      errors.push(`${where}: nội dung không được có heading cấp 1. Tiêu đề lấy từ frontmatter.`);
    }
    if (!/^##\s+/m.test(content)) {
      errors.push(`${where}: cần ít nhất một heading cấp 2.`);
    }

    const banned = /\b(lorem ipsum|todo|tbd|placeholder)\b/i;
    if (banned.test(content) || banned.test(title) || banned.test(description)) {
      errors.push(`${where}: còn chữ đánh dấu nội dung chưa xong.`);
    }

    let inFence = false;
    for (const line of content.split("\n")) {
      if (!line.startsWith("```")) continue;
      if (!inFence) {
        const info = line.slice(3).trim();
        if (!info) {
          errors.push(`${where}: mọi code fence phải có ngôn ngữ.`);
          break;
        }
        inFence = true;
      } else {
        inFence = false;
      }
    }

    for (const include of content.matchAll(/include=(\S+)/g)) {
      const relative = include[1];
      if (!relative.startsWith("examples/") || relative.includes("..")) {
        errors.push(`${where}: include không hợp lệ ${relative}.`);
      } else if (!fs.existsSync(path.join(process.cwd(), relative))) {
        errors.push(`${where}: thiếu file ${relative}.`);
      }
    }

    if (!draft) {
      if (proseWordCount(content) < 450) {
        errors.push(`${where}: bài xuất bản cần ít nhất 450 từ ngoài code fence.`);
      }
      if (!content.includes("```")) {
        errors.push(`${where}: bài xuất bản cần ít nhất một code fence.`);
      }
    }

    if (!slug || !isCategorySlug(category) || !publishedAt || !updatedAt) {
      continue;
    }

    posts.push({
      slug,
      title,
      description,
      category,
      tags,
      author,
      publishedAt,
      updatedAt,
      cover,
      draft,
      featured,
      content,
      toc: extractToc(content),
    });
  }

  const publishedSlugs = new Set(posts.filter((post) => !post.draft).map((post) => post.slug));

  for (const post of posts) {
    for (const href of collectLinks(post.content)) {
      if (href.startsWith("#") || href.startsWith("mailto:")) continue;
      if (/^https?:\/\//.test(href)) continue;
      if (!href.startsWith("/")) {
        errors.push(`${post.slug}: link tương đối không được dùng (${href}).`);
        continue;
      }

      const route = normalizeRoute(href);
      if (PUBLIC_ROUTES.has(route)) continue;
      const blogMatch = /^\/blog\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(route);
      if (blogMatch && publishedSlugs.has(blogMatch[1])) continue;
      errors.push(`${post.slug}: link nội bộ không tồn tại (${href}).`);
    }

    if (!post.draft) {
      const links = collectLinks(post.content);
      if (!links.some((href) => href.startsWith("/"))) {
        errors.push(`${post.slug}: bài xuất bản cần ít nhất một link nội bộ.`);
      }
      if (!links.some((href) => href.startsWith("https://"))) {
        errors.push(`${post.slug}: bài xuất bản cần ít nhất một link tài liệu ngoài.`);
      }
    }
  }

  const slugs = posts.map((post) => post.slug);
  const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  for (const slug of new Set(duplicates)) {
    errors.push(`Slug bị trùng: ${slug}.`);
  }

  if (!posts.some((post) => !post.draft)) {
    errors.push("Cần ít nhất một bài không ở trạng thái draft.");
  }

  return { posts, errors };
}

function getCachedPosts(): Post[] {
  if (process.env.NODE_ENV === "production" && cache) return cache;
  const { posts, errors } = loadPosts();
  if (errors.length > 0) {
    throw new Error(`Nội dung blog không hợp lệ:\n- ${errors.join("\n- ")}`);
  }
  posts.sort((a, b) => {
    const byDate = b.publishedAt.localeCompare(a.publishedAt);
    return byDate === 0 ? a.slug.localeCompare(b.slug) : byDate;
  });
  if (process.env.NODE_ENV === "production") cache = posts;
  return posts;
}

function toSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    tags: post.tags,
    author: post.author,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    cover: post.cover,
    draft: post.draft,
    featured: post.featured,
  };
}

export function getPublishedPosts(): PostSummary[] {
  return getCachedPosts()
    .filter((post) => !post.draft)
    .map(toSummary);
}

export function getPost(slug: string): Post | null {
  const post = getCachedPosts().find((item) => item.slug === slug && !item.draft);
  return post ?? null;
}

export function getFeaturedPosts(): PostSummary[] {
  const published = getPublishedPosts();
  const featured = published.filter((post) => post.featured);
  const used = new Set(featured.map((post) => post.slug));
  const fillers = published.filter((post) => !used.has(post.slug));
  return [...featured, ...fillers].slice(0, 3);
}

export function getLatestPosts(limit = 5): PostSummary[] {
  const featured = new Set(getFeaturedPosts().map((post) => post.slug));
  return getPublishedPosts()
    .filter((post) => !featured.has(post.slug))
    .slice(0, limit);
}

export function getCategoryCounts(): Record<CategorySlug, number> {
  const counts = {
    react: 0,
    typescript: 0,
    "ha-tang": 0,
    "web-game": 0,
  } satisfies Record<CategorySlug, number>;

  for (const post of getPublishedPosts()) {
    counts[post.category] += 1;
  }
  return counts;
}

export function getRelatedPosts(slug: string, limit = 3): PostSummary[] {
  const published = getPublishedPosts();
  const current = published.find((post) => post.slug === slug);
  if (!current) return [];

  return published
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => current.tags.includes(tag)).length;
      const score = (post.category === current.category ? 2 : 0) + sharedTags;
      return { post, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score || b.post.publishedAt.localeCompare(a.post.publishedAt),
    )
    .slice(0, limit)
    .map((item) => item.post);
}

export function getAdjacentPosts(slug: string): {
  newer: PostSummary | null;
  older: PostSummary | null;
} {
  const published = getPublishedPosts();
  const index = published.findIndex((post) => post.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return {
    newer: published[index - 1] ?? null,
    older: published[index + 1] ?? null,
  };
}
