import json
import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from agent import chat_with_nemo, get_suggestions, POPULAR_SUGGESTIONS

load_dotenv()

app = FastAPI(title="Nemo - Vietnam Airlines AI Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

FEEDBACK_FILE = os.path.join(os.path.dirname(__file__), "feedback_log.json")


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class ChatResponse(BaseModel):
    response: str


class FeedbackRequest(BaseModel):
    bot_response: str
    user_message: str = ""
    rating: str = ""        # "like" | "dislike" | ""
    comment: str = ""


@app.get("/")
async def root():
    return {"status": "ok", "agent": "Nemo - Vietnam Airlines AI"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Tin nhắn không được để trống.")

    response = await chat_with_nemo(request.message, request.history)
    return ChatResponse(response=response)


class SuggestionsRequest(BaseModel):
    history: list[dict] = []


@app.get("/suggestions")
async def suggestions_default():
    return {"suggestions": POPULAR_SUGGESTIONS}


@app.post("/suggestions")
async def suggestions(request: SuggestionsRequest):
    result = await get_suggestions(request.history)
    return {"suggestions": result}


@app.post("/feedback")
async def save_feedback(request: FeedbackRequest):
    entry = {
        "timestamp": datetime.now().isoformat(),
        "rating": request.rating,
        "comment": request.comment,
        "user_message": request.user_message,
        "bot_response": request.bot_response,
    }

    if os.path.exists(FEEDBACK_FILE):
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = []

    data.append(entry)

    with open(FEEDBACK_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return {"status": "ok", "message": "Feedback đã được ghi nhận."}
