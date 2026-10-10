import io
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError

from config import settings
from deps import current_user
from events import publish
from models import Task
from models.task import now
from routers.tasks import find
from store import tasks

router = APIRouter(prefix="/tasks", tags=["uploads"])

ALLOWED = {"image/png", "image/jpeg"}


@router.post("/{task_id}/cover", response_model=Task, summary="Загрузить обложку задачи")
async def upload_cover(task_id: int, file: UploadFile = File(...), x_user: str = Depends(current_user)) -> Task:
    task = find(task_id)
    if file.content_type not in ALLOWED:
        raise HTTPException(400, "Обложка должна быть PNG или JPEG.")
    data = await file.read(settings.max_upload_bytes + 1)
    if len(data) > settings.max_upload_bytes:
        raise HTTPException(400, "Файл слишком большой: максимум 5 МБ.")
    try:
        image = Image.open(io.BytesIO(data))
        image.load()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(400, "Файл повреждён или не является изображением.")

    covers = settings.media_dir / "covers"
    covers.mkdir(parents=True, exist_ok=True)
    name = f"{task_id}-{uuid.uuid4().hex[:8]}.jpg"
    cover = ImageOps.fit(ImageOps.exif_transpose(image).convert("RGB"), settings.cover_size, Image.Resampling.LANCZOS)
    cover.save(covers / name, "JPEG", quality=85)

    updated = task.model_copy(update={"cover_url": f"{settings.public_url}/media/covers/{name}", "updated_at": now()})
    tasks[task_id] = updated
    await publish("task_updated", updated, x_user, f"добавил(а) обложку к «{updated.title}»")
    return updated
