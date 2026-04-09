import json
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "mock_data", "baggage_rules.json")

with open(DATA_PATH, encoding="utf-8") as f:
    BAGGAGE_DATA = json.load(f)


def get_baggage_rules(cabin_class: str = "economy", flight_type: str = "domestic") -> dict:
    cabin_class = cabin_class.lower().strip()
    flight_type = flight_type.lower().strip()

    class_map = {
        "economy": "economy",
        "phổ thông": "economy",
        "pho thong": "economy",
        "premium_economy": "premium_economy",
        "premium economy": "premium_economy",
        "phổ thông đặc biệt": "premium_economy",
        "business": "business",
        "thương gia": "business",
        "thuong gia": "business",
    }
    type_map = {
        "domestic": "domestic",
        "nội địa": "domestic",
        "noi dia": "domestic",
        "international": "international",
        "quốc tế": "international",
        "quoc te": "international",
    }

    cabin_key = class_map.get(cabin_class, "economy")
    type_key = type_map.get(flight_type, "domestic")

    va_rules = BAGGAGE_DATA["vietnam_airlines"]
    carry_on = va_rules["carry_on"][cabin_key]
    checked = va_rules["checked_baggage"][cabin_key][type_key]

    return {
        "airline": "Vietnam Airlines",
        "cabin_class": cabin_key,
        "flight_type": type_key,
        "carry_on": carry_on,
        "checked_baggage": checked,
        "liquids_rule": va_rules["liquids_rule"],
        "prohibited_items": va_rules["prohibited_items"],
        "infant_baggage": va_rules["infant_baggage"],
        "sports_equipment": va_rules["sports_equipment"],
        "reference_url": "https://www.vietnamairlines.com/vn/vi/travel-information/baggage/checked-baggage",
        "confidence": 0.95,
    }


def check_special_baggage_item(item_name: str) -> dict:
    """Check if a specific item (e.g. durian, powerbank, self-heating hotpot) is allowed on Vietnam Airlines flights."""
    item_lower = item_name.lower().strip()
    special_items = BAGGAGE_DATA["vietnam_airlines"]["special_items"]

    # Find matching item by keywords
    matched = None
    for key, item_data in special_items.items():
        keywords = [k.lower() for k in item_data.get("keywords", [])]
        if any(kw in item_lower or item_lower in kw for kw in keywords):
            matched = item_data
            break

    if matched:
        return {
            "item_queried": item_name,
            "item_name": matched["vietnamese_name"],
            "status": matched["status"],
            "carry_on_allowed": matched["carry_on_allowed"],
            "checked_allowed": matched["checked_allowed"],
            "note": matched["note"],
            "conditions": matched.get("conditions", ""),
            "reason": matched.get("reason", ""),
            "reference_url": matched.get("reference_url", "https://www.vietnamairlines.com/vn/vi/travel-information/baggage/special-items"),
            "confidence": 0.93,
        }

    # Not in database — return honest "unknown" response
    return {
        "item_queried": item_name,
        "status": "unknown",
        "note": (
            f"Chưa có thông tin cụ thể về '{item_name}' trong cơ sở dữ liệu. "
            "Nemo khuyến nghị hành khách liên hệ trực tiếp Vietnam Airlines để xác nhận."
        ),
        "contact": "Tổng đài CSKH: 1900 1100 (24/7)",
        "reference_url": "https://www.vietnamairlines.com/vn/vi/travel-information/baggage/special-items",
        "confidence": 0.0,
    }
