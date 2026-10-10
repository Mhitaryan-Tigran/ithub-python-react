from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class IncomingMessage(BaseModel):
    text: str = Field(min_length=1, max_length=1000)


class ChatMessage(BaseModel):
    type: Literal["message"] = "message"
    username: str
    text: str
    timestamp: str = Field(default_factory=now)


class SystemMessage(BaseModel):
    type: Literal["system"] = "system"
    text: str
    online: list[str]
    timestamp: str = Field(default_factory=now)
