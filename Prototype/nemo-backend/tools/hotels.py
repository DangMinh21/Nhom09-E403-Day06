import json
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "mock_data", "hotels.json")

with open(DATA_PATH, encoding="utf-8") as f:
    HOTELS_DATA = json.load(f)


def search_hotels_near_airport(airport_code: str, checkin: str = None, checkout: str = None, max_results: int = 5) -> dict:
    airport_code = airport_code.upper()

    if airport_code not in HOTELS_DATA:
        supported = ", ".join(HOTELS_DATA.keys())
        return {
            "error": f"Chưa có dữ liệu khách sạn cho sân bay '{airport_code}'.",
            "supported_airports": supported,
        }

    data = HOTELS_DATA[airport_code]
    hotels = sorted(data["hotels"], key=lambda h: h["distance_km"])[:max_results]

    return {
        "airport_code": airport_code,
        "airport_name": data["airport_name"],
        "city": data["city"],
        "checkin": checkin,
        "checkout": checkout,
        "total_results": len(hotels),
        "hotels": hotels,
    }
