from pydantic import BaseModel


class UploadOut(BaseModel):
    filename: str
    content_type: str
    size: int
    width: int
    height: int
    url: str
    thumbnail_url: str
    thumbnail_width: int
    thumbnail_height: int
