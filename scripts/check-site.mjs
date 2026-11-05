import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const matter = require("gray-matter");

const root = process.cwd();
const outDir = path.join(root, "out");
const errors = [];

function fail(message) {
  errors.push(message);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function pageUrl(file) {
  const relative = path.relative(outDir, file).split(path.sep).join("/");
  if (relative === "index.html") return "https://bloodycotech.com/";
  if (relative.endsWith("/index.html")) {
    return `https://bloodycotech.com/${relative.slice(0, -"index.html".length)}`;
  }
  return `https://bloodycotech.com/${relative}`;
}

function routeToFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  if (path.posix.extname(decoded)) {
    return path.join(outDir, decoded.replace(/^\//, ""));
  }
  const directory = decoded === "/" ? "" : decoded.replace(/^\//, "").replace(/\/$/, "");
  return path.join(outDir, directory, "index.html");
}

const contentDir = path.join(root, "content/blog");
const published = [];
const drafts = [];
for (const file of fs.readdirSync(contentDir).filter((name) => name.endsWith(".mdx"))) {
  const parsed = matter(fs.readFileSync(path.join(contentDir, file), "utf8"));
  const slug = parsed.data.slug;
  if (parsed.data.draft) drafts.push(slug);
  else published.push(slug);
}

const required = [
  "index.html",
  "404.html",
  "blog/index.html",
  "projects/index.html",
  "about/index.html",
  "contact/index.html",
  "privacy-policy/index.html",
  "interview/index.html",
  "en/index.html",
  "en/interview/index.html",
  "en/projects/index.html",
  "en/about/index.html",
  "en/contact/index.html",
  "en/privacy-policy/index.html",
  "sitemap.xml",
  "robots.txt",
  "icon.svg",
];

for (const relative of required) {
  if (!fs.existsSync(path.join(outDir, relative))) fail(`Thiếu ${relative}`);
}

for (const slug of published) {
  const file = path.join(outDir, "blog", slug, "index.html");
  if (!fs.existsSync(file)) fail(`Thiếu bài ${slug}`);
}

for (const slug of drafts) {
  const file = path.join(outDir, "blog", slug, "index.html");
  if (fs.existsSync(file)) fail(`Bài draft bị xuất bản: ${slug}`);
}

const sitemap = fs.readFileSync(path.join(outDir, "sitemap.xml"), "utf8");
const robots = fs.readFileSync(path.join(outDir, "robots.txt"), "utf8");
if (!robots.includes("Sitemap: https://bloodycotech.com/sitemap.xml\n")) {
  fail("robots.txt chưa trỏ sitemap production");
}

for (const slug of published) {
  if (!sitemap.includes(`https://bloodycotech.com/blog/${slug}/`)) {
    fail(`Sitemap thiếu ${slug}`);
  }
}
for (const slug of drafts) {
  if (sitemap.includes(slug)) fail(`Sitemap chứa draft ${slug}`);
}

const htmlFiles = walk(outDir).filter((file) => file.endsWith(".html"));
const adsenseSrc =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4663633976089574";
const joined = htmlFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
if (!htmlFiles.every((file) => fs.readFileSync(file, "utf8").includes(adsenseSrc))) {
  fail("Có trang HTML thiếu script AdSense");
}
if (joined.toLowerCase().includes("lorem ipsum")) fail("Còn lorem ipsum");
const adsTxtPath = path.join(outDir, "ads.txt");
if (!fs.existsSync(adsTxtPath)) fail("Thiếu ads.txt đã cấu hình");
else if (
  fs.readFileSync(adsTxtPath, "utf8").trim() !==
  "google.com, pub-4663633976089574, DIRECT, f08c47fec0942fa0"
) {
  fail("ads.txt không khớp publisher ID đã cấu hình");
}

const anchor = /<a\b[^>]*\shref="([^"]+)"/g;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(anchor)) {
    const href = match[1];
    if (
      href.startsWith("mailto:") ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("//")
    ) {
      continue;
    }

    const url = new URL(href, pageUrl(file));
    if (url.origin !== "https://bloodycotech.com") continue;
    const target = routeToFile(url.pathname);
    if (!fs.existsSync(target)) {
      fail(`${path.relative(outDir, file)} -> ${href} không có file`);
      continue;
    }
    if (!url.hash) continue;
    const id = decodeURIComponent(url.hash.slice(1));
    const targetHtml = fs.readFileSync(target, "utf8");
    if (!targetHtml.includes(`id="${id}"`)) {
      fail(`${path.relative(outDir, file)} -> #${id} không có id`);
    }
  }
}

const home = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
if (!home.includes('lang="vi"')) fail("Trang chủ thiếu lang=vi");
if (!home.includes("bloodycotech-theme")) fail("Thiếu script theme");
if (!home.includes('rel="canonical" href="https://bloodycotech.com/"')) {
  fail("Canonical trang chủ không phải https://bloodycotech.com/");
}
if (!home.includes('name="google-adsense-account"')) fail("Trang chủ thiếu meta xác minh AdSense");
if (!home.includes(adsenseSrc)) fail("Trang chủ thiếu script AdSense");
if (!home.includes('crossorigin="anonymous"')) fail("Script AdSense thiếu crossorigin");

const privacy = fs.readFileSync(path.join(outDir, "privacy-policy/index.html"), "utf8");
if (!privacy.includes("bloodycotech-theme")) fail("Chính sách không nhắc khóa theme");
if (!privacy.includes("chưa")) fail("Chính sách không nói rõ phần chưa bật");

const contact = fs.readFileSync(path.join(outDir, "contact/index.html"), "utf8");
if (!contact.includes("mailto:hoanglocdn95@gmail.com")) {
  fail("Trang liên hệ thiếu mailto đã cấu hình");
}

const interview = fs.readFileSync(path.join(outDir, "interview/index.html"), "utf8");
if (!interview.includes("Core Web Vitals")) fail("Trang ôn phỏng vấn thiếu nội dung performance");
if (!interview.includes("AbortController")) fail("Trang ôn phỏng vấn thiếu ví dụ hủy request");

const englishHome = fs.readFileSync(path.join(outDir, "en/index.html"), "utf8");
if (!englishHome.includes("Personal developer log")) fail("Trang tiếng Anh chưa được xuất bản");

const localStoragePost = fs.readFileSync(
  path.join(outDir, "blog/localstorage-trang-thai-ung-dung-va-game/index.html"),
  "utf8",
);
if (!localStoragePost.includes("demo.score.v1")) fail("Bài localStorage chưa nhúng ví dụ");
if (!localStoragePost.includes("data-language")) fail("Chưa thấy syntax highlighting");
if (!localStoragePost.includes("Chép")) fail("Thiếu nút chép mã");

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`site check passed (${published.length} bài, ${htmlFiles.length} html)`);
