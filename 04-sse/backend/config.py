import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    app_title: str = os.getenv("APP_TITLE", "Task Manager SSE API")
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")


settings = Settings()
