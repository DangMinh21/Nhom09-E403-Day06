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
        "confidence": 0.95,
    }
