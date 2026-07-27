# Chatbot AI tư vấn sản phẩm — DuongTech

Tính năng AI: chatbot tư vấn laptop và thiết bị công nghệ, dùng **Google Gemini** (gói miễn phí).
Kiến trúc: `service-ai` (Spring Boot, port 9087) đăng ký Eureka, gọi Gemini + lấy sản phẩm
từ `service-product`. Frontend có widget chat nổi ở góc phải.

```
Frontend (widget) ──POST /api/ai/chat──► API Gateway (9080) ──lb──► service-ai (9087)
                                                                     │  lấy sản phẩm
                                                                     ▼  từ service-product
                                                                  gọi Gemini API
```

## 1. Lấy Gemini API key (miễn phí)

1. Vào https://aistudio.google.com/app/apikey (đăng nhập Google).
2. Bấm **Create API key** → copy chuỗi key.

## 2. Khai báo key cho hệ thống

Tạo file `.env` **trong thư mục gốc dự án** (cùng chỗ `docker-compose.yml`) với nội dung:

```
GEMINI_API_KEY=dán_key_vào_đây
GEMINI_MODEL=gemini-3.5-flash-lite
```

> Docker Compose tự đọc file `.env` này và truyền vào `service-ai`.
> File đã nằm trong `.gitignore` — **không commit key lên Git**.

## 3. Chạy backend

```bash
docker compose -p duong up -d --build
```

Kiểm tra service AI đã lên:

```bash
docker compose -p duong ps
docker compose -p duong logs -f service-ai
```

Test nhanh API:

```bash
curl -X POST http://localhost:9080/api/ai/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Tư vấn giúp tôi laptop gaming dưới 30 triệu\"}"
```

→ Trả về `{"reply":"...","suggestions":[...]}` là chatbot chạy ok.

## 4. Chạy frontend

```bash
cd frontend
npm install
npm run dev
```

Mở http://localhost:3001 → góc phải dưới có nút chat 💬 → bấm để hỏi trợ lý.

## Cách hoạt động

1. `ChatService` gọi `ProductContextProvider` lấy tối đa 40 sản phẩm đang bán từ
   `SERVICE-PRODUCT` qua Eureka (`http://SERVICE-PRODUCT/products?availableOnly=true`).
2. Danh sách đó được nhét vào **system prompt** kèm ràng buộc "chỉ được gợi ý sản phẩm
   trong danh sách này, không bịa thêm".
3. Sau khi Gemini trả lời, `matchSuggestions()` dò tên sản phẩm xuất hiện trong câu trả lời
   (chuẩn hoá bỏ dấu câu, thường hoá) để trả kèm ảnh + giá cho frontend hiển thị thẻ sản phẩm.

Cấu hình trong `service-ai/src/main/resources/application.yml`:

| Thuộc tính | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `ai.shop-name` | DuongTech | Tên cửa hàng đưa vào prompt |
| `ai.shop-desc` | cửa hàng laptop và thiết bị công nghệ | Mô tả cửa hàng |
| `ai.product-domain` | laptop và thiết bị công nghệ | Nhóm hàng được phép tư vấn |
| `ai.max-products` | 40 | Số sản phẩm tối đa nhét vào prompt |

## Ghi chú

- Chưa cấu hình key → chatbot vẫn chạy nhưng trả lời "chưa cấu hình khóa API".
- Chatbot chỉ tư vấn sản phẩm đang bán (lấy từ service-product) — chống bịa sản phẩm.
- File liên quan:
  - `service-ai/` — toàn bộ service backend.
  - `api-gateway/src/main/resources/application.yml` — route `/api/ai/**`.
  - `docker-compose.yml` — container `duong-service-ai` (9087).
  - `frontend/src/components/AiChatWidget.jsx` — widget chat.

## Xử lý sự cố: chatbot trả lời "Xin lỗi, trợ lý đang bận"

Đây là câu fallback khi gọi Gemini lỗi. Xem nguyên nhân thật trong log:

```bash
docker compose -p duong logs --tail 50 service-ai
```

Hay gặp nhất là **HTTP 429 — hết quota gói miễn phí**. Quota tính **theo từng model**,
nên chỉ cần đổi `GEMINI_MODEL` sang model khác là có hạn mức mới:

| Model | Ghi chú (kiểm tra 26/07/2026) |
| --- | --- |
| `gemini-3.5-flash-lite` | Mặc định, hạn mức rộng |
| `gemini-3.1-flash-lite` | Dự phòng |
| `gemini-3.6-flash` | Mạnh hơn, hạn mức hẹp hơn |
| `gemini-2.5-flash` | Chỉ 20 request/ngày |
| `gemini-2.0-flash*`, `gemini-2.5-flash-lite` | Đã bị khoá với tài khoản mới |

Đổi xong chạy `docker compose -p duong up -d service-ai` (không cần build lại).

> Lưu ý: nếu chạy cả BachHome và DuongTech bằng **cùng một API key** thì hai shop
> dùng chung hạn mức.
