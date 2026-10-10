from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import ValidationError

from manager import manager
from models import ChatMessage
from store import activity, chat, tasks

router = APIRouter(tags=["live"])


@router.get("/online", summary="Кто сейчас онлайн")
def online() -> list[str]:
    return manager.online


@router.websocket("/ws/{username}")
async def live(websocket: WebSocket, username: str) -> None:
    username = username.strip()[:32] or "гость"
    first = await manager.connect(username, websocket)
    await websocket.send_json({
        "type": "snapshot",
        "tasks": [task.model_dump(mode="json") for task in tasks.values()],
        "activity": [entry.model_dump() for entry in activity],
        "chat": [message.model_dump() for message in chat],
        "online": manager.online,
    })
    if first:
        await manager.broadcast({"type": "presence", "online": manager.online, "text": f"{username} в сети"})
    try:
        while True:
            raw = await websocket.receive_json()
            if raw.get("type") != "chat":
                continue
            try:
                message = ChatMessage(username=username, text=str(raw.get("text", "")).strip())
            except ValidationError:
                continue
            chat.append(message)
            await manager.broadcast({"type": "chat", "message": message.model_dump()})
    except WebSocketDisconnect:
        if manager.disconnect(username, websocket):
            await manager.broadcast({"type": "presence", "online": manager.online, "text": f"{username} вышел(ла) из сети"})
