from fastapi import APIRouter, HTTPException, status

from models import Category, Task, TaskCreate, TaskOut

router = APIRouter(prefix="/tasks", tags=["tasks"])

tasks: dict[int, Task] = {
    1: Task(
        id=1,
        title="Подготовить отчёт",
        description="Квартальный отчёт по проекту",
        category=Category(name="Работа", color="blue"),
        internal_note="Согласовать с бухгалтерией до пятницы",
    ),
    2: Task(
        id=2,
        title="Купить продукты",
        description="Молоко, хлеб, сыр",
        category=Category(name="Дом", color="green"),
    ),
}


@router.get("", response_model=list[TaskOut], summary="Список задач")
def list_tasks() -> list[Task]:
    return list(tasks.values())


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED, summary="Создать задачу")
def create_task(payload: TaskCreate) -> Task:
    task = Task(id=max(tasks, default=0) + 1, **payload.model_dump())
    tasks[task.id] = task
    return task


@router.get("/{task_id}", response_model=TaskOut, summary="Задача по ID")
def get_task(task_id: int) -> Task:
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail=f"Задача {task_id} не найдена")
    return tasks[task_id]
