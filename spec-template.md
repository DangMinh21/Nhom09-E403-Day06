# SPEC — AI Product Hackathon

**Nhóm:** _09_

**Track:** ☐ VinFast · ☐ Vinmec · ☐ VinUni-VinSchool · ☐ XanhSM · ☑ NEO chatbot VN/A

**Problem statement (1 câu):** *Ai gặp vấn đề gì, hiện giải thế nào, AI giúp được gì*
Người dùng cần tra cứu thông tin chuyến bay, giá vé, hành trình, quy định và các thông tin liên quan. Hiện nay đa số mọi người khi muốn tra cứu những thông tin trên, cần truy cập vào những trang web cụ thể. AI có thể rút gọn quy trình này bằng cách User đưa ra câu hỏi, AI thực hiện truy vấn, reasoning rồi đưa ra câu trả lời phù hợp.
---

## 1. AI Product Canvas

|   | Value | Trust | Feasibility |
|---|-------|-------|-------------|
| **Câu hỏi** | User nào? Pain gì? AI giải gì? | Khi AI sai thì sao? User sửa bằng cách nào? | Cost/latency bao nhiêu? Risk chính? |
| **Trả lời** | *Khi người dùng cần tra cứu thông tin, chuyến bay, đặt vé hoặc các thông tin liên quan, họ phải truy cập vào các trang cụ thể để xem thông tin, thao tác thủ công* | *AI trả lời sai thông tin → user tốn thời gian confirm tại sân bay, gây phiền hà, lễ tân phải hướng dẫn lại* | *~$0.01/request, latency <2s, risk: AI trả lời sai thông tin, làm delay hành khách tại sân bay hoặc làm hàng khách chuẩn bị không phù hợp, chỉ cần tiếp viên hướng dẫn lại là ok* |

**Automation hay augmentation?** ☑ Automation · ☐ Augmentation

Justify: *Automation - AI đã xử lý tốt trường hợp này, chỉ cần thiết kế tools kit và system prompt tốt, trường hợp rủi ro gần như = 0. cost of reject = 0 *

**Learning signal:**

1. User correction đi vào đâu? ___
2. Product thu signal gì để biết tốt lên hay tệ đi? 
- Thu signal Explicit (user đánh giá phản hồi hữu ích hay không?) để biết product đang tốt lên hay tệ đi.
3. Data thuộc loại nào?
 ☐ User-specific · ☐ Domain-specific · ☐ Real-time · ☐ Human-judgment · ☐ Khác: ___
   Có marginal value không? (Model đã biết cái này chưa?) ___

---

## 2. User Stories — 4 paths

Mỗi feature chính = 1 bảng. AI trả lời xong → chuyện gì xảy ra?

### Feature: *Tra cứu thông tin chuyến bay*

**Trigger:** *VD: User yêu cầu tra cứu thông tin chuyến bay VN/A ngày mai → AI đưa ra thời gian khởi hành, kết thúc → User phản hồi thông tin có hữu ích hay không*

| Path | Câu hỏi thiết kế | Mô tả |
|------|-------------------|-------|
| Happy — AI đúng, tự tin | User thấy gì? Flow kết thúc ra sao? | *User thấy thông tin của chuyến bay cần tra cứu -> user thấy đúng, tiếp tục làm việc* |
| Low-confidence — AI không chắc | System báo "không chắc" bằng cách nào? User quyết thế nào? | *Model báo không có data của chuyến bay ngày mai -> đưa ra giá vé trung bình + confidence % / User tự vào trang tra cứu giá vé* |
| Failure — AI sai | User biết AI sai bằng cách nào? Recover ra sao? | *Model trả lời về thông tin quy định hành lý → user thấy sai nội dung -> đánh giá câu trả lời không hữu ích → sửa dựa theo feedback* |
| Correction — user sửa | User sửa bằng cách nào? Data đó đi vào đâu? | *User có thể tạo phiếu đánh giá/report → correction log → cải thiện model* |

### Feature: *Tra cứu khách sạn gần sân bay*

**Trigger:** *VD: User yêu cầu tra cứu khách sạn gần sân bay Nội Bài → AI đưa ra danh sách khách sạn gần nhất, kèm giá và đánh giá → User phản hồi thông tin có hữu ích hay không*

| Path | Câu hỏi thiết kế | Mô tả |
|------|-------------------|-------|
| Happy — AI đúng, tự tin | User thấy gì? Flow kết thúc ra sao? | *User thấy danh sách khách sạn phù hợp -> user thấy đúng, tiếp tục làm việc* |
| Low-confidence — AI không chắc | System báo "không chắc" bằng cách nào? User quyết thế nào? | *Model báo không có đủ thông tin khách sạn -> đưa ra danh sách khách sạn phổ biến + confidence % / User tự tìm kiếm thêm* |
| Failure — AI sai | User biết AI sai bằng cách nào? Recover ra sao? | *Model trả lời sai về giá khách sạn → user thấy sai nội dung -> đánh giá câu trả lời không hữu ích → sửa dựa theo feedback* |
| Correction — user sửa | User sửa bằng cách nào? Data đó đi vào đâu? | *User có thể tạo phiếu đánh giá/report → correction log → cải thiện model* |

### Feature: *Tra cứu giá vé*

**Trigger:** *VD: User yêu cầu tra cứu giá vé máy bay từ Hà Nội đi TP.HCM ngày mai → AI đưa ra giá vé trung bình, các hãng bay và thời gian khởi hành → User phản hồi thông tin có hữu ích hay không*

| Path | Câu hỏi thiết kế | Mô tả |
|------|-------------------|-------|
| Happy — AI đúng, tự tin | User thấy gì? Flow kết thúc ra sao? | *User thấy giá vé phù hợp -> user thấy đúng, tiếp tục làm việc* |
| Low-confidence — AI không chắc | System báo "không chắc" bằng cách nào? User quyết thế nào? | *Model báo không có đủ thông tin giá vé -> đưa ra giá vé trung bình + confidence % / User tự tìm kiếm thêm* |
| Failure — AI sai | User biết AI sai bằng cách nào? Recover ra sao? | *Model trả lời sai về giá vé → user thấy sai nội dung -> đánh giá câu trả lời không hữu ích → sửa dựa theo feedback* |
| Correction — user sửa | User sửa bằng cách nào? Data đó đi vào đâu? | *User có thể tạo phiếu đánh giá/report → correction log → cải thiện model* |

### Feature: *Hỏi về thủ tục hành lý*

**Trigger:** *VD: User hỏi về quy định hành lý xách tay của hãng bay VN/A → AI đưa ra thông tin về trọng lượng, kích thước hành lý được phép mang theo → User phản hồi thông tin có hữu ích hay không*

| Path | Câu hỏi thiết kế | Mô tả |
|------|-------------------|-------|
| Happy — AI đúng, tự tin | User thấy gì? Flow kết thúc ra sao? | *User thấy thông tin quy định hành lý phù hợp -> user thấy đúng, tiếp tục làm việc* |
| Low-confidence — AI không chắc | System báo "không chắc" bằng cách nào? User quyết thế nào? | *Model báo không có đủ thông tin quy định hành lý -> đưa ra thông tin chung + confidence % / User tự tìm kiếm thêm* |
| Failure — AI sai | User biết AI sai bằng cách nào? Recover ra sao? | *Model trả lời sai về quy định hành lý → user thấy sai nội dung -> đánh giá câu trả lời không hữu ích → sửa dựa theo feedback* |
| Correction — user sửa | User sửa bằng cách nào? Data đó đi vào đâu? | *User có thể tạo phiếu đánh giá/report → correction log → cải thiện model* |

*Lặp lại cho feature thứ 2-3 nếu có.*

---

## 3. Eval metrics + threshold

**Optimize precision hay recall?** ☑ Precision · ☐ Recall
Tại sao? *Vì việc tra cứu thông tin cần đảm bảo độ chính xác cao, tránh cung cấp thông tin sai lệch cho người dùng. Nếu chọn recall mà precision thấp, thông tin sai có thể gây phiền hà và mất lòng tin của người dùng.*

Nếu sai ngược lại thì chuyện gì xảy ra? *VD: Nếu chọn precision nhưng low recall → một số thông tin có thể bị bỏ sót, nhưng người dùng vẫn nhận được thông tin chính xác, giảm thiểu rủi ro từ thông tin sai.*

| Metric                          | Threshold | Red flag (dừng khi)             |
|---------------------------------|-----------|---------------------------------|
| *Accuracy phân loại đúng*       | *≥90%*    | *<75% trong 2 tuần liên tiếp*   |
| *Latency (thời gian phản hồi)* | *<2s*     | *>5s trung bình trong 1 tuần*   |
| *User feedback hữu ích*         | *≥80%*    | *<60% trong 1 tuần*             |

---

## 4. Top 3 failure modes

*Liệt kê cách product có thể fail — không phải list features.*
*"Failure mode nào user KHÔNG BIẾT bị sai? Đó là cái nguy hiểm nhất."*

| # | Trigger                                      | Hậu quả                                      | Mitigation                                   |
|---|----------------------------------------------|---------------------------------------------|---------------------------------------------|
| 1 | *AI không nhận diện được câu hỏi phức tạp*   | *User không nhận được thông tin cần thiết*  | *Tăng cường khả năng xử lý ngôn ngữ tự nhiên, thêm ví dụ vào training data* |
| 2 | *Dữ liệu không được cập nhật kịp thời*       | *AI cung cấp thông tin lỗi thời*            | *Tích hợp cơ chế cập nhật dữ liệu theo thời gian thực* |
| 3 | *AI tự tin cao nhưng trả lời sai*            | *User mất niềm tin vào hệ thống*            | *Thêm cơ chế kiểm tra độ tin cậy, yêu cầu xác nhận từ user khi confidence thấp* |

---

## 5. ROI 3 kịch bản

|   | Conservative                          | Realistic                              | Optimistic                              |
|---|---------------------------------------|----------------------------------------|----------------------------------------|
| **Assumption** | *50 user/ngày, 50% hài lòng*         | *200 user/ngày, 70% hài lòng*         | *1000 user/ngày, 90% hài lòng*         |
| **Cost**       | *$30/ngày inference*                | *$100/ngày inference*                 | *$300/ngày inference*                  |
| **Benefit**    | *Giảm 1h support/ngày*              | *Giảm 5h support/ngày*                | *Giảm 15h support/ngày, tăng retention 10%* |
| **Net**        | *Lợi nhuận thấp, đủ duy trì*         | *Lợi nhuận ổn định, có thể mở rộng*   | *Lợi nhuận cao, mở rộng quy mô dễ dàng* |

**Kill criteria:** *Dừng khi chi phí vượt lợi ích trong 3 tháng liên tiếp hoặc tỷ lệ hài lòng <50% trong 1 tháng.*

---

## 6. Mini AI spec (1 trang)

*Tóm tắt tự do — viết bằng ngôn ngữ tự nhiên, không format bắt buộc.*
*Gom lại: product giải gì, cho ai, AI làm gì (auto/aug), quality thế nào (precision/recall), risk chính, data flywheel ra sao.*

*Sản phẩm này giải quyết vấn đề tra cứu thông tin nhanh chóng và chính xác cho người dùng, đặc biệt trong các lĩnh vực như chuyến bay, khách sạn gần sân bay, giá vé, và thủ tục hành lý. Đối tượng chính là những người dùng cần thông tin tức thời mà không muốn mất thời gian tìm kiếm thủ công.*

*AI đảm nhận vai trò tự động hóa (automation), xử lý các yêu cầu của người dùng bằng cách truy vấn dữ liệu, reasoning, và trả lời phù hợp. Với độ chính xác cao (precision), AI giảm thiểu rủi ro cung cấp thông tin sai, đồng thời đảm bảo thời gian phản hồi nhanh (<2s).*

*Rủi ro chính bao gồm: dữ liệu lỗi thời, AI tự tin cao nhưng trả lời sai, và không xử lý được câu hỏi phức tạp. Các biện pháp giảm thiểu bao gồm cập nhật dữ liệu theo thời gian thực, cải thiện khả năng xử lý ngôn ngữ tự nhiên, và thêm cơ chế kiểm tra độ tin cậy.*

*Data flywheel: Mỗi lần người dùng phản hồi hoặc chỉnh sửa, dữ liệu được ghi nhận và sử dụng để cải thiện mô hình. Điều này tạo ra vòng lặp cải tiến liên tục, giúp AI ngày càng chính xác và hữu ích hơn.*
