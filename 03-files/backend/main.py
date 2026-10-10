from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from routers import uploads

settings.media_dir.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title=settings.app_title,
    description="Загрузка изображений: валидация типа и размера, миниатюры через Pillow, раздача через StaticFiles по полному URL.",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(uploads.router)
app.mount("/media", StaticFiles(directory=settings.media_dir), name="media")
