import random
from datetime import datetime, timedelta

AIRPORT_NAMES = {
    "HAN": "Nội Bài - Hà Nội",
    "SGN": "Tân Sơn Nhất - TP.HCM",
    "DAD": "Đà Nẵng",
    "PQC": "Phú Quốc",
    "CXR": "Cam Ranh - Nha Trang",
    "HUI": "Phú Bài - Huế",
    "VCA": "Cần Thơ",
    "VII": "Vinh",
}

ROUTE_SCHEDULES = {
    "HAN-SGN": ["06:00", "07:30", "09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00"],
    "SGN-HAN": ["05:30", "07:00", "08:30", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00", "20:30"],
    "HAN-DAD": ["06:30", "08:00", "10:00", "12:30", "14:00", "16:00", "18:30", "20:00"],
    "DAD-HAN": ["07:30", "09:00", "11:00", "13:30", "15:00", "17:00", "19:30", "21:00"],
    "SGN-DAD": ["06:00", "08:30", "11:00", "13:00", "15:30", "18:00", "20:00"],
    "DAD-SGN": ["07:00", "09:30", "12:00", "14:00", "16:30", "19:00", "21:00"],
    "HAN-PQC": ["07:00", "09:30", "12:00", "15:00", "17:30"],
    "PQC-HAN": ["08:30", "11:00", "13:30", "16:30", "19:00"],
    "SGN-PQC": ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    "PQC-SGN": ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"],
}

ROUTE_DURATIONS = {
    "HAN-SGN": 120, "SGN-HAN": 120,
    "HAN-DAD": 75,  "DAD-HAN": 75,
    "SGN-DAD": 70,  "DAD-SGN": 70,
    "HAN-PQC": 135, "PQC-HAN": 135,
    "SGN-PQC": 55,  "PQC-SGN": 55,
}

ECONOMY_BASE_PRICES = {
    "HAN-SGN": 1650000, "SGN-HAN": 1650000,
    "HAN-DAD": 1100000, "DAD-HAN": 1100000,
    "SGN-DAD": 950000,  "DAD-SGN": 950000,
    "HAN-PQC": 1900000, "PQC-HAN": 1900000,
    "SGN-PQC": 750000,  "PQC-SGN": 750000,
}


def _generate_flight_number(route_key: str, index: int) -> str:
    base_numbers = {
        "HAN-SGN": 200, "SGN-HAN": 250,
        "HAN-DAD": 130, "DAD-HAN": 140,
        "SGN-DAD": 160, "DAD-SGN": 170,
        "HAN-PQC": 180, "PQC-HAN": 185,
        "SGN-PQC": 190, "PQC-SGN": 195,
    }
    base = base_numbers.get(route_key, 900)
    return f"VN{base + index}"


def _add_minutes(time_str: str, minutes: int) -> str:
    t = datetime.strptime(time_str, "%H:%M")
    t += timedelta(minutes=minutes)
    return t.strftime("%H:%M")


def search_flights(from_airport: str, to_airport: str, date: str, passengers: int = 1) -> dict:
    from_airport = from_airport.upper()
    to_airport = to_airport.upper()
    route_key = f"{from_airport}-{to_airport}"

    if from_airport not in AIRPORT_NAMES:
        return {"error": f"Không tìm thấy sân bay '{from_airport}'. Các sân bay hỗ trợ: {', '.join(AIRPORT_NAMES.keys())}"}
    if to_airport not in AIRPORT_NAMES:
        return {"error": f"Không tìm thấy sân bay '{to_airport}'. Các sân bay hỗ trợ: {', '.join(AIRPORT_NAMES.keys())}"}
    if from_airport == to_airport:
        return {"error": "Điểm đi và điểm đến không được giống nhau."}

    schedules = ROUTE_SCHEDULES.get(route_key)
    if not schedules:
        return {
            "error": f"Hiện chưa có đường bay trực tiếp từ {AIRPORT_NAMES[from_airport]} đến {AIRPORT_NAMES[to_airport]}.",
            "suggestion": "Quý khách có thể đặt chuyến bay nối chuyến qua sân bay Nội Bài (HAN) hoặc Tân Sơn Nhất (SGN)."
        }

    duration = ROUTE_DURATIONS.get(route_key, 90)
    base_price = ECONOMY_BASE_PRICES.get(route_key, 1500000)

    try:
        flight_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        return {"error": "Định dạng ngày không hợp lệ. Vui lòng dùng định dạng YYYY-MM-DD."}

    random.seed(date + route_key)

    flights = []
    for i, dep_time in enumerate(schedules):
        arr_time = _add_minutes(dep_time, duration)
        price_variation = random.uniform(0.85, 1.35)
        economy_price = int(base_price * price_variation / 10000) * 10000
        available_seats = random.randint(2, 45)

        status = "Đúng giờ"
        if random.random() < 0.08:
            delay_min = random.choice([15, 20, 30, 45, 60])
            status = f"Trễ {delay_min} phút"

        flights.append({
            "flight_number": _generate_flight_number(route_key, i),
            "airline": "Vietnam Airlines",
            "departure_time": dep_time,
            "arrival_time": arr_time,
            "duration_min": duration,
            "economy_price_vnd": economy_price * passengers,
            "business_price_vnd": economy_price * passengers * 4,
            "available_seats": available_seats,
            "status": status,
            "aircraft": random.choice(["Airbus A321", "Boeing 787-9", "Airbus A350"]),
        })

    return {
        "from_airport": from_airport,
        "from_name": AIRPORT_NAMES[from_airport],
        "to_airport": to_airport,
        "to_name": AIRPORT_NAMES[to_airport],
        "date": flight_date.strftime("%d/%m/%Y"),
        "passengers": passengers,
        "total_flights": len(flights),
        "flights": flights,
    }


def get_flight_status(flight_number: str, date: str) -> dict:
    flight_number = flight_number.upper().replace(" ", "")
    random.seed(flight_number + date)

    statuses = [
        {"status": "Đúng giờ", "confidence": 0.95},
        {"status": "Trễ 20 phút", "confidence": 0.88},
        {"status": "Trễ 45 phút", "confidence": 0.82},
        {"status": "Đã cất cánh", "confidence": 0.99},
        {"status": "Đã hạ cánh", "confidence": 0.99},
    ]
    chosen = random.choice(statuses)

    dep_hour = random.randint(6, 21)
    dep_min = random.choice([0, 30])
    dep_time = f"{dep_hour:02d}:{dep_min:02d}"

    routes = list(ROUTE_SCHEDULES.keys())
    route = random.choice(routes)
    from_code, to_code = route.split("-")
    duration = ROUTE_DURATIONS.get(route, 90)
    arr_time = _add_minutes(dep_time, duration)

    try:
        flight_date = datetime.strptime(date, "%Y-%m-%d")
        date_str = flight_date.strftime("%d/%m/%Y")
    except ValueError:
        date_str = date

    return {
        "flight_number": flight_number,
        "date": date_str,
        "from_airport": from_code,
        "from_name": AIRPORT_NAMES.get(from_code, from_code),
        "to_airport": to_code,
        "to_name": AIRPORT_NAMES.get(to_code, to_code),
        "scheduled_departure": dep_time,
        "scheduled_arrival": arr_time,
        "status": chosen["status"],
        "confidence": chosen["confidence"],
        "gate": f"{'ABCD'[random.randint(0,3)]}{random.randint(1,20)}",
        "terminal": f"T{random.randint(1,2)}",
    }
