import json
import os
import random

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "mock_data", "prices.json")

with open(DATA_PATH, encoding="utf-8") as f:
    PRICES_DATA = json.load(f)

AIRPORT_ALIASES = {
    "hà nội": "HAN", "ha noi": "HAN", "nội bài": "HAN", "noi bai": "HAN",
    "hcm": "SGN", "tp.hcm": "SGN", "sài gòn": "SGN", "sai gon": "SGN",
    "hồ chí minh": "SGN", "ho chi minh": "SGN", "tân sơn nhất": "SGN",
    "đà nẵng": "DAD", "da nang": "DAD",
    "phú quốc": "PQC", "phu quoc": "PQC",
    "nha trang": "CXR",
    "huế": "HUI", "hue": "HUI",
    "cần thơ": "VCA", "can tho": "VCA",
}


def _resolve_airport(name: str) -> str:
    name_upper = name.upper().strip()
    if name_upper in ["HAN", "SGN", "DAD", "PQC", "CXR", "HUI", "VCA", "VII"]:
        return name_upper
    return AIRPORT_ALIASES.get(name.lower().strip(), name_upper)


def get_ticket_prices(from_airport: str, to_airport: str, date: str = None, cabin_class: str = "economy") -> dict:
    from_code = _resolve_airport(from_airport)
    to_code = _resolve_airport(to_airport)
    route_key = f"{from_code}-{to_code}"
    reverse_key = f"{to_code}-{from_code}"

    cabin_class = cabin_class.lower().strip()
    cabin_map = {
        "economy": "economy", "phổ thông": "economy",
        "premium_economy": "premium_economy", "premium economy": "premium_economy",
        "business": "business", "thương gia": "business",
    }
    cabin_key = cabin_map.get(cabin_class, "economy")

    route_data = PRICES_DATA["routes"].get(route_key) or PRICES_DATA["routes"].get(reverse_key)

    if not route_data:
        return {
            "error": f"Chưa có dữ liệu giá vé cho tuyến {from_code} - {to_code}.",
            "suggestion": "Các tuyến hỗ trợ: HAN-SGN, HAN-DAD, HAN-PQC, SGN-DAD, SGN-PQC",
        }

    cabin_prices = route_data[cabin_key]
    random.seed((date or "") + route_key + cabin_key)
    current_price = random.randint(
        cabin_prices["min_vnd"] // 10000,
        cabin_prices["max_vnd"] // 10000
    ) * 10000

    def fmt(n):
        return f"{n:,.0f} VNĐ"

    return {
        "from_airport": from_code,
        "to_airport": to_code,
        "date": date,
        "cabin_class": cabin_key,
        "duration_min": route_data["duration_min"],
        "distance_km": route_data["distance_km"],
        "current_price": current_price,
        "current_price_formatted": fmt(current_price),
        "min_price": cabin_prices["min_vnd"],
        "min_price_formatted": fmt(cabin_prices["min_vnd"]),
        "max_price": cabin_prices["max_vnd"],
        "max_price_formatted": fmt(cabin_prices["max_vnd"]),
        "avg_price": cabin_prices["avg_vnd"],
        "avg_price_formatted": fmt(cabin_prices["avg_vnd"]),
        "price_note": "Giá đã bao gồm thuế và phí sân bay. Giá có thể thay đổi tùy thời điểm đặt vé.",
        "confidence": 0.85,
    }
