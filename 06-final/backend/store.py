from collections import deque

from models import Activity, ChatMessage, Status, Task

tasks: dict[int, Task] = {}
activity: deque[Activity] = deque(maxlen=100)
chat: deque[ChatMessage] = deque(maxlen=200)


def seed() -> None:
    samples = [
        ("Спроектировать схему API", "Роутеры tasks, uploads и ws", "Анна", 3, Status.done),
        ("Подключить WebSocket к React", "Хук useLiveBoard и контекст", "Борис", 3, Status.in_progress),
        ("Обложки задач через Pillow", "Ресайз до 640×360 и раздача через StaticFiles", None, 2, Status.todo),
        ("Подготовить защиту проекта", "Демо в двух вкладках браузера", "Анна", 1, Status.todo),
    ]
    for index, (title, description, assignee, priority, status) in enumerate(samples, start=1):
        tasks[index] = Task(id=index, title=title, description=description, assignee=assignee, priority=priority, status=status, created_by="system")


def next_id() -> int:
    return max(tasks, default=0) + 1
