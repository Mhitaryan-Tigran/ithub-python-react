from fastapi import APIRouter, Depends, HTTPException, status

from deps import current_user
from events import notify, publish
from models import Status, Task, TaskCreate, TaskUpdate
from models.task import now
from store import tasks, next_id

router = APIRouter(prefix="/tasks", tags=["tasks"])

STATUS_NAMES = {Status.todo: "К работе", Status.in_progress: "В процессе", Status.done: "Готово"}


def find(task_id: int) -> Task:
    if task_id not in tasks:
        raise HTTPException(404, f"Задача {task_id} не найдена")
    return tasks[task_id]


@router.get("", response_model=list[Task], summary="Все задачи")
def list_tasks() -> list[Task]:
    return list(tasks.values())


@router.get("/{task_id}", response_model=Task, summary="Задача по ID")
def get_task(task_id: int) -> Task:
    return find(task_id)


@router.post("", response_model=Task, status_code=status.HTTP_201_CREATED, summary="Создать задачу")
async def create_task(payload: TaskCreate, x_user: str = Depends(current_user)) -> Task:
    task = Task(id=next_id(), created_by=x_user, **payload.model_dump())
    tasks[task.id] = task
    await publish("task_created", task, x_user, f"создал(а) задачу «{task.title}»")
    await notify(task.assignee, x_user, f"{x_user} назначил(а) вам задачу «{task.title}»", task.id)
    return task


@router.patch("/{task_id}", response_model=Task, summary="Изменить задачу")
async def update_task(task_id: int, payload: TaskUpdate, x_user: str = Depends(current_user)) -> Task:
    task = find(task_id)
    changes = payload.model_dump(exclude_unset=True)
    before = task.model_copy()
    updated = task.model_copy(update={**changes, "updated_at": now()})
    tasks[task_id] = updated
    if "status" in changes and changes["status"] != before.status:
        text = f"перенёс(ла) «{updated.title}» в «{STATUS_NAMES[updated.status]}»"
    elif "assignee" in changes and changes["assignee"] != before.assignee:
        text = f"назначил(а) «{updated.title}» на {updated.assignee or 'никого'}"
    else:
        text = f"обновил(а) задачу «{updated.title}»"
    await publish("task_updated", updated, x_user, text)
    if "assignee" in changes and changes["assignee"] != before.assignee:
        await notify(updated.assignee, x_user, f"{x_user} назначил(а) вам задачу «{updated.title}»", task_id)
    return updated


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Удалить задачу")
async def delete_task(task_id: int, x_user: str = Depends(current_user)) -> None:
    task = tasks.pop(find(task_id).id)
    await publish("task_deleted", None, x_user, f"удалил(а) задачу «{task.title}»", task_id=task_id)
