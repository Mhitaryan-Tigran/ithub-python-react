from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from routers import live, tasks, uploads
from store import seed

settings.media_dir.mkdir(parents=True, exist_ok=True)
seed()

app = FastAPI(
    title=settings.app_title,
    description="TaskFlow: командная доска задач в реальном времени. REST для изменений, WebSocket для live-обновлений, чата, присутствия и личных уведомлений, Pillow для обложек.",
    version="6.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(uploads.router)
app.include_router(live.router)
app.mount("/media", StaticFiles(directory=settings.media_dir), name="media")
