import strawberry


@strawberry.type
class Category:
    name: str
    color: str


@strawberry.type
class Task:
    id: strawberry.ID
    title: str
    description: str
    is_completed: bool
    category: Category
