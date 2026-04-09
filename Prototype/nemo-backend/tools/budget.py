def calculate_budget(
    flight_cost: float,
    hotel_cost: float,
    other_expenses: float = 0,
    nights: int = 1,
) -> dict:
    """
    Tính toán tổng ngân sách cho chuyến đi gồm vé máy bay, khách sạn và chi phí khác.
    hotel_cost được hiểu là giá/đêm và nhân với số đêm (nights).
    """
    hotel_total = hotel_cost * nights
    total = flight_cost + hotel_total + other_expenses

    def fmt(n: float) -> str:
        return f"{n:,.0f} VNĐ"

    breakdown = {
        "Vé máy bay": fmt(flight_cost),
        f"Khách sạn ({nights} đêm × {fmt(hotel_cost)}/đêm)": fmt(hotel_total),
    }
    if other_expenses > 0:
        breakdown["Chi phí khác"] = fmt(other_expenses)

    return {
        "flight_cost": flight_cost,
        "hotel_cost_per_night": hotel_cost,
        "hotel_nights": nights,
        "hotel_total": hotel_total,
        "other_expenses": other_expenses,
        "total_budget": total,
        "total_budget_formatted": fmt(total),
        "breakdown": breakdown,
        "note": "Đây là ước tính. Giá thực tế có thể thay đổi tùy thời điểm đặt.",
    }
