from fastapi import FastAPI
from routers import chatbot

app = FastAPI()

# ルーターを登録
app.include_router(chatbot.router, prefix="/api")
