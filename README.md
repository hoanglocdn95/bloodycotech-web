# BloodyCoTech

Website tĩnh của BloodyCoTech: góc web cá nhân cho blog kỹ thuật tiếng Việt, bộ ôn phỏng vấn song ngữ và hàng đợi sản phẩm nhỏ.

- Tagline: Code. Build. Play.
- Production dự kiến: https://bloodycotech.com
- Stack: Next.js 16 (App Router, `output: "export"`), TypeScript, Tailwind CSS 4, MDX, pnpm.

## Chạy local

Cần Node.js 20 và pnpm 10.11.

```bash
pnpm install
pnpm dev
```

`pnpm dev` chỉ để xem khi đang viết. Bản giống production là thư mục `out/`:

```bash
pnpm run build
pnpm exec serve out -p 4173
```

`pnpm start` không dùng cho site này vì không có server Next.js sau khi export.

## Kiểm tra

```bash
pnpm run verify
```

Lệnh này chạy lần lượt: typecheck (app và `examples/`), ESLint, test ví dụ, production build, rồi đối chiếu link, sitemap và bài draft trong `out/`.

## Cấu trúc

```text
app/                 route và metadata
components/          layout, bài viết, theme
content/blog/        bài MDX
examples/            đoạn code được nhúng vào bài và được typecheck riêng
lib/                 đọc bài, SEO, điều hướng
config/integrations.json
public/              icon, _headers
scripts/             ads.txt, test ví dụ, kiểm tra out/
```

Route tiếng Việt: `/`, `/blog/`, `/blog/[slug]/`, `/interview/`, `/projects/`, `/about/`, `/contact/`, `/privacy-policy/`.

Route tiếng Anh: `/en/`, `/en/interview/`, `/en/projects/`, `/en/about/`, `/en/contact/`, `/en/privacy-policy/`. Bài blog chưa dịch; language switch từ bài viết quay về trang chủ tiếng Anh.

## Thêm bài blog

Tạo `content/blog/<slug>.mdx`. Tên file không bắt đầu bằng `_`.

```mdx
---
slug: ten-bai
title: Tiêu đề từ 12 đến 100 ký tự
description: Mô tả 60 đến 180 ký tự, hiện trên thẻ bài và metadata.
category: react
tags:
  - react
author: BloodyCoTech
publishedAt: "2026-11-04"
updatedAt: "2026-11-04"
cover:
draft: true
featured: false
---
```

Quy tắc build sẽ từ chối bài xuất bản nếu thiếu một trong các mục sau:

- `category` là `react`, `typescript`, `ha-tang` hoặc `web-game`.
- `author` đúng `BloodyCoTech`. Ngày dạng `YYYY-MM-DD`, có ngoặc kép.
- `tags` từ 1 đến 6, viết thường, dấu gạch ngang.
- Không có `h1` trong thân bài. Tiêu đề lấy từ frontmatter.
- Ít nhất 450 từ ngoài code fence, một khối code có ngôn ngữ, một link nội bộ và một link `https://`.
- Không có `lorem`, `TODO`, `TBD`, `placeholder`.

`draft: true` không vào trang công khai, `generateStaticParams` hay sitemap. Đặt `draft: false` khi bài đã đọc lại.

Nhúng file trong `examples/` để đoạn code và bản được typecheck là một:

````md
```tsx include=examples/counter.tsx
```
````

Đường dẫn phải bắt đầu bằng `examples/` và không chứa `..`. Component và dấu `{ }` trong đoạn văn phải nằm trong backtick. `{biểu thức}` ngoài code bị MDX loại bỏ lúc build.

Bài `featured: true` được ưu tiên trên trang chủ. `cover` là đường dẫn trong `public/` nếu có ảnh; để trống khi chưa có.

## Cấu hình liên hệ và AdSense

Sửa `config/integrations.json`. Chỉ điền bằng dữ liệu thật từ tài khoản tương ứng.

| Trường | Khi nào điền |
| --- | --- |
| `contactEmail` | Email chính thức. Trang liên hệ và JSON-LD chỉ hiện mailto sau khi điền. |
| `googleSiteVerification` | Mã Search Console, nếu bạn dùng cách này. Không bắt buộc trước khi gửi AdSense. |
| `adsensePublisherId` | Đúng giá trị `ca-pub-` và 16 chữ số. Site thêm `<meta name="google-adsense-account">` và script `adsbygoogle.js` trên mọi trang. |
| `adsTxt` | Đúng một dòng Google cấp, dạng `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`. |

`pnpm run build` ghi `out/ads.txt` chỉ khi `adsTxt` hợp lệ. Publisher ID không tự tạo `ads.txt`. Khi `adsensePublisherId` có giá trị, mọi trang tải script AdSense tương ứng. Site không tự chèn ad unit.

Trước khi gửi AdSense:

1. Điền email và đọc lại chính sách bảo mật.
2. Có đủ bài công khai, điều hướng và trang 404. Không bật quảng cáo trước khi được chấp thuận.
3. Dán `adsensePublisherId` từ tài khoản AdSense, deploy, rồi bấm Verify trong AdSense.
4. Search Console là việc riêng. Chỉ điền `googleSiteVerification` khi bạn đang xác minh bên đó.
5. Sau khi có dòng `ads.txt` chính thức, dán vào config và deploy lại.
6. Khi gắn script AdSense, cập nhật chính sách bảo mật trong cùng lần deploy.

Google là bên quyết định phê duyệt.

## Cloudflare Pages

Preset: **Next.js (Static HTML Export)**.

- Build command: `pnpm run build`
- Output directory: `out`
- Node: `20` (`NODE_VERSION=20`)
- Cài cả devDependencies. Tailwind và TypeScript nằm ở devDependencies nhưng build cần chúng.

Không dùng `@cloudflare/next-on-pages`. Site này là HTML tĩnh.

`public/_headers` gắn header bảo mật và cache cho `/_next/static/*`. Redirect `www` sang apex không đặt trong `_redirects` (Pages không áp rule theo domain ở file đó). Trong dashboard: proxied record `www` → `192.0.2.1`, rồi Bulk Redirect từ `https://www.bloodycotech.com/*` sang `https://bloodycotech.com/${1}` với status 301. Xem [hướng dẫn www redirect của Cloudflare](https://developers.cloudflare.com/pages/how-to/www-redirect/).

## Thêm web game sau này

Khi có bản chơi được công khai, thêm nội dung theo cùng kiểu blog thay vì dựng backend:

1. `content/games/<slug>.mdx` với metadata thật: tên, mô tả, ngày phát hành, đường dẫn chơi.
2. `app/games/page.tsx` và `app/games/[slug]/page.tsx`, đọc content giống `lib/posts.ts`.
3. Bản build của game đặt trong `public/games/<slug>/` và chỉ đưa vào repo khi game chạy được.
4. Thêm route vào sitemap và navigation lúc trang đã có sản phẩm. `/tools` và `/devlog` làm tương tự.
5. Không tạo trang trống hoặc link tải giả trước thời điểm đó.

Project phần mềm cũng vậy: thêm object vào `projects` trong `lib/projects.ts` khi đã có URL công khai.
