# BLOODYCOTECH — MASTER HANDOFF TO CODEX
Version: 1.0 | 2026-11-09 | Language: Vietnamese
Status: Product direction confirmed; implementation and infrastructure decisions subject to repository audit.

## 0. NHIỆM VỤ
Chuyển đổi website hiện có `bloodycotech.com` từ blog công nghệ thành một nền tảng trải nghiệm cá nhân hóa bắt đầu bằng nét vẽ. Đây là định hướng thay thế sản phẩm hiện tại trên cùng domain, KHÔNG phải thêm một trang con. Không tự ý xóa blog, dữ liệu, cấu hình SEO hay tài sản cũ: kiểm kê, backup và lập phương án redirect/archival trước khi thay đổi.

Codex phải bắt đầu bằng việc audit repo, báo cáo hiện trạng và kế hoạch triển khai. Không được tuyên bố đã deploy nếu chưa thực hiện và xác minh. Thiết kế sản phẩm đầy đủ từ đầu; triển khai có thể chia giai đoạn nhưng không được tùy tiện cắt bỏ các năng lực đã xác định.

## 1. TẦM NHÌN
BloodyCoTech là nơi người dùng vẽ một điều gì đó trên trang trắng, rồi hệ thống quan sát nội dung bức vẽ và trao một trải nghiệm có khả năng phù hợp với họ ngay lúc đó. Trải nghiệm có thể là nhạc, câu chuyện, câu chia sẻ, không gian âm thanh, hoạt động sáng tạo, mini-game, mini-app hoặc nội dung tương tác. Từ “món quà” chỉ cách trao trải nghiệm, KHÔNG có nghĩa đề xuất ngẫu nhiên.

Thông điệp sản phẩm: “Bạn vẽ một điều gì đó. Chúng mình tìm một điều có thể phù hợp với bạn.”
Tagline làm việc: “Draw Something. Discover Something.”
Ưu tiên: relevance > surprise > spectacle. Không biến sản phẩm thành bài kiểm tra tâm lý, không gắn nhãn hay chẩn đoán người dùng.

## 2. QUYẾT ĐỊNH ĐÃ CHỐT
- Domain: bloodycotech.com; thay thế website blog hiện tại bằng trải nghiệm mới.
- Entry point: trang gần như trắng, lời mời vẽ, canvas lớn, ít công cụ; không bắt nhập chữ, chọn mood, trả lời khảo sát hay đăng nhập.
- Người dùng chỉ cần vẽ rồi nhấn hoàn thành. Có thể bỏ qua, và có đường đi tới thư viện.
- AI quan sát các đối tượng, bố cục, màu sắc, chi tiết; mô tả điều nhìn thấy và gợi mở diễn giải, KHÔNG khẳng định cảm xúc hoặc hoàn cảnh cá nhân từ nét vẽ.
- Phản hồi đầu tiên là một trải nghiệm chính được chọn theo mức phù hợp; có thể đổi, thích, bỏ qua; không ép tương tác.
- Không giới hạn phản hồi ở game/app. Không bắt buộc hiển thị tỷ lệ cảm xúc.
- Giao diện có thể cá nhân hóa từ màu sắc/chủ đề hình vẽ; người dùng có quyền tắt và chỉnh sửa.
- Không dùng streak, điểm danh, áp lực quay lại; không trừng phạt vì không hoạt động.
- Riêng tư theo mặc định: không lưu/gửi tranh đến bên thứ ba khi chưa có sự đồng ý rõ ràng.

## 3. USER JOURNEY
### S0 — Welcome / Blank Canvas
Nền trắng ngà, không quảng cáo chen ngang. Copy gợi ý:
“Hôm nay bạn thế nào?
Bạn có thể vẽ cho mình một điều gì đó không?
Mình sẽ thử tìm một điều có thể phù hợp với bạn.
Không cần vẽ đẹp đâu.”
Canvas là điểm nhấn. CTA “Xong rồi!”; secondary “Mình không muốn vẽ”; link nhẹ “Khám phá thư viện”.
Bút 3 cỡ, 8 màu + chọn màu tùy ý, tẩy, undo/redo, clear có xác nhận. Touch/stylus/mouse, responsive, bảo toàn nét khi resize. Không cho submit tranh trống; cho skip.
### S1 — Consent
Trước khi upload để AI phân tích, giải thích ngắn gọn ảnh sẽ được xử lý bởi dịch vụ nào, có lưu hay không, retention dự kiến; lựa chọn “Đồng ý phân tích” và “Không gửi tranh — khám phá cách khác”. Không dùng consent ngầm.
### S2 — Interpretation
Trạng thái loading ngắn, có cancel/retry. Hiển thị mô tả quan sát cụ thể: “Mình thấy ...”. Nếu không chắc, nói không chắc; không gán nhãn “bạn buồn/thất tình/trầm cảm”. Không bắt người dùng nhập chữ.
### S3 — Recommendation / Gift Reveal
Hiển thị một đề xuất chính cùng lời dẫn gắn với chi tiết hình vẽ và lý do phù hợp, ví dụ “Bức vẽ có một chiếc thuyền; thử một không gian biển yên tĩnh nhé?”. Có thể có lựa chọn thứ hai kín đáo. CTA “Thử ngay”, “Cho mình điều khác”, “Không hợp”, “Xem thư viện”.
### S4 — Experience
Chạy trải nghiệm ngay trong website hoặc trang con có back/exit rõ ràng. Âm thanh phải cần user gesture; mặc định không tự phát. Không ép thời gian, không phạt người dùng rời giữa chừng.
### S5 — Feedback
Phản hồi một chạm: “Hợp với mình”, “Chưa hợp”, “Thử điều khác”; không yêu cầu viết lý do. Dùng tín hiệu phiên hiện tại để đổi gợi ý. Lưu sở thích xuyên phiên chỉ khi opt-in.
### S6 — My Corner (optional)
Lưu tranh, trải nghiệm đã thích, tùy chỉnh và lịch sử nếu người dùng chủ động bật. Có thể xóa/xuất dữ liệu. Khách không đăng nhập vẫn trải nghiệm được. Không mặc định lưu nội dung nhạy cảm.

## 4. KIẾN TRÚC SẢN PHẨM
A. Drawing Studio: canvas strokes, brush/eraser, undo/redo, export raster for inference, local draft ephemeral.
B. Drawing Interpreter: vision model trả về các quan sát có cấu trúc và mức độ tin cậy đối với *đối tượng/hình ảnh*, không trả “xác suất mắc cảm xúc”.
C. Personalized Experience Engine: tìm trải nghiệm liên quan và đa dạng từ catalog, không chọn ngẫu nhiên thuần túy.
D. Experience Registry: các module nội dung có metadata, permissions, lazy loading và fallback.
E. Feedback & Preference: điều chỉnh đề xuất trong phiên, lịch sử chỉ khi được phép.
F. Privacy/Safety: consent, retention, moderation, reporting, deletion, accessibility.
G. My Corner: không gian tùy biến tùy chọn.

## 5. DATA CONTRACT ĐỀ XUẤT
DrawingAnalysis:
{
  "objects": [{"label":"boat","confidence":0.82}],
  "visualAttributes": {"colors":["blue"],"composition":["open-space"],"style":["sketch"]},
  "sceneSummary": "Một chiếc thuyền trên mặt nước",
  "possibleThemes": ["sea","journey","quiet"],
  "uncertainties": ["Không rõ bức vẽ mang ý nghĩa cá nhân gì"],
  "safetyFlags": []
}
Confidence chỉ cho nhận dạng hình ảnh; không biến thành thước đo tâm lý.
Experience:
{
  "id":"ocean-room",
  "type":"ambient",
  "title":"Một chút biển",
  "tags":["sea","quiet","nature"],
  "supportedIntents":["explore","rest"],
  "durationRangeMinutes":[1,15],
  "requiresAudio":false,
  "requiresExternalService":false,
  "accessibility":{"reducedMotion":true,"keyboard":true},
  "entrypoint":"/experiences/ocean-room"
}
Recommendation:
{
  "experienceId":"ocean-room",
  "reason":"Bức vẽ có hình ảnh liên quan đến biển",
  "evidence":["boat","sea"],
  "rank":1
}
Tất cả JSON phải được validate runtime (ví dụ Zod), versioned, không tin raw AI output.

## 6. RECOMMENDATION LOGIC
1. Lọc các trải nghiệm không khả dụng, không phù hợp thiết bị/accessibility, yêu cầu quyền chưa cấp, hoặc có nguy cơ không phù hợp với safety flags.
2. Dùng tín hiệu thị giác đáng tin cậy (đối tượng, chủ đề, màu) để tính semantic relevance.
3. Kết hợp feedback trong phiên và preference đã opt-in, tránh lặp lại nội dung vừa bị từ chối.
4. Đa dạng hóa loại trải nghiệm; không luôn gợi ý nhạc hoặc game.
5. Xếp hạng, hiển thị 1 lựa chọn chính và tối đa 1 lựa chọn phụ; “Đổi” chọn ứng viên tiếp theo.
6. Nếu tranh trừu tượng/không nhận diện được: đề xuất một trải nghiệm nhẹ, an toàn và thú vị dựa trên yếu tố thị giác có thể mô tả; không bịa ý nghĩa.
7. Nếu AI lỗi hoặc người dùng từ chối upload: chuyển sang thư viện curated hoặc chọn trải nghiệm bằng một chạm, không chặn hành trình.
Các trọng số là cấu hình cần thử nghiệm, không khẳng định có độ chính xác tâm lý.

## 7. EXPERIENCE LIBRARY — PHẠM VI THIẾT KẾ
Ambient: Rain Room, Ocean Room, Sound Mixer, Breathing Garden, Focus Space.
Expression: Scribble Room, Letter to Nobody, Tiny Journal, Kind Notes, Mood Canvas.
Mini-games: Tiny Garden, Cozy Fishing, Bubble Pop, Zen Puzzle, Board Games.
Content: Music Moments, Short Stories, Micro Poems, Encouraging Notes, Humor Moments.
Generative/interactive: Starry Sky, Living Drawing, Animated Pet, Drawing Echo.
Danh sách là catalog đề xuất, không phải tất cả đã tồn tại. Mỗi module cần metadata, nội dung/asset hợp pháp, fallback, performance budget, accessibility và nút thoát. Nội dung âm nhạc phải có quyền sử dụng; không tự phát nhạc.

## 8. SAFETY & TRUST
- Không suy luận hoặc khẳng định chẩn đoán tâm thần, thất tình, ý định tự hại từ bức vẽ.
- Nếu người dùng chủ động chia sẻ dấu hiệu nguy cơ rõ ràng qua các kênh hỗ trợ tương lai, hiển thị hỗ trợ phù hợp và nguồn trợ giúp; không dùng game để thay thế.
- Nội dung AI tạo ra phải qua guardrails và kiểm soát đầu ra, tránh thông điệp thao túng, khơi gợi mặc cảm, gây sốc.
- Không gửi ảnh lên model/API khi chưa được đồng ý; không ghi raw image vào analytics/logs.
- Chính sách retention cụ thể, xóa dữ liệu, giới hạn rate, chống lạm dụng và kiểm soát chi phí.
- WCAG-minded: keyboard, contrast, screen reader, reduced motion, touch target, low bandwidth.

## 9. UI / VISUAL SYSTEM
Cảm giác: sạch, trắng, dịu, có khoảng thở, giàu tính cá nhân nhưng không trẻ con. Canvas là hero. Chuyển cảnh vẽ → trải nghiệm mượt, ngắn, có Skip và reduced-motion. Không lạm dụng hiệu ứng “mở hộp quà”. Mobile-first, desktop đẹp. Có dark mode nếu người dùng chọn; không ép màu theo “tâm trạng AI đoán”. Tùy chọn Drawing Echo lấy đường nét/màu làm motif, chỉ sau khi có sự đồng ý.

## 10. KỸ THUẬT & MIGRATION
Hiện trạng theo báo cáo trước: Next.js 16 App Router, TypeScript strict, Tailwind 4, MDX, static export, có 8 bài blog xuất bản, SEO và metadata; repo local chưa chắc đã deploy. Codex PHẢI xác minh thực tế, không xem báo cáo là sự thật hiện hành.
- Audit cấu trúc repo, git status, dependency, scripts, Cloudflare config, routes, assets, analytics, SEO, build, lint, typecheck.
- Tạo branch, backup/tag trạng thái cũ. Kiểm kê URL cũ; chọn redirect 301/archival phù hợp, tránh 404 hàng loạt; bảo toàn nội dung và bản quyền.
- Frontend có thể tiếp tục Next.js/React; drawing engine dùng Canvas/SVG phù hợp; experience module dynamic import.
- Static export không có server API nội bộ tại runtime: nếu cần gọi vision model, triển khai backend riêng (ví dụ Cloudflare Worker) giữ API keys ở server, có auth/consent/rate limit/quotas, logging an toàn. Không gọi provider trực tiếp từ browser bằng secret.
- Tách domain/frontend hosting với AI backend theo nhu cầu; chưa chọn Cloudflare Pages hay Workers cho tới khi audit deployment và yêu cầu.
- Tách environment dev/staging/prod, tránh commit secrets.
- Thiết kế chi phí inference: resize/compress ảnh, giới hạn kích thước, debounce/one inference per submission, cache theo phiên khi được phép, timeout, retry có kiểm soát, fallback.
- Cân nhắc không cần AI tạo game mới từng lượt; AI chọn và cá nhân hóa từ experience registry để kiểm soát latency/cost.

## 11. NON-FUNCTIONAL / QA
- Responsive 320px tới desktop; mouse/touch/stylus; canvas pixel ratio, undo/redo, resize, memory cleanup.
- Performance: route lazy-load, giới hạn bundle, image upload, memory, frame rate; đo Core Web Vitals.
- E2E: vẽ → consent → phân tích → đề xuất → mở → feedback → đổi; skip; không consent; timeout; AI malformed; offline; refresh; mobile.
- Security: API key, upload validation, CORS, rate limit, prompt injection qua nội dung hình, XSS, CSP.
- Accessibility: keyboard, screen reader alternatives cho canvas, reduced motion, contrast.
- Privacy: chứng minh không gửi ảnh trước consent; xóa dữ liệu hoạt động đúng.
- Analytics ưu tiên sự kiện không chứa ảnh/nội dung nhạy cảm: started_drawing, drawing_submitted, consent_granted, recommendation_shown, experience_opened, feedback_clicked.

## 12. YÊU CẦU CODEX THỰC HIỆN
GIAI ĐOẠN A — AUDIT & DESIGN: đọc repo, lập inventory, xác minh hosting và rủi ro migration. Tạo tài liệu:
docs/MASTER_PRODUCT_SPEC.md
docs/USER_JOURNEYS.md
docs/UX_WIREFRAMES.md
docs/EXPERIENCE_CATALOG.md
docs/AI_INTERPRETATION_AND_RECOMMENDATION.md
docs/PRIVACY_SAFETY.md
docs/ARCHITECTURE.md
docs/MIGRATION_PLAN.md
docs/TEST_PLAN.md
docs/DECISIONS.md
Báo cáo mọi điểm chưa quyết định: provider vision AI, kinh phí, consent wording, data retention, music licensing, hosting, tài khoản và dữ liệu My Corner.

GIAI ĐOẠN B — IMPLEMENTATION PLAN: chia vertical slices từ end-to-end journey đến catalog và My Corner; mỗi slice có acceptance criteria, test, rollback và ước lượng chi phí. Đây là kế hoạch thực hiện sản phẩm đầy đủ, KHÔNG phải thay thế product design bằng MVP.
GIAI ĐOẠN C — BUILD: chỉ bắt đầu thay đổi lớn sau khi người dùng duyệt migration plan và các quyết định có ảnh hưởng chi phí/dữ liệu. Build/lint/typecheck/test/e2e; chụp screenshot desktop/mobile, báo cáo rõ phần đã xác minh.
GIAI ĐOẠN D — DEPLOY: chỉ deploy sau khi được phép và có credentials; backup, preview/staging, smoke test, kiểm tra SEO/redirect, theo dõi lỗi và rollback.

## 13. DEFINITION OF DONE
- Người mới có thể vẽ và nhận trải nghiệm liên quan mà không nhập chữ/đăng nhập.
- Không đồng ý gửi ảnh vẫn có đường khám phá hữu ích.
- Gợi ý không tự nhận biết chắc tâm lý; lý do liên hệ với chi tiết quan sát được.
- Có nhiều loại phản hồi ngoài game/app; người dùng đổi được ngay.
- Không gửi ảnh trước consent; không lộ API key; xóa được dữ liệu đã lưu.
- Mobile, keyboard, reduced motion, lỗi AI, offline/fallback được kiểm thử.
- Migration không làm mất blog cũ/URL quan trọng ngoài kế hoạch được duyệt.
- Có báo cáo triển khai, test, chi phí dự kiến và trạng thái deploy thực tế.

## 14. PROMPT MỞ ĐẦU GỬI CODEX
“Bạn là Product Engineer + Tech Lead phụ trách chuyển đổi bloodycotech.com. Hãy đọc toàn bộ Master Handoff này và audit repo thực tế trước khi code. Tôn trọng các quyết định sản phẩm đã chốt: draw-first, không bắt nhập chữ, không suy đoán chắc chắn cảm xúc, đề xuất trải nghiệm đa dạng phù hợp hơn là quà ngẫu nhiên, consent trước khi gửi tranh, không mất dữ liệu blog cũ. Trước tiên hãy xuất báo cáo audit, kiến trúc, wireframes, migration plan, implementation plan theo vertical slices, rủi ro và các quyết định cần tôi phê duyệt. Chưa deploy hoặc xóa nội dung cũ khi chưa được phép. Sau khi tôi duyệt, triển khai và kiểm chứng end-to-end, báo cáo bằng tiếng Việt với bằng chứng build/test và ảnh màn hình.”
