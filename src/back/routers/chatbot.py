from fastapi import APIRouter, HTTPException
from back.db import db
from back.models import ChatbotState

router = APIRouter()

# 質問のリスト
steps = [
    "どんな目標を達成したいですか？",
    "目標達成のための期間は？",
    "毎日どれくらいの時間を割けますか？",
    "達成したいレベルは？（初級・中級・上級）",
    "進め方について教えてください。"
]


@router.post("/chatbot")
async def chatbot_handler(user_id: str, response: str):
    # ユーザーの状態を取得または作成
    state = db["chatbot_states"].find_one({"user_id": user_id})
    if not state:
        state = ChatbotState(user_id=user_id).dict()
        db["chatbot_states"].insert_one(state)

    # 状態を進める
    current_step = state["current_step"]
    if current_step < len(steps):
        state["current_step"] += 1
        db["chatbot_states"].update_one({"user_id": user_id}, {"$set": state})
        next_question = steps[state["current_step"]]
    else:
        next_question = "ヒアリングが完了しました！"

    return {"question": next_question}
