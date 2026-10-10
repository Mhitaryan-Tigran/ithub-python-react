from manager import manager
from models import Activity, Task
from store import activity


async def publish(kind: str, task: Task | None, actor: str, text: str, task_id: int | None = None) -> None:
    entry = Activity(actor=actor, text=text, task_id=task.id if task else task_id)
    activity.appendleft(entry)
    payload = {"type": kind, "activity": entry.model_dump()}
    if task is not None:
        payload["task"] = task.model_dump(mode="json")
    if task_id is not None:
        payload["task_id"] = task_id
    await manager.broadcast(payload)


async def notify(username: str | None, actor: str, text: str, task_id: int) -> None:
    if username and username != actor:
        await manager.send_personal(username, {"type": "notification", "text": text, "task_id": task_id})
