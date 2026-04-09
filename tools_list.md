# Tools List

## 1. Tra cứu thông tin chuyến bay

- **Tool Name**: FlightInfoLookup
  - **Chức năng**: Tra cứu thông tin chuyến bay theo mã chuyến bay hoặc ngày cụ thể.
  - **Input**:
    - `flightCode` (string): Mã chuyến bay (VD: VN367).
    - `date` (string, optional): Ngày cần tra cứu (VD: 20/04/2026).
  - **Output**:
    - `departureTime` (string): Giờ khởi hành.
    - `arrivalTime` (string): Giờ đến nơi.
    - `status` (string): Trạng thái chuyến bay.

- **Tool Name**: FlightAvailabilityChecker
  - **Chức năng**: Kiểm tra tính khả dụng của chuyến bay vào ngày cụ thể.
  - **Input**:
    - `date` (string): Ngày cần kiểm tra (VD: 20/04/2026).
  - **Output**:
    - `availableFlights` (array): Danh sách chuyến bay sớm nhất vào ngày đó.

- **Tool Name**: SearchFlight
  - **Chức năng**: Tìm kiếm chuyến bay dựa trên điểm đi và điểm đến.
  - **Input**:
    - `departure` (string): Điểm đi (VD: Hà Nội).
    - `destination` (string): Điểm đến (VD: TP.HCM).
  - **Output**:
    - `availableFlights` (array): Danh sách các chuyến bay khả dụng.

## 2. Tra cứu giá vé

- **Tool Name**: TicketPriceLookup
  - **Chức năng**: Tra cứu giá vé trung bình và chi tiết các chuyến bay.
  - **Input**:
    - `departure` (string): Điểm đi (VD: Hà Nội).
    - `destination` (string): Điểm đến (VD: TP.HCM).
    - `date` (string): Ngày khởi hành (VD: 20/04/2026).
  - **Output**:
    - `averagePrice` (number): Giá vé trung bình.
    - `flightDetails` (array): Danh sách chuyến bay và thời gian khởi hành.

## 3. Tra cứu khách sạn gần sân bay

- **Tool Name**: NearbyHotelFinder
  - **Chức năng**: Tìm kiếm khách sạn gần sân bay.
  - **Input**:
    - `airportName` (string): Tên sân bay (VD: Nội Bài).
  - **Output**:
    - `hotels` (array): Danh sách khách sạn, giá và đánh giá.

- **Tool Name**: SearchHotel
  - **Chức năng**: Tìm kiếm khách sạn dựa trên địa điểm.
  - **Input**:
    - `location` (string): Địa điểm cần tìm khách sạn (VD: Hà Nội).
  - **Output**:
    - `availableHotels` (array): Danh sách các khách sạn khả dụng.

## 4. Hỏi về thủ tục hành lý

- **Tool Name**: BaggagePolicyChecker
  - **Chức năng**: Tra cứu quy định hành lý của hãng bay.
  - **Input**:
    - `baggageType` (string): Loại hành lý (VD: xách tay, ký gửi).
  - **Output**:
    - `policyDetails` (string): Quy định về trọng lượng, kích thước và các lưu ý khác.

## 5. Xử lý phản hồi người dùng

- **Tool Name**: FeedbackHandler
  - **Chức năng**: Ghi nhận và xử lý phản hồi từ người dùng.
  - **Input**:
    - `feedback` (string): Đánh giá của người dùng (VD: hữu ích, không hữu ích).
    - `details` (string, optional): Chi tiết phản hồi (VD: "Thông tin không chính xác").
  - **Output**:
    - `status` (string): Trạng thái xử lý phản hồi (VD: "Đã lưu").

## 6. Tính toán ngân sách

- **Tool Name**: CalculatorBudget
  - **Chức năng**: Tính toán ngân sách dựa trên các chi phí dự kiến.
  - **Input**:
    - `flightCost` (number): Chi phí vé máy bay.
    - `hotelCost` (number): Chi phí khách sạn.
    - `otherExpenses` (number, optional): Các chi phí khác.
  - **Output**:
    - `totalBudget` (number): Tổng ngân sách cần thiết.