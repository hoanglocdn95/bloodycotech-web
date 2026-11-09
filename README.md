# BloodyCoTech

BloodyCoTech là ứng dụng cá nhân hóa chạy hoàn toàn trên trình duyệt: người dùng vẽ, app phân tích các đặc điểm hình học và màu sắc thành thông số số, sau đó gợi ý một app, game hoặc câu chuyện có thể phù hợp.

## Nguyên tắc dữ liệu

- Không gọi API phân tích.
- Không lưu ảnh hoặc stroke.
- Không tài khoản hoặc backend.
- Chỉ lưu hồ sơ số tổng hợp, lịch sử số gần đây, lượt dùng và feedback trong `localStorage`.
- Có thể xem và xóa toàn bộ hồ sơ tại “Góc của mình”.
- App không tự nhận các tín hiệu là chẩn đoán tâm lý.

## Trải nghiệm tích hợp

- Pomodoro
- Vận động ngắn
- Góc làm việc với Web Audio tạo tại chỗ
- Lines 98
- Gold Miner
- Dino Run
- Quote deck
- Truyện thật ngắn
- Pachinko
- Cờ vua, cờ tướng, cờ vây, cờ thú và cờ caro — năm mục riêng

## Chạy local

```bash
pnpm install
pnpm dev
```

## Kiểm tra và build

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run check:site
```

Ứng dụng dùng Next.js static export. Cloudflare Pages build bằng `pnpm run build` và phục vụ thư mục `out`.

## Routes

- `/` — tiếng Việt
- `/en/` — English
- `/about/`, `/how-it-works/`, `/privacy/`, `/terms/`, `/contact/` — thông tin sản phẩm bằng tiếng Việt
- `/en/about/`, `/en/how-it-works/`, `/en/privacy/`, `/en/terms/`, `/en/contact/` — bản tiếng Anh

Các experience chạy bên trong app shell; không có route API.

## Google AdSense

- Publisher ID được công bố bằng meta `google-adsense-account` để xác minh domain.
- `public/ads.txt` chứa đúng seller record của tài khoản.
- Luồng vẽ và experience không tải script hoặc ad unit; vì vậy không chen quảng cáo vào trải nghiệm và chưa đặt cookie quảng cáo.
- Trước khi bật quảng cáo thực tế cần cập nhật chính sách riêng tư và cấu hình CMP/Privacy & messaging phù hợp trong AdSense.
