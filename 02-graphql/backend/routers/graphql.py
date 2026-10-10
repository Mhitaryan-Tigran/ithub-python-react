import strawberry
from strawberry.fastapi import GraphQLRouter

from models import Category, Task
from store import CATEGORIES, tasks


def find(task_id: strawberry.ID) -> Task:
    task = tasks.get(int(task_id))
    if task is None:
        raise ValueError(f"Задача {task_id} не найдена")
    return task


@strawberry.type
class Query:
    @strawberry.field(description="Все задачи")
    def all_tasks(self) -> list[Task]:
        return list(tasks.values())

    @strawberry.field(description="Задача по ID")
    def task(self, id: strawberry.ID) -> Task:
        return find(id)

    @strawberry.field(description="Категории")
    def categories(self) -> list[Category]:
        return list(CATEGORIES.values())


@strawberry.type
class Mutation:
    @strawberry.mutation(description="Создать задачу")
    def create_task(self, title: str, description: str = "", category: str = "Работа") -> Task:
        title = title.strip()
        if len(title) < 3:
            raise ValueError("Название задачи должно содержать не менее 3 символов")
        if category not in CATEGORIES:
            raise ValueError(f"Неизвестная категория: {category}")
        new_id = max(tasks, default=0) + 1
        task = Task(id=str(new_id), title=title, description=description, is_completed=False, category=CATEGORIES[category])
        tasks[new_id] = task
        return task

    @strawberry.mutation(description="Отметить задачу выполненной")
    def complete_task(self, id: strawberry.ID) -> Task:
        task = find(id)
        task.is_completed = True
        return task

    @strawberry.mutation(description="Удалить задачу")
    def delete_task(self, id: strawberry.ID) -> strawberry.ID:
        find(id)
        del tasks[int(id)]
        return id


schema = strawberry.Schema(query=Query, mutation=Mutation)
router = GraphQLRouter(schema, prefix="/graphql")
