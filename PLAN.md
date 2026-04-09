# PLAN — Xây dựng Agent Nemo (Vietnam Airlines AI Chatbot)

## 1. Bài toán

Người dùng cần tra cứu thông tin chuyến bay, giá vé, hành trình, quy định hành lý và khách sạn gần sân bay mà không muốn mất công truy cập nhiều trang web khác nhau. Agent Nemo đóng vai trò trung gian: nhận câu hỏi tự nhiên → gọi đúng công cụ → trả lời chính xác, nhanh.

---

## 2. Kiến trúc tổng thể

```text
┌─────────────────────────────────────────────────────────────────┐
│                      Vietnam Airlines UI                         │
│                  (React + Vite · port 5173)                      │
│   Chat Widget ──── POST /chat ──────────────────────────────┐   │
│   Markdown render (react-markdown + remark-gfm)             │   │
└──────────────────────────────────────────────────────────────┼───┘
                                                               │
                              ┌────────────────────────────────▼───────────────┐
                              │               FastAPI Backend                   │
                              │               (Python · port 8000)              │
                              │                                                  │
                              │   POST /chat       → agent.py                  │
                              │   POST /suggestions → agent.py                 │
                              │   POST /feedback   → feedback_log.json         │
                              │                                                  │
                              │   OpenAI GPT (gpt-4o-mini)                     │
                              │     └─ function calling (8 tools)               │
                              └─────────────────────────────────────────────────┘
```

### Luồng xử lý một request

```text
User nhập câu hỏi
    │
    ▼
Frontend gửi POST /chat { message, history }
    │
    ▼
FastAPI → chat_with_nemo()
    │
    ▼
GPT nhận system prompt + history + message
    │
    ├─ Cần dữ liệu → chọn tool (function calling)
    │       │
    │       ▼
    │   Tool thực thi → trả JSON
    │       │
    │       ▼
    │   GPT sinh câu trả lời Markdown + link tham khảo
    │
    └─ Không cần tool → GPT trả lời trực tiếp
    │
    ▼
Frontend render Markdown (react-markdown)
+ Feedback bar (👍 👎 💬) + Suggestions chips
```

---

## 3. Công nghệ sử dụng

| Layer | Công nghệ | Lý do chọn |
| --- | --- | --- |
| Frontend | React 19 + Vite + TailwindCSS 4 | UI có sẵn, hot reload nhanh |
| Markdown | react-markdown + remark-gfm | Render MD đẹp: bảng, link, bold, list |
| Backend | FastAPI + Uvicorn | Async native, type-safe |
| LLM | OpenAI GPT (gpt-4o-mini) | Chi phí thấp, function calling tốt |
| Agent pattern | OpenAI Function Calling | Chính xác, dễ debug |
| Data | Mock JSON + web fetch từ url.txt | Demo nhanh, có thể swap API sau |

---

## 4. Cấu trúc thư mục

```text
Nhom09-E403-Day05/
├── CLAUDE.md
├── PLAN.md                          ← File này
├── README.md
├── spec-template.md
├── test_cases.md                    ← Bộ test case
├── tools_list.md                    ← Danh sách tools thiết kế
└── Prototype/
    ├── url.txt                      ← Danh sách URL Vietnam Airlines
    ├── vietnam-airlines-ui/         ← Frontend
    │   └── src/App.jsx              ← UI + chat widget + markdown render
    └── nemo-backend/
        ├── main.py                  ← FastAPI: /chat /suggestions /feedback
        ├── agent.py                 ← OpenAI agent + system prompt + tools
        ├── requirements.txt
        ├── .env.example
        ├── feedback_log.json        ← Dữ liệu feedback (tự sinh khi có feedback)
        ├── tools/
        │   ├── flights.py           ← search_flights, get_flight_status
        │   ├── hotels.py            ← search_hotels_near_airport
        │   ├── baggage.py           ← get_baggage_rules, check_special_baggage_item
        │   ├── prices.py            ← get_ticket_prices
        │   ├── budget.py            ← calculate_budget
        │   └── web_content.py       ← get_available_urls, fetch_vna_page
        └── mock_data/
            ├── hotels.json
            ├── baggage_rules.json   ← Gồm special_items: sầu riêng, lẩu tự sôi,...
            └── prices.json
```

---

## 5. Chi tiết từng Tool (8 tools)

### Tool 1: `search_flights`

Tìm danh sách chuyến bay theo tuyến + ngày. Mock động theo `random.seed(date+route)`.

Tuyến hỗ trợ: HAN↔SGN, HAN↔DAD, SGN↔DAD, HAN↔PQC, SGN↔PQC

### Tool 2: `get_flight_status`

Kiểm tra trạng thái chuyến bay theo mã hiệu + ngày (đúng giờ/trễ/đã cất cánh).

### Tool 3: `get_ticket_prices`

Giá vé theo tuyến, hạng ghế, ngày. Hỗ trợ alias tên thành phố → mã IATA.

### Tool 4: `search_hotels_near_airport`

Khách sạn gần sân bay, sắp xếp theo khoảng cách. Data: HAN, SGN, DAD, PQC.

### Tool 5: `get_baggage_rules`

Quy định hành lý xách tay + ký gửi theo hạng ghế và loại chuyến bay.

### Tool 6: `check_special_baggage_item`

Kiểm tra vật phẩm cụ thể: sầu riêng, lẩu tự sôi, pin dự phòng, thú cưng, rượu,...
Trả về: allowed/restricted/prohibited + điều kiện + link tham khảo VNA.

### Tool 7: `calculate_budget`

Tính tổng ngân sách: vé + khách sạn (× số đêm) + chi phí khác.

### Tool 8: `fetch_vna_page` + `get_available_urls`

Fetch và trích xuất nội dung từ các trang Vietnam Airlines cấu hình trong `url.txt`.

---

## 6. System Prompt — Các cải tiến

| Tính năng | Mô tả |
| --- | --- |
| Phạm vi hỗ trợ | Chỉ trả lời về Vietnam Airlines, từ chối câu hỏi ngoài lề lịch sự |
| Chống prompt injection | Không tiết lộ system prompt, không theo lệnh thay đổi vai trò |
| Link tham khảo | Mỗi câu trả lời kèm 1 link VNA phù hợp (lịch bay, hành lý, check-in,...) |
| Xử lý thiếu thông tin | Hỏi lại khi thiếu điểm đi/đến/ngày thay vì đoán sai |
| Format Markdown | Hướng dẫn GPT dùng **bold**, danh sách, bảng, emoji hợp lý |

---

## 7. Frontend — Tính năng Chat Widget

| Tính năng | Mô tả |
| --- | --- |
| Markdown render | react-markdown + remark-gfm: bold, link, list, table, code |
| Link clickable | `<a target="_blank">` mở tab mới |
| Truncate/Expand | Response > 5 dòng → thu gọn, có nút "Xem thêm" |
| Feedback bar | 👍 👎 💬 dưới mỗi bot message, ghi vào feedback_log.json |
| Dynamic suggestions | Gợi ý câu hỏi theo context sau mỗi response (GPT sinh) |
| Loading state | Spinner + disabled input khi chờ |
| Quick suggestions | 5 câu phổ biến nhất khi mở chat lần đầu |

---

## 8. API Contract

### `POST /chat`

```json
{ "message": "...", "history": [{"role": "user", "content": "..."}] }
```

```json
{ "response": "**Markdown** content với link..." }
```

### `POST /suggestions`

```json
{ "history": [...] }
```

```json
{ "suggestions": ["câu 1", "câu 2", "câu 3", "câu 4", "câu 5"] }
```

### `POST /feedback`

```json
{ "bot_response": "...", "user_message": "...", "rating": "like", "comment": "..." }
```

```json
{ "status": "ok" }
```

---

## 9. Test Cases Coverage

| # | Test case | Cách xử lý |
| --- | --- | --- |
| 1 | Chào hỏi | System prompt định nghĩa greeting chuẩn |
| 2 | Câu hỏi ngoài lề (B2-spirit) | Từ chối lịch sự, hướng về VNA |
| 3 | Prompt injection | Không thực thi, trả lời lịch sự |
| 4 | Tìm bay thiếu thông tin | Hỏi lại điểm đi/đến |
| 5 | Chỉ có điểm đến | Hỏi lại điểm đi |
| 6 | HAN→SGN không có ngày | Dùng ngày mai, hiển thị danh sách |
| 7 | Bay theo ngày (không rõ tuyến) | Hỏi thêm điểm đi/đến |
| 8-10 | Tra cứu theo mã chuyến bay | Tool get_flight_status |
| 14 | Ngân sách 5 triệu → gợi ý bay | Tool search_flights + lọc theo giá |
| 15 | Giá rẻ nhất HAN-SGN | Tool get_ticket_prices |
| 17 | Sầu riêng có mang được không | Tool check_special_baggage_item |
| 18 | Lẩu tự sôi | Tool check_special_baggage_item → prohibited |

---

## 10. Chiến lược Data & Mở rộng

| Tool | Hiện tại | Có thể mở rộng |
| --- | --- | --- |
| search_flights | Mock động | AviationStack API |
| get_ticket_prices | Mock JSON | Amadeus API |
| search_hotels | Mock JSON | Google Places / Booking.com API |
| get_baggage_rules | Mock JSON | Scrape VNA website |
| check_special_baggage_item | Mock JSON (8 items) | Mở rộng database |
| fetch_vna_page | Fetch từ url.txt | Thêm URL mới vào url.txt |

---

## 11. Feedback Loop

Mỗi response từ Nemo có feedback bar. Dữ liệu lưu vào `feedback_log.json`:

```json
{
  "timestamp": "2026-04-09T10:30:00",
  "rating": "like",
  "comment": "...",
  "user_message": "...",
  "bot_response": "..."
}
```

Nhà phát triển đọc file này để phân tích và cải thiện model/prompt.
