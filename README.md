# Nemo — Vietnam Airlines AI Chatbot

## Nhóm 09 · Lớp E403 · Day 06

| Thành viên | MSSV |
| --- | --- |
| Đặng Văn Minh | 2A202600027 |
| Nguyễn Quang Tùng | 2A202600197 |
| Nguyễn Thị Quỳnh Trang | 2A202600406 |
| Đồng Văn Thịnh | 2A202600365 |

---

## Giới thiệu

**Nemo** là AI Agent tích hợp vào website Vietnam Airlines, giúp hành khách tra cứu thông tin nhanh chóng thông qua hội thoại tự nhiên. Thay vì phải vào nhiều trang khác nhau, người dùng chỉ cần hỏi Nemo.

Nemo hỗ trợ:

- ✈️ Tra cứu lịch chuyến bay theo tuyến & ngày
- 🔍 Kiểm tra trạng thái chuyến bay
- 💰 Tra cứu giá vé (Economy / Premium Economy / Business)
- 🏨 Tìm khách sạn gần sân bay
- 🧳 Quy định hành lý xách tay & ký gửi

---

## Kiến trúc

```text
Vietnam Airlines UI (React + Vite · :5173)
           │  POST /chat
           ▼
    FastAPI Backend (:8000)
           │  function calling
           ▼
     OpenAI GPT (gpt-4o-mini)
           │
     ┌─────┴──────┐
     Tools     Mock Data
```

Chi tiết đầy đủ xem [PLAN.md](./PLAN.md).

---

## Cấu trúc thư mục

```text
Nhom09-E403-Day05/
├── PLAN.md
├── README.md
├── spec-template.md
└── Prototype/
    ├── vietnam-airlines-ui/     ← Frontend React
    └── nemo-backend/            ← Backend FastAPI
        ├── main.py
        ├── agent.py
        ├── tools/
        └── mock_data/
```

---

## Yêu cầu

- **Python** 3.10+
- **Node.js** 18+
- **OpenAI API Key**

---

## Hướng dẫn chạy

### Bước 1 — Cài đặt & chạy Backend

```bash
cd Prototype/nemo-backend

# Tạo file .env từ template
cp .env.example .env
```

Mở file `.env` và điền API key:

```text
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4o-mini
```

```bash
# Cài dependencies (khuyến nghị dùng virtualenv)
pip install -r requirements.txt

# Chạy server
uvicorn main:app --reload
```

Backend sẽ chạy tại: `http://localhost:8000`

Kiểm tra: truy cập `http://localhost:8000/` → trả về `{"status": "ok", "agent": "Nemo - Vietnam Airlines AI"}`

### Bước 2 — Cài đặt & chạy Frontend

```bash
cd Prototype/vietnam-airlines-ui

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### Bước 3 — Sử dụng

1. Mở `http://localhost:5173` trên trình duyệt
2. Click nút **"Chat với Nemo"** góc dưới bên phải (hoặc trong sidebar)
3. Đặt câu hỏi tự nhiên bằng tiếng Việt

---

## Câu hỏi mẫu để test

| Tính năng | Câu hỏi mẫu |
| --- | --- |
| Tìm chuyến bay | `Bay từ HAN đến SGN ngày 2026-04-20` |
| Giá vé | `Giá vé Hà Nội đi Phú Quốc hạng economy` |
| Trạng thái bay | `Chuyến bay VN200 hôm nay thế nào?` |
| Hành lý | `Tôi được mang bao nhiêu kg hành lý hạng thương gia nội địa?` |
| Khách sạn | `Khách sạn gần sân bay Tân Sơn Nhất` |

---

## Lưu ý

- Model mặc định là `gpt-4o-mini` (có thể đổi trong `.env`)
- Dữ liệu chuyến bay và giá vé là mock data cho mục đích demo
- Backend cần chạy trước khi mở frontend
