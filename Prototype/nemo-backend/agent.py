import json
import os
from datetime import datetime
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()
from tools.flights import search_flights, get_flight_status
from tools.hotels import search_hotels_near_airport
from tools.baggage import get_baggage_rules
from tools.prices import get_ticket_prices

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

SYSTEM_PROMPT = f"""Bạn là Nemo - trợ lý AI thông minh của Vietnam Airlines.
Nhiệm vụ của bạn là giúp hành khách tra cứu thông tin nhanh chóng và chính xác.

Ngày hôm nay: {datetime.now().strftime('%d/%m/%Y')}

Bạn có thể hỗ trợ:
- Tra cứu chuyến bay (lịch bay, giờ khởi hành, giờ đến)
- Kiểm tra trạng thái chuyến bay (đúng giờ, trễ,...)
- Tra cứu giá vé (economy, premium economy, business)
- Tìm khách sạn gần sân bay
- Thông tin quy định hành lý xách tay và ký gửi

Hướng dẫn trả lời:
- Luôn trả lời bằng tiếng Việt, lịch sự và chuyên nghiệp
- Khi có dữ liệu: trình bày rõ ràng, dễ đọc với emoji phù hợp
- Khi không chắc chắn: nêu rõ mức độ tin cậy và gợi ý kiểm tra trực tiếp
- Mã sân bay phổ biến: HAN (Hà Nội), SGN (TP.HCM), DAD (Đà Nẵng), PQC (Phú Quốc)
- Nếu user không cung cấp ngày, hãy hỏi lại hoặc dùng ngày hôm nay
- Định dạng ngày khi gọi tool: YYYY-MM-DD"""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_flights",
            "description": "Tìm kiếm danh sách chuyến bay theo điểm đi, điểm đến và ngày bay. Trả về lịch bay, giá vé và số ghế còn trống.",
            "parameters": {
                "type": "object",
                "properties": {
                    "from_airport": {
                        "type": "string",
                        "description": "Mã IATA sân bay điểm đi (VD: HAN, SGN, DAD, PQC)"
                    },
                    "to_airport": {
                        "type": "string",
                        "description": "Mã IATA sân bay điểm đến (VD: HAN, SGN, DAD, PQC)"
                    },
                    "date": {
                        "type": "string",
                        "description": "Ngày bay định dạng YYYY-MM-DD (VD: 2026-04-10)"
                    },
                    "passengers": {
                        "type": "integer",
                        "description": "Số lượng hành khách (mặc định: 1)",
                        "default": 1
                    }
                },
                "required": ["from_airport", "to_airport", "date"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_flight_status",
            "description": "Kiểm tra trạng thái của một chuyến bay cụ thể (đúng giờ, trễ, đã cất cánh,...)",
            "parameters": {
                "type": "object",
                "properties": {
                    "flight_number": {
                        "type": "string",
                        "description": "Số hiệu chuyến bay (VD: VN200, VN568)"
                    },
                    "date": {
                        "type": "string",
                        "description": "Ngày bay định dạng YYYY-MM-DD"
                    }
                },
                "required": ["flight_number", "date"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_ticket_prices",
            "description": "Tra cứu giá vé máy bay theo tuyến đường, hạng ghế. Trả về giá hiện tại, giá thấp nhất và cao nhất.",
            "parameters": {
                "type": "object",
                "properties": {
                    "from_airport": {
                        "type": "string",
                        "description": "Mã sân bay hoặc tên thành phố điểm đi (VD: HAN, Hà Nội, SGN, Sài Gòn)"
                    },
                    "to_airport": {
                        "type": "string",
                        "description": "Mã sân bay hoặc tên thành phố điểm đến"
                    },
                    "date": {
                        "type": "string",
                        "description": "Ngày bay định dạng YYYY-MM-DD (tùy chọn)"
                    },
                    "cabin_class": {
                        "type": "string",
                        "description": "Hạng ghế: economy, premium_economy, business",
                        "enum": ["economy", "premium_economy", "business"],
                        "default": "economy"
                    }
                },
                "required": ["from_airport", "to_airport"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_hotels_near_airport",
            "description": "Tìm kiếm khách sạn gần sân bay, bao gồm thông tin giá, đánh giá và tiện nghi.",
            "parameters": {
                "type": "object",
                "properties": {
                    "airport_code": {
                        "type": "string",
                        "description": "Mã IATA sân bay (VD: HAN, SGN, DAD, PQC)"
                    },
                    "checkin": {
                        "type": "string",
                        "description": "Ngày nhận phòng YYYY-MM-DD (tùy chọn)"
                    },
                    "checkout": {
                        "type": "string",
                        "description": "Ngày trả phòng YYYY-MM-DD (tùy chọn)"
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Số kết quả tối đa trả về (mặc định: 5)",
                        "default": 5
                    }
                },
                "required": ["airport_code"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_baggage_rules",
            "description": "Tra cứu quy định hành lý xách tay và ký gửi của Vietnam Airlines theo hạng ghế và loại chuyến bay.",
            "parameters": {
                "type": "object",
                "properties": {
                    "cabin_class": {
                        "type": "string",
                        "description": "Hạng ghế: economy, premium_economy, business",
                        "enum": ["economy", "premium_economy", "business"],
                        "default": "economy"
                    },
                    "flight_type": {
                        "type": "string",
                        "description": "Loại chuyến bay: domestic (nội địa) hoặc international (quốc tế)",
                        "enum": ["domestic", "international"],
                        "default": "domestic"
                    }
                },
                "required": []
            }
        }
    }
]

TOOL_FUNCTIONS = {
    "search_flights": search_flights,
    "get_flight_status": get_flight_status,
    "get_ticket_prices": get_ticket_prices,
    "search_hotels_near_airport": search_hotels_near_airport,
    "get_baggage_rules": get_baggage_rules,
}


async def chat_with_nemo(message: str, history: list[dict]) -> str:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history)
    messages.append({"role": "user", "content": message})

    response = await client.chat.completions.create(
        model=MODEL,
        messages=messages,
        tools=TOOLS,
        tool_choice="auto",
        temperature=0.3,
    )

    assistant_message = response.choices[0].message

    if not assistant_message.tool_calls:
        return assistant_message.content

    messages.append(assistant_message)

    for tool_call in assistant_message.tool_calls:
        fn_name = tool_call.function.name
        fn_args = json.loads(tool_call.function.arguments)

        fn = TOOL_FUNCTIONS.get(fn_name)
        if fn:
            result = fn(**fn_args)
        else:
            result = {"error": f"Tool '{fn_name}' không tồn tại."}

        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result, ensure_ascii=False),
        })

    final_response = await client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.3,
    )

    return final_response.choices[0].message.content
