# PLAN — Xây dựng Agent Nemo (Vietnam Airlines AI Chatbot)

## 1. Bài toán

Người dùng cần tra cứu thông tin chuyến bay, giá vé, hành trình, quy định hành lý và khách sạn gần sân bay mà không muốn mất công truy cập nhiều trang web khác nhau. Agent Nemo đóng vai trò trung gian: nhận câu hỏi tự nhiên → gọi đúng công cụ → trả lời chính xác, nhanh.

---

## 2. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────────┐
│                      Vietnam Airlines UI                         │
│                  (React + Vite · port 5173)                      │
│                                                                   │
│   Chat Widget ──── POST /chat ──────────────────────────────┐   │
│   (messages, history)                                        │   │
└──────────────────────────────────────────────────────────────┼───┘
                                                               │
                                          ┌────────────────────▼──────────────────┐
                                          │         FastAPI Backend                │
                                          │         (Python · port 8000)           │
                                          │                                        │
                                          │   POST /chat                           │
                                          │     └─► agent.py                       │
                                          │           └─► OpenAI GPT (gpt-4o-mini) │
                                          │                 │  function calling     │
                                          │         ┌───────┴──────────┐           │
                                          │         ▼                  ▼           │
                                          │      Tools             Mock Data        │
                                          │   search_flights       flights.py      │
                                          │   get_flight_status    hotels.json     │
                                          │   get_ticket_prices    baggage.json    │
                                          │   search_hotels        prices.json     │
                                          │   get_baggage_rules                   │
                                          └───────────────────────────────────────┘
```

### Luồng xử lý một request

```
User nhập câu hỏi
    │
    ▼
Frontend gửi POST /chat { message, history }
    │
    ▼
FastAPI nhận → gọi chat_with_nemo()
    │
    ▼
OpenAI GPT nhận system prompt + history + message
    │
    ├─ Nếu cần dữ liệu → GPT chọn tool (function calling)
    │       │
    │       ▼
    │   Tool thực thi (Python) → trả JSON
    │       │
    │       ▼
    │   GPT nhận kết quả → sinh câu trả lời tự nhiên
    │
    └─ Nếu không cần tool → GPT trả lời trực tiếp
    │
    ▼
FastAPI trả { response: "..." }
    │
    ▼
Frontend hiển thị message trong chat widget
```

---

## 3. Công nghệ sử dụng

| Layer | Công nghệ | Lý do chọn |
|-------|-----------|------------|
| Frontend | React 19 + Vite + TailwindCSS 4 | UI có sẵn, hot reload nhanh |
| Backend | FastAPI + Uvicorn | Async native, type-safe, dễ mở rộng |
| LLM | OpenAI GPT (gpt-4o-mini) | Chi phí thấp, function calling tốt |
| Agent pattern | OpenAI Function Calling | Chính xác hơn ReAct, dễ debug |
| Data | Mock JSON (có thể swap API sau) | Đủ cho demo, không phụ thuộc API key ngoài |

---

## 4. Cấu trúc thư mục

```
Nhom09-E403-Day05/
├── CLAUDE.md                       ← Yêu cầu dự án
├── PLAN.md                         ← File này
├── README.md                       ← Hướng dẫn chạy
├── spec-template.md                ← AI Product Canvas
└── Prototype/
    ├── vietnam-airlines-ui/        ← Frontend
    │   ├── src/
    │   │   └── App.jsx             ← UI + chat widget kết nối backend
    │   ├── package.json
    │   └── vite.config.js
    └── nemo-backend/               ← Backend
        ├── main.py                 ← FastAPI app + CORS
        ├── agent.py                ← OpenAI agent, tool routing
        ├── requirements.txt
        ├── .env.example
        ├── tools/
        │   ├── __init__.py
        │   ├── flights.py          ← search_flights, get_flight_status
        │   ├── hotels.py           ← search_hotels_near_airport
        │   ├── baggage.py          ← get_baggage_rules
        │   └── prices.py          ← get_ticket_prices
        └── mock_data/
            ├── hotels.json
            ├── baggage_rules.json
            └── prices.json
```

---

## 5. Chi tiết từng Tool

### Tool 1: `search_flights`
**Mục đích:** Tìm danh sách chuyến bay theo tuyến + ngày.

**Input:**
```json
{
  "from_airport": "HAN",
  "to_airport":   "SGN",
  "date":         "2026-04-10",
  "passengers":   1
}
```

**Output:** Danh sách chuyến bay với giờ khởi hành, giờ đến, giá economy/business, số ghế còn, trạng thái.

**Data source:** Mock — sinh động theo route + ngày bằng `random.seed(date + route)`, đảm bảo kết quả nhất quán trong cùng phiên.

**Các tuyến hỗ trợ:** HAN↔SGN, HAN↔DAD, SGN↔DAD, HAN↔PQC, SGN↔PQC

---

### Tool 2: `get_flight_status`
**Mục đích:** Kiểm tra trạng thái một chuyến bay cụ thể.

**Input:**
```json
{ "flight_number": "VN200", "date": "2026-04-10" }
```

**Output:** Trạng thái (Đúng giờ / Trễ X phút / Đã cất cánh / Đã hạ cánh), cổng, terminal, confidence %.

---

### Tool 3: `get_ticket_prices`
**Mục đích:** Tra cứu giá vé theo tuyến và hạng ghế.

**Input:**
```json
{
  "from_airport": "Hà Nội",
  "to_airport":   "Đà Nẵng",
  "date":         "2026-04-15",
  "cabin_class":  "economy"
}
```

**Output:** Giá hiện tại, giá thấp nhất, cao nhất, trung bình. Hỗ trợ alias tên thành phố (Hà Nội → HAN, Sài Gòn → SGN,...).

---

### Tool 4: `search_hotels_near_airport`
**Mục đích:** Tìm khách sạn gần sân bay, sắp xếp theo khoảng cách.

**Input:**
```json
{ "airport_code": "HAN", "checkin": "2026-04-10", "checkout": "2026-04-12" }
```

**Output:** Danh sách khách sạn với tên, khoảng cách, số sao, điểm đánh giá, giá/đêm, tiện nghi, SĐT.

**Sân bay hỗ trợ:** HAN (Nội Bài), SGN (Tân Sơn Nhất), DAD (Đà Nẵng), PQC (Phú Quốc).

---

### Tool 5: `get_baggage_rules`
**Mục đích:** Tra cứu quy định hành lý Vietnam Airlines.

**Input:**
```json
{ "cabin_class": "economy", "flight_type": "domestic" }
```

**Output:** Quy định hành lý xách tay (kg, kích thước, số kiện), hành lý ký gửi, phí hành lý thừa, vật phẩm cấm.

---

## 6. System Prompt của Nemo

```
Bạn là Nemo - trợ lý AI thông minh của Vietnam Airlines.
Nhiệm vụ: giúp hành khách tra cứu thông tin nhanh chóng và chính xác.

Hỗ trợ: chuyến bay, trạng thái bay, giá vé, khách sạn gần sân bay, quy định hành lý.

Hướng dẫn:
- Trả lời bằng tiếng Việt, lịch sự, chuyên nghiệp
- Khi có dữ liệu: trình bày rõ ràng với emoji phù hợp
- Khi không chắc: nêu rõ độ tin cậy, gợi ý kiểm tra trực tiếp
- Mã sân bay: HAN (Hà Nội), SGN (TP.HCM), DAD (Đà Nẵng), PQC (Phú Quốc)
- Nếu thiếu thông tin (ngày bay,...): hỏi lại user
- Định dạng ngày gọi tool: YYYY-MM-DD
```

---

## 7. Frontend — Các thay đổi trong App.jsx

| Thay đổi | Trước | Sau |
|----------|-------|-----|
| Tên agent | NEO | Nemo |
| Messages | Mock cứng | `useState` + fetch backend |
| Chat input | UI only | Gửi POST /chat, nhận response |
| Loading state | Không có | Spinner + disabled input |
| Quick suggestions | Không có | 4 gợi ý câu hỏi mẫu |
| Floating button | Refresh icon | "Chat với Nemo" button |

---

## 8. API Contract

### `POST /chat`

**Request:**
```json
{
  "message": "Có chuyến bay nào từ Hà Nội đi Đà Nẵng ngày mai không?",
  "history": [
    { "role": "user",      "content": "Xin chào" },
    { "role": "assistant", "content": "Xin chào! Tôi là Nemo..." }
  ]
}
```

**Response:**
```json
{
  "response": "✈️ Tìm thấy 8 chuyến bay từ **Nội Bài (HAN)** đến **Đà Nẵng (DAD)** ngày 10/04/2026:\n\n..."
}
```

---

## 9. Chiến lược Data

| Tool | Nguồn dữ liệu | Ghi chú |
|------|---------------|---------|
| search_flights | Mock động (Python) | Sinh từ `random.seed`, nhất quán theo ngày |
| get_flight_status | Mock động (Python) | Có 5 trạng thái, confidence % |
| get_ticket_prices | Mock JSON | `prices.json`, có min/max/avg |
| search_hotels | Mock JSON | `hotels.json`, 4 sân bay |
| get_baggage_rules | Mock JSON | `baggage_rules.json`, đầy đủ Vietnam Airlines |

**Hướng mở rộng:** Thay mock bằng:
- **AviationStack API** (free 100 req/month) → flights, status
- **Amadeus API** (free sandbox) → giá vé thật
- **Google Places API** → khách sạn thật

---

## 10. Failure Modes & Mitigation

| # | Failure | Xử lý |
|---|---------|--------|
| 1 | Route không có trong mock data | Tool trả `error` + `suggestion`, GPT giải thích lịch sự |
| 2 | User không cung cấp ngày | System prompt yêu cầu GPT hỏi lại |
| 3 | Backend không phản hồi | Frontend hiển thị thông báo lỗi, không crash |
| 4 | GPT chọn sai tool | Tool validation + JSON error response rõ ràng |
| 5 | Airport code không hợp lệ | Tool liệt kê danh sách hỗ trợ trong error message |
