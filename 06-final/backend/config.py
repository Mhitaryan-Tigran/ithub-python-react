import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


class Settings:
    app_title: str = os.getenv("APP_TITLE", "TaskFlow API")
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    public_url: str = os.getenv("PUBLIC_URL", "http://localhost:8000").rstrip("/")
    media_dir: Path = Path(os.getenv("MEDIA_DIR", "media"))
    max_upload_bytes: int = 5 * 1024 * 1024
    cover_size: tuple[int, int] = (640, 360)


settings = Settings()
