# ithub-python-react

Coursework for "Разработка на языке Python для React" at IThub. One Task Manager theme grows from checkpoint to checkpoint: every folder is a self-contained FastAPI backend (`main.py`, `config.py`, `models/`, `routers/`, CORS from `.env`) plus, where the task asks for it, a Vite + React 18 client.

| Folder | Checkpoint | What it shows |
|---|---|---|
| [01-structure](01-structure) | 1.3 Project structure | APIRouter `/tasks`, nested Pydantic models, custom title validator, `TaskOut` hiding `internal_note`, CORS from `FRONTEND_URL` |
| [02-graphql](02-graphql) | 2.3 Apollo Client | Strawberry GraphQL server, `useQuery` / `useMutation`, loading and error states, `refetchQueries`, `completeTask` and `deleteTask` |
| [03-files](03-files) | 3.3 Serving files | `UploadFile` with type and size checks, Pillow thumbnails, `StaticFiles` with full URLs, preview, upload progress, error messages |
| [04-sse](04-sse) | 4.3 SSE in React | `sse-starlette` named events `progress` / `complete`, `EventSource` with `addEventListener`, `close()` on complete and in cleanup, `onerror` |
| [05-chat](05-chat) | 5.2 Real-time chat | `ConnectionManager`, broadcast, system join/leave messages, JSON `type/username/text/timestamp`, two browser tabs |
| [06-final](06-final) | 6.2 Final project | TaskFlow: a live team task board on WebSocket with drag and drop, task pages with Pillow covers, team chat, activity feed and personal notifications |

## Run

One virtual environment serves every backend:

```bash
python3 -m venv .venv && .venv/bin/pip install -r 06-final/backend/requirements.txt strawberry-graphql sse-starlette
cd 06-final/backend && cp .env.example .env && ../../.venv/bin/uvicorn main:app --port 8000
```

```bash
cd 06-final/frontend && cp .env.example .env && npm install && npm run dev
```

Every backend has a `test_api.py` (`../../.venv/bin/python -m pytest -q`), and every folder has a README and a `screenshots/` directory taken from real runs.
