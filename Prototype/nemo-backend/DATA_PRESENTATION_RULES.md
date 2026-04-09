# NGUYÊN TẮC TRÌNH BÀY DỮ LIỆU DANH SÁCH - NEMO

## Yêu Cầu Chung
Khi trả về danh sách kết quả (chuyến bay, khách sạn, giá cả...), **PHẢI** tuân theo format CARD sau:

## Cấu Trúc Bắt Buộc

### 1. **Phân Cách Từng Đối Tượng**
- Mỗi đối tượng (mỗi chuyến bay/khách sạn) phải nằm trong một khối **CARD riêng biệt**
- Ngăn cách các card bằng dòng kẻ ngang: `---`
- Tuyệt đối **KHÔNG** để các thông tin dính sát nhau

### 2. **Tiêu Đề Card**
- Sử dụng: **Emoji + Bold + Tên đối tượng**
- Ví dụ: `✈️ **Chuyến bay VN200**` hoặc `🏨 **Khách sạn Hà Nội Plaza**`

### 3. **Nội Dung Chi Tiết**
Mỗi dòng thông tin phải có format:
```
[Emoji] **[Tiêu đề]:** [Giá trị]
```

### 4. **Ví Dụ Đầy Đủ (BẮTBUỘC TUÂN THEO)**

```markdown
✈️ **Chuyến bay VN200**
⏰ **Thời gian:** 06:00 - 08:15
⏳ **Thời lượng:** 135 phút
✅ **Trạng thái:** Đúng giờ
💰 **Giá hiện tại:** 1,460,000 VND
🪑 **Ghế còn:** 28 ghế

---

✈️ **Chuyến bay VN215**
⏰ **Thời gian:** 07:00 - 09:15
⏳ **Thời lượng:** 135 phút
✅ **Trạng thái:** Còn ghế
💰 **Giá hiện tại:** 2,150,000 VND
🪑 **Ghế còn:** 45 ghế

---

✈️ **Chuyến bay VN217**
⏰ **Thời gian:** 08:00 - 10:15
⏳ **Thời lượng:** 135 phút
⚠️ **Trạng thái:** Chỉ còn 3 ghế
💰 **Giá hiện tại:** 2,500,000 VND
🪑 **Ghế còn:** 3 ghế
```

## Emoji Phù Hợp Cho Từng Loại Thông Tin

| Thông Tin | Emoji | Ví Dụ |
|-----------|-------|-------|
| Chuyến bay / Đường bay | ✈️ | `✈️ **Chuyến bay VN200**` |
| Khách sạn | 🏨 | `🏨 **Khách sạn Hà Nội Plaza**` |
| Thời gian | ⏰ | `⏰ **Thời gian:** 06:00 - 08:15` |
| Thời lượng | ⏳ | `⏳ **Thời lượng:** 135 phút` |
| Trạng thái OK | ✅ | `✅ **Trạng thái:** Đúng giờ` |
| Trạng thái cảnh báo | ⚠️ | `⚠️ **Trạng thái:** Chỉ còn 3 ghế` |
| Trạng thái lỗi | ❌ | `❌ **Trạng thái:** Hết phòng` |
| Giá tiền | 💰 | `💰 **Giá:** 1,460,000 VND` |
| Ghế ngồi | 🪑 | `🪑 **Ghế còn:** 45 ghế` |
| Sao, đánh giá | ⭐ | `⭐ **Đánh giá:** 4.5/5 sao` |
| Check-in | 📅 | `📅 **Check-in:** 14/04/2026` |
| Check-out | 📋 | `📋 **Check-out:** 16/04/2026` |
| Địa chỉ | 📍 | `📍 **Địa chỉ:** 123 Pho Nha Trang, Ha Noi` |

## Quy Tắc Định Dạng Dữ Liệu

### Định Dạng Tiền Tệ
- **ĐÚNG:** `1,460,000 VND` (có dấu phẩy ngăn cách hàng nghìn)
- **SAI:** `1460000 VND` (không có dấu phẩy)
- Luôn thêm ` VND` cuối cùng

### Định Dạng Ngày
- Format: `dd/mm/yyyy` (ví dụ: `14/04/2026`)
- Hoặc: `ngày dd tháng mm năm yyyy` (ví dụ: `ngày 14 tháng 4 năm 2026`)

### Định Dạng Thời Gian
- Khởi hành - Đến: `HH:MM - HH:MM` (ví dụ: `06:00 - 08:15`)
- Thời lượng: `XXX phút` hoặc `X giờ Y phút` (ví dụ: `135 phút` hoặc `2 giờ 15 phút`)

## Lưu Ý Quan Trọng

1. **Không dính liền:** LUÔN để khoảng trắng (line break) giữa các dòng thông tin
2. **In đậm tiêu đề:** Tiêu đề mỗi thông tin PHẢI in đậm (`**Tiêu đề:**`)
3. **Emoji bắt buộc:** LUÔN bắt đầu mỗi dòng với emoji phù hợp
4. **Phân cách card:** Dùng `---` để ngăn cách các card từ nhau
5. **Định dạng số:** Sử dụng dấu phẩy cho số lần (1,460,000 chứ không 1460000)
6. **Tính nhất quán:** Tất cả card PHẢI có cùng cấu trúc

## Ví Dụ Khách Sạn

```markdown
🏨 **Khách sạn Hà Nội Plaza**
📍 **Địa chỉ:** 123 Phố Nhà Trang, Hoàn Kiếm, Hà Nội
⭐ **Đánh giá:** 4.5/5 sao (từ 256 đánh giá)
💰 **Giá một đêm:** 850,000 VND
📅 **Check-in:** 14/04/2026
📋 **Check-out:** 16/04/2026
✅ **Trạng thái:** Còn phòng (5 phòng khả dụng)

---

🏨 **Khách sạn Nội Bài Sân Bay**
📍 **Địa chỉ:** Khu đô thị phía tây sân bay Nội Bài
⭐ **Đánh giá:** 4.2/5 sao (từ 142 đánh giá)
💰 **Giá một đêm:** 620,000 VND
📅 **Check-in:** 14/04/2026
📋 **Check-out:** 16/04/2026
✅ **Trạng thái:** Còn phòng (12 phòng khả dụng)
```

## Khi Nào Áp Dụng

- ✈️ Danh sách chuyến bay
- 🏨 Danh sách khách sạn
- 💰 Danh sách giá vé theo hạng
- 🧳 Danh sách quy định hành lý (nếu có nhiều hạng)
- Bất kỳ danh sách dữ liệu nào khác từ các tool

## Khi Nào KHÔNG Áp Dụng

- Thông tin đơn giản (một câu trả lời, không phải danh sách)
- Hướng dẫn / Lối chỉ dẫn
- Thông báo lỗi hay từ chối
- Các câu hỏi yêu cầu giải thích, không phải kết quả search
