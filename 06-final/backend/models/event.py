from pydantic import BaseModel, Field

from models.task import now


class Activity(BaseModel):
    actor: str
    text: str
    task_id: int | None = None
    timestamp: str = Field(default_factory=now)


class ChatMessage(BaseModel):
    username: str
    text: str = Field(min_length=1, max_length=1000)
    timestamp: str = Field(default_factory=now)
