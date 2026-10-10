from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import chat

app = FastAPI(
    title=settings.app_title,
    description="Чат в реальном времени на WebSocket: ConnectionManager, broadcast, системные уведомления о входе и выходе.",
    version="5.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
