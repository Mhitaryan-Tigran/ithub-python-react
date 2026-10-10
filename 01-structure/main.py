from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import tasks

app = FastAPI(
    title=settings.app_title,
    description="Менеджер задач: API для React-клиента. Задачи с категориями, валидация названия и скрытие служебных полей через response_model.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
