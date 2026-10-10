from pydantic import BaseModel, Field, field_validator


class Category(BaseModel):
    name: str = Field(min_length=1, examples=["Работа"])
    color: str = Field(min_length=1, examples=["blue"])


class TaskCreate(BaseModel):
    title: str = Field(examples=["Подготовить отчёт"])
    description: str = Field(default="", examples=["Квартальный отчёт по проекту"])
    is_completed: bool = False
    category: Category
    internal_note: str = Field(default="", examples=["Только для менеджера"])

    @field_validator("title")
    @classmethod
    def title_long_enough(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 3:
            raise ValueError("Название задачи должно содержать не менее 3 символов")
        return value


class Task(TaskCreate):
    id: int


class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    is_completed: bool
    category: Category
