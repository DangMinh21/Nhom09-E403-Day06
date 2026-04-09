# SPEC — AI Product Hackathon

**Nhóm:** 09

**Track:** NEO chatbot VN/A

**Problem statement:** Người dùng cần tra cứu thông tin chuyến bay, giá vé, hành trình, quy định và các thông tin liên quan của Vietnam Airlines. Hiện nay đa số mọi người phải truy cập vào nhiều trang web khác nhau và thao tác thủ công. AI có thể rút gọn quy trình này bằng cách tiếp nhận câu hỏi tự nhiên, thực hiện truy vấn đúng công cụ, và trả lời chính xác trong một lần.

---

## 1. AI Product Canvas

|   | Value | Trust | Feasibility |
|---|-------|-------|-------------|
| **Câu hỏi** | User nào? Pain gì? AI giải gì? | Khi AI sai thì sao? User sửa bằng cách nào? | Cost/latency bao nhiêu? Risk chính? |
| **Trả lời** | Hành khách Vietnam Airlines cần tra cứu lịch bay, giá vé, hành lý, khách sạn gần sân bay mà không muốn mở nhiều tab. AI tự động hóa hoàn toàn: nhận câu hỏi → gọi đúng tool → trả lời có link tham khảo VNA. | Khi AI sai, user đánh giá 👎 hoặc comment → correction log lưu lại → dùng để cải thiện prompt. Trường hợp AI không chắc, chuyển hướng đến nhân viên tư vấn. | ~$0.003/request (gpt-4o-mini), latency <2s. Risk chính: AI trả lời tự tin nhưng sai dữ liệu (hallucination với mock data), hoặc không xử lý được câu hỏi phức tạp đa bước. |

**Automation hay augmentation?** Automation

Justify: AI xử lý độc lập toàn bộ luồng tra cứu thông tin — không cần human in the loop cho các tác vụ thường ngày. Chỉ escalate khi AI báo không chắc hoặc user rate 👎.

**Learning signal:**

1. User correction đi vào đâu? Correction log (`feedback_log.json`) — lưu toàn bộ message, response, rating và comment. Dữ liệu này dùng để phân tích pattern lỗi và cải thiện system prompt.
2. Product thu signal gì để biết tốt lên hay tệ đi?
   - **Explicit**: user đánh giá 👍/👎 sau mỗi response
   - **Implicit**: tỷ lệ follow-up question (hỏi lại = chưa trả lời đủ), thời gian hội thoại, tần suất escalate
3. Data thuộc loại nào?
   - User-specific (lịch sử hội thoại, feedback cá nhân)
   - Domain-specific (quy định VNA, giá vé, lịch bay)
   - Human-judgment (correction từ user)
   - Có marginal value: có — dữ liệu correction cung cấp edge case thật mà base model chưa biết (VD: sầu riêng, lẩu tự sôi)

---

## 2. User Stories — 4 paths

### Feature 1: Tra cứu thông tin chuyến bay

**Trigger:** User hỏi về lịch bay, trạng thái chuyến bay theo tuyến hoặc mã hiệu.

| Path | Câu hỏi thiết kế | Mô tả |
|------|-----------------|-------|
| Happy — AI đúng, tự tin | User thấy gì? Flow kết thúc ra sao? | Nemo gọi `search_flights` hoặc `get_flight_status` → trả danh sách chuyến bay với giờ bay, trạng thái, kèm link lịch bay VNA → user đọc, thỏa mãn, đóng chat |
| Low-confidence — AI không chắc | System báo "không chắc" bằng cách nào? | Thiếu điểm đi/đến/ngày → Nemo hỏi lại thay vì đoán. VD: "Quý khách muốn bay từ đâu ạ?" |
| Failure — AI sai | User biết AI sai bằng cách nào? Recover ra sao? | User thấy thông tin không khớp thực tế → bấm 👎 → Nemo ghi log và gợi ý liên hệ hotline VNA |
| Correction — user sửa | User sửa bằng cách nào? Data đó đi vào đâu? | User nhập lại câu đúng hoặc comment trong feedback → `feedback_log.json` → dev review và sửa system prompt |

### Feature 2: Kiểm tra quy định hành lý & vật phẩm đặc biệt

**Trigger:** User hỏi về hành lý xách tay, ký gửi, hoặc vật phẩm cụ thể (sầu riêng, lẩu tự sôi, pin dự phòng...).

| Path | Câu hỏi thiết kế | Mô tả |
|------|-----------------|-------|
| Happy — AI đúng, tự tin | User thấy gì? | Nemo gọi `get_baggage_rules` hoặc `check_special_baggage_item` → trả quy định rõ ràng (allowed/restricted/prohibited) + điều kiện + link VNA |
| Low-confidence — AI không chắc | System báo không chắc bằng cách nào? | Vật phẩm không có trong mock_data → Nemo thông báo "Chưa có thông tin về mục này" + đề xuất link quy định hành lý đặc biệt VNA |
| Failure — AI sai | User biết AI sai? Recover ra sao? | User biết quy định thật khác → 👎 + comment → correction log → prompt engineer cập nhật mock_data |
| Correction — user sửa | Data đó đi vào đâu? | Feedback lưu vào `feedback_log.json`, dev bổ sung vào `baggage_rules.json` |

### Feature 3: Tính ngân sách chuyến đi

**Trigger:** User muốn tính tổng chi phí gồm vé + khách sạn + chi phí khác.

| Path | Câu hỏi thiết kế | Mô tả |
|------|-----------------|-------|
| Happy — AI đúng, tự tin | User thấy gì? | Nemo gọi `calculate_budget` → trả tổng chi phí breakdown rõ ràng kèm gợi ý chuyến bay phù hợp ngân sách |
| Low-confidence — AI không chắc | System báo không chắc bằng cách nào? | Thiếu số ngày/giá khách sạn → Nemo hỏi lại từng thông số còn thiếu |
| Failure — AI sai | Recover ra sao? | User thấy tổng tính sai → 👎 + nhập lại con số đúng → Nemo tính lại |
| Correction — user sửa | Data đó đi vào đâu? | Nếu là lỗi logic → feedback log → dev fix tool `calculate_budget` |

---

## 3. Eval metrics + threshold

**Optimize precision hay recall?** Precision

Tại sao? Thông tin sai về giá vé, giờ bay hoặc quy định hành lý có thể khiến hành khách lỡ chuyến hoặc bị từ chối boarding. False positive (bỏ sót thông tin) ít nguy hiểm hơn false negative (thông tin sai nhưng user tin). Nemo chọn "không biết thì nói không biết" hơn là đoán sai.

Nếu sai ngược lại: Nếu tối ưu recall mà precision thấp → Nemo trả lời mọi câu kể cả khi không chắc → user nhận thông tin sai → mất tin tưởng nghiêm trọng hơn.

| Metric | Threshold | Red flag (dừng khi) |
|--------|-----------|---------------------|
| Accuracy phân loại intent đúng tool | ≥ 90% | < 75% trong 2 tuần liên tiếp |
| Latency phản hồi end-to-end | < 2s | > 5s trung bình trong 1 tuần |
| User feedback hữu ích (👍 rate) | ≥ 80% | < 60% trong 1 tuần |

---

## 4. Top 3 failure modes

| # | Trigger | Hậu quả | Mitigation |
|---|---------|---------|------------|
| 1 | AI tự tin cao nhưng trả lời sai (hallucination với mock data) | User tin và hành động sai — lỡ chuyến, mang vật phẩm bị cấm | Mỗi response kèm link VNA chính thức để user verify. System prompt yêu cầu Nemo nói rõ "Đây là thông tin tham khảo, vui lòng xác nhận tại trang VNA." |
| 2 | Dữ liệu mock không được cập nhật kịp thời (giá vé, lịch bay thay đổi) | AI cung cấp thông tin lỗi thời — user đặt vé theo giá cũ | Tool `fetch_vna_page` có thể fetch trang VNA thật khi cần. Cơ chế fallback: nếu mock data quá cũ → gợi ý user truy cập trực tiếp |
| 3 | Câu hỏi đa bước phức tạp (VD: "Tôi có 2 triệu, bay Hà Nội đi Đà Lạt ngày 15/5 còn chỗ không?") | AI gọi sai tool hoặc bỏ sót bước → trả lời thiếu → user phải hỏi lại nhiều lần | System prompt hướng dẫn Nemo decompose câu hỏi phức tạp thành từng bước. Test case coverage cho multi-turn conversation. |

---

## 5. ROI 3 kịch bản

|   | Conservative | Realistic | Optimistic |
|---|-------------|-----------|------------|
| **Assumption** | 50 user/ngày, triển khai 1 chi nhánh VNA, 50% hài lòng | 500 user/ngày, triển khai toàn website VNA desktop, 70% hài lòng | 5.000 user/ngày, tích hợp app mobile VNA + website, 90% hài lòng |
| **Cost** | ~$15/ngày inference (gpt-4o-mini × 50 queries) | ~$150/ngày inference + $50 infra | ~$1.500/ngày inference + $200 infra |
| **Benefit** | Giảm 1h/ngày workload support hotline (~$10 tiết kiệm) | Giảm 8h/ngày support, tăng conversion đặt vé online 5% (~$500/ngày) | Giảm 80h/ngày support, tăng conversion 15%, NPS tăng 10 điểm (~$8.000/ngày) |
| **Net** | Âm nhẹ — pilot phase, chấp nhận được để thu signal | Dương — có thể scale | ROI 5x+ — growth phase |

**Kill criteria:** Dừng triển khai nếu 👍 rate < 60% liên tục 4 tuần, hoặc có sự cố nghiêm trọng (AI cung cấp thông tin sai khiến hành khách không lên được máy bay).

---

## 6. Mini AI spec

**Nemo — Vietnam Airlines AI Agent**

Nemo giải quyết vấn đề tra cứu thông tin rời rạc của hành khách Vietnam Airlines: thay vì mở 5-6 trang web để xem lịch bay, giá vé, quy định hành lý, tìm khách sạn gần sân bay, người dùng chỉ cần hỏi một câu tự nhiên và nhận câu trả lời ngay lập tức.

**Đối tượng:** Hành khách VNA — từ người đặt vé lần đầu đến frequent flyer cần kiểm tra nhanh thông tin.

**AI làm gì:** Automation hoàn toàn. GPT-4o-mini nhận câu hỏi, reasoning để chọn đúng trong 8 tools (search_flights, get_flight_status, get_ticket_prices, search_hotels_near_airport, get_baggage_rules, check_special_baggage_item, calculate_budget, fetch_vna_page), gọi tool, tổng hợp kết quả thành câu trả lời Markdown có link tham khảo VNA.

**Quality:** Tối ưu precision — Nemo ưu tiên không trả lời hơn là trả lời sai. Khi không chắc, hỏi lại hoặc hướng user đến trang VNA chính thức.

**Risk chính:** Hallucination với mock data (dữ liệu không realtime), và câu hỏi multi-hop phức tạp vượt khả năng single-turn reasoning. Mitigation: luôn kèm link VNA để user verify, có `fetch_vna_page` làm fallback thật.

**Data flywheel:** Mỗi interaction tạo ra signal — 👍/👎 rating + comment lưu vào `feedback_log.json`. Dev review weekly để cập nhật system prompt và mock data. Khi scale, dữ liệu này dùng để fine-tune hoặc few-shot prompt với edge case thật từ user.
