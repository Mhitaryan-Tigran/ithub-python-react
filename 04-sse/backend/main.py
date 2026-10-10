from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import jobs

app = FastAPI(
    title=settings.app_title,
    description="Server-Sent Events: генерация отчёта по задачам отправляет именованные события progress и complete через sse-starlette.",
    version="4.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router)
