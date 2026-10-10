from models import Category, Task

CATEGORIES = {
    "Работа": Category(name="Работа", color="#2563eb"),
    "Дом": Category(name="Дом", color="#16a34a"),
    "Учёба": Category(name="Учёба", color="#9333ea"),
}

tasks: dict[int, Task] = {
    1: Task(id="1", title="Подготовить отчёт", description="Квартальный отчёт по проекту", is_completed=False, category=CATEGORIES["Работа"]),
    2: Task(id="2", title="Купить продукты", description="Молоко, хлеб, сыр", is_completed=True, category=CATEGORIES["Дом"]),
    3: Task(id="3", title="Сдать КТ по GraphQL", description="Apollo Client + Strawberry", is_completed=False, category=CATEGORIES["Учёба"]),
}
