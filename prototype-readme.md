# Prototype — Nemo: Vietnam Airlines AI Chatbot

## Mô tả

Nemo là AI Agent tích hợp vào website Vietnam Airlines, cho phép hành khách tra cứu lịch bay, giá vé, quy định hành lý, khách sạn gần sân bay và tính ngân sách chuyến đi qua hội thoại tự nhiên. Backend FastAPI gọi GPT-4o-mini với 8 function-calling tools, frontend React render câu trả lời Markdown kèm link tham khảo chính thức VNA.

## Level: Working prototype

- Backend FastAPI + OpenAI GPT-4o-mini chạy thật (function calling với 8 tools)
- Frontend React + Vite có markdown render, feedback bar (👍 👎 💬), dynamic suggestions
- Observability qua Langfuse (trace toàn bộ tool call, token, latency)
- Đã test 18 test case: chào hỏi, tìm chuyến bay theo ngày/mã, giá vé, hành lý đặc biệt, prompt injection, out-of-scope

## Links

- **Repo nhóm (source code):** https://github.com/DangMinh21/Nhom09-E403-Day06/tree/main/Prototype

- **Video demo:** xem file `demo.mp4` trong repo hoặc click [đây](https://drive.google.com/file/d/1PE6y7AwZlxhBQLmUDDFmOocqKR2Ul2Nw/view?usp=sharing)
- **Backend deploy:** *(Render free tier — liên hệ nhóm để lấy URL hoặc chạy local)*

## Tools và API

| Layer | Công nghệ |
|-------|-----------|
| LLM | OpenAI GPT-4o-mini (function calling) |
| Backend | FastAPI + Uvicorn (Python 3.10+) |
| Frontend | React 19 + Vite + TailwindCSS 4 |
| Markdown render | react-markdown + remark-gfm |
| Observability | Langfuse (trace, cost, latency) |
| Deploy | Render (backend) + Vercel (frontend) |
| Data | Mock JSON (hotels, baggage, prices) + live fetch từ url.txt |

**8 Tools implemented:**

| Tool | Chức năng |
|------|-----------|
| `search_flights` | Tìm chuyến bay theo tuyến + ngày (mock động theo seed) |
| `get_flight_status` | Kiểm tra trạng thái chuyến bay theo mã hiệu |
| `get_ticket_prices` | Giá vé theo tuyến, hạng ghế, ngày |
| `search_hotels_near_airport` | Khách sạn gần sân bay HAN/SGN/DAD/PQC |
| `get_baggage_rules` | Quy định hành lý theo hạng ghế và loại chuyến |
| `check_special_baggage_item` | Kiểm tra vật phẩm: sầu riêng, lẩu tự sôi, pin dự phòng,... |
| `calculate_budget` | Tính tổng ngân sách: vé + khách sạn × đêm + chi phí khác |
| `fetch_vna_page` | Fetch nội dung trang VNA thật từ url.txt làm fallback |

## Phân công

| Thành viên | MSSV | Phần | Output |
|-----------|------|------|--------|
| Đặng Văn Minh | 2A202600027 | Tech lead · Backend agent + tools · SPEC · Eval metrics | `agent.py`, `tools/`, `mock_data/`, system prompt, Langfuse integration |
| Nguyễn Quang Tùng | 2A202600197 | Frontend · UI/UX · SPEC · Eval metrics | `vietnam-airlines-ui/src/`, markdown render, feedback bar, suggestions |
| Nguyễn Thị Quỳnh Trang | 2A202600406 | SPEC · Eval metrics · Test cases | `spec-final.md`, `test_cases.md` |
| Đồng Văn Thịnh | 2A202600365 | SPEC · Canvas · Deploy | `spec-final.md` phần Canvas + ROI, Render/Vercel setup |
