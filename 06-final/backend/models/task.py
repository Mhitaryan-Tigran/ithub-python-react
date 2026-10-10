from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, Field, field_validator


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class Status(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"


class TaskCreate(BaseModel):
    title: str
    description: str = ""
    assignee: str | None = None
    priority: int = Field(default=2, ge=1, le=3)

    @field_validator("title")
    @classmethod
    def title_long_enough(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 3:
            raise ValueError("Название задачи должно содержать не менее 3 символов")
        return value


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    assignee: str | None = None
    priority: int | None = Field(default=None, ge=1, le=3)
    status: Status | None = None

    @field_validator("title")
    @classmethod
    def title_long_enough(cls, value: str | None) -> str | None:
        if value is not None and len(value.strip()) < 3:
            raise ValueError("Название задачи должно содержать не менее 3 символов")
        return value.strip() if value else value


class Task(TaskCreate):
    id: int
    status: Status = Status.todo
    cover_url: str | None = None
    created_by: str
    updated_at: str = Field(default_factory=now)
