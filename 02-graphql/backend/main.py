from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import graphql

app = FastAPI(
    title=settings.app_title,
    description="Менеджер задач: GraphQL API на Strawberry для React-клиента на Apollo Client. Песочница GraphiQL доступна на /graphql.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graphql.router)
