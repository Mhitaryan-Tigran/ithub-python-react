import io
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from config import settings
from models import UploadOut

router = APIRouter(prefix="/uploads", tags=["uploads"])

ALLOWED = {"image/png": "png", "image/jpeg": "jpg"}


@router.post("", response_model=UploadOut, summary="Загрузить изображение")
async def upload_image(file: UploadFile = File(...)) -> UploadOut:
    if file.content_type not in ALLOWED:
        raise HTTPException(400, f"Недопустимый тип файла: {file.content_type}. Разрешены только PNG и JPEG.")

    data = await file.read(settings.max_upload_bytes + 1)
    if len(data) > settings.max_upload_bytes:
        raise HTTPException(400, "Файл слишком большой: максимум 5 МБ.")

    try:
        image = Image.open(io.BytesIO(data))
        image.load()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(400, "Файл повреждён или не является изображением.")

    stem = uuid.uuid4().hex
    ext = ALLOWED[file.content_type]
    originals = settings.media_dir / "originals"
    thumbs = settings.media_dir / "thumbnails"
    originals.mkdir(parents=True, exist_ok=True)
    thumbs.mkdir(parents=True, exist_ok=True)

    (originals / f"{stem}.{ext}").write_bytes(data)

    thumb = image.copy()
    if thumb.mode not in ("RGB", "RGBA"):
        thumb = thumb.convert("RGBA" if ext == "png" else "RGB")
    thumb.thumbnail(settings.thumbnail_size, Image.Resampling.LANCZOS)
    thumb.save(thumbs / f"{stem}.{ext}")

    base = f"{settings.public_url}/media"
    return UploadOut(
        filename=file.filename or f"{stem}.{ext}",
        content_type=file.content_type,
        size=len(data),
        width=image.width,
        height=image.height,
        url=f"{base}/originals/{stem}.{ext}",
        thumbnail_url=f"{base}/thumbnails/{stem}.{ext}",
        thumbnail_width=thumb.width,
        thumbnail_height=thumb.height,
    )
