# Bật trang quản trị trên bloodycotech.com

Trang vẽ và trang quản trị dùng cùng domain. Trang vẽ không có link tới trang quản trị. Đường dẫn quản trị là:

`https://bloodycotech.com/bc-console`

Ba lớp chặn user thường:

1. Trang công khai không nhắc tới đường dẫn này, sitemap cũng không có.
2. Cloudflare Access đòi đăng nhập trước khi request tới được Function.
3. Function kiểm tra chữ ký JWT của Access và chỉ nhận email `hoanglocdn95@gmail.com`.

Nếu Access chưa được gắn, Function trả `403`. Không có mật khẩu nào nằm trong JavaScript của trang vẽ.

Phiên Wrangler trên máy này đã hết hạn và không đăng nhập lại được trong môi trường không mở được trình duyệt. Các bước bên dưới cần bạn làm một lần. Sau bước 5, danh mục mới được ghi từ trang quản trị. Trước đó trang vẽ vẫn chạy bằng danh mục có sẵn trong code.

Wrangler cần Node 22. Site trên Cloudflare Pages vẫn build bằng Node 20. Đừng đổi `NODE_VERSION` của project, và đừng đặt `NODE_ENV=production` trong dashboard.

## 1. Mở terminal với Node 22

```bash
cd /Users/hoanglocdn95/Working/bloodycotech
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 22
```

## 2. Đăng nhập Cloudflare

```bash
pnpm exec wrangler login
```

Trình duyệt mở ra. Chọn đúng tài khoản đang giữ `bloodycotech.com`. Khi terminal in tên tài khoản, chạy tiếp:

```bash
pnpm exec wrangler whoami
```

## 3. Tạo database cho danh mục

```bash
pnpm exec wrangler d1 create bloodycotech-catalog
```

Lệnh in một `database_id`. Mở `wrangler.jsonc`, thay đúng dòng:

```text
00000000-0000-0000-0000-000000000000
```

bằng id vừa in. Giữ nguyên `"binding": "DB"` và `"database_name": "bloodycotech-catalog"`.

## 4. Tạo bảng

```bash
pnpm exec wrangler d1 migrations apply bloodycotech-catalog --remote
```

Xác nhận `yes`. Lần gọi đầu tiên tới `/api/catalog` sẽ tự điền 14 trải nghiệm đang có trong code. Những lần sau không ghi đè phần bạn đã sửa.

## 5. Đưa bản này lên Pages

Đưa commit này lên `main`:

```bash
git push origin main
```

Nếu project `bloodycotech-web` vẫn nối với GitHub, Pages sẽ build deployment đó. Kiểm tra trong dashboard: Workers & Pages → `bloodycotech-web` → Deployments. Build command vẫn là `pnpm run build`, output directory vẫn là `out`.

Nếu thanh vàng báo Git bị ngắt, deploy thẳng từ máy:

```bash
pnpm run build
pnpm exec wrangler pages deploy out --project-name bloodycotech-web --branch main
```

Lệnh này chỉ chạy sau khi `database_id` trong `wrangler.jsonc` đã là id thật. Id toàn số 0 sẽ không nối được database.

## 6. Khóa đúng hai đường dẫn bằng Access

Path để trống nghĩa là khóa cả `bloodycotech.com`, kể cả trang vẽ. Chỉ điền hai path ghi dưới đây.

1. Vào [dash.cloudflare.com](https://dash.cloudflare.com) và mở **Zero Trust**.
2. Lần đầu Zero Trust sẽ hỏi tên team. Đặt tên và nhớ nó. Domain của team sẽ là `https://<tên-team>.cloudflareaccess.com`.
3. Vào **Access controls → Applications**.
4. Chọn **Create new application**.
5. Chọn **Self-hosted and private**, rồi **Add public hostname**.
6. Hostname thứ nhất:
   - Domain: `bloodycotech.com`
   - Path: `bc-console`
7. Thêm hostname thứ hai trong cùng application, nếu có nút thêm destination:
   - Domain: `bloodycotech.com`
   - Path: `api/admin/*`
8. Nếu màn hình chỉ cho một path, tạo xong application đầu, rồi tạo application thứ hai với cùng policy và path `api/admin/*`. Path có `*` không bao gồm chính path cha, nên `api/admin/*` là path đúng cho `/api/admin/experiences`.
9. Tạo policy:
   - Action: **Allow**
   - Include: **Emails**
   - Giá trị: `hoanglocdn95@gmail.com`
10. Phần đăng nhập: chọn **One-time PIN**. Nếu team chưa có identity provider, thêm One-time PIN. Chỉ có một cách đăng nhập thì bật instant authentication nếu thấy tùy chọn đó.
11. Session duration: 24 hours.
12. Bấm **Create**.

Không thêm hostname nào có path trống. Không thêm `bloodycotech.com/*`.

Sau khi tạo, mở application → **Edit** → **Additional settings** → copy **Application Audience (AUD) Tag**. Tag này không đổi trừ khi bạn xóa và tạo lại application.

## 7. Đưa AUD vào project Pages

Workers & Pages → `bloodycotech-web` → **Settings** → **Environment variables**.

Thêm cho cả **Production** và **Preview**:

| Tên | Giá trị |
|---|---|
| `ACCESS_TEAM_DOMAIN` | `https://<tên-team>.cloudflareaccess.com` |
| `ACCESS_AUD` | AUD tag vừa copy |

`ADMIN_EMAIL` không cần thêm. Function đã mặc định `hoanglocdn95@gmail.com`. Chỉ thêm biến này khi bạn muốn đổi email được vào.

Biến môi trường có hiệu lực ở lần deploy kế tiếp. Vào **Deployments**, deployment mới nhất, chọn **Retry deployment**.

Nếu Settings → Functions chưa có D1 binding tên `DB`, thêm:

- Variable name: `DB`
- Database: `bloodycotech-catalog`

Rồi retry deployment thêm một lần.

## 8. Kiểm tra

1. Mở cửa sổ ẩn danh tới `https://bloodycotech.com/bc-console`.
2. Cloudflare hỏi email. Nhập `hoanglocdn95@gmail.com` và mã gửi về Gmail.
3. Sửa tên một trải nghiệm, bấm **Lưu danh mục**. Dòng trạng thái là “Đã lưu. Trang vẽ sẽ nhận danh mục này.”
4. Bỏ chọn **Đưa tới user** nếu muốn ẩn trải nghiệm đó khỏi người vẽ, rồi lưu lại.
5. Một cửa sổ ẩn danh khác, hoặc một email khác, phải dừng ở màn đăng nhập hoặc bị từ chối. Không thấy form sửa danh mục.
6. Mở `https://bloodycotech.com/`, vẽ một nét, bấm **Xong rồi!**. Trang chỉ còn câu mời, tên trải nghiệm và nút **Khám phá**. Không có link tới `bc-console`.
7. `https://bloodycotech.com/api/catalog` chỉ trả các trải nghiệm đang bật. Câu trả lời không chứa đường quản trị.

## Việc không làm

- Đừng thêm đường dẫn này vào menu, footer, sitemap, hoặc dòng `Disallow` trong `robots.txt`. Dòng `Disallow` công bố đường dẫn đang tồn tại.
- Đừng đặt mật khẩu trong code chạy trên trình duyệt.
- Đường dẫn có trong repo này. Người đọc repo có thể thấy nó. Người đó vẫn không vào được nếu email không phải `hoanglocdn95@gmail.com`.

## Xem trên máy trước khi deploy

```bash
nvm use 22
pnpm run build
pnpm exec wrangler pages dev out --port 8788
```

`http://127.0.0.1:8788/bc-console` mở được vì đó là máy local. `https://bloodycotech.com/bc-console` không mở theo cách đó.
