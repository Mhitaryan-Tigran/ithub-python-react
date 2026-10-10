from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import ValidationError

from manager import manager
from models import ChatMessage, IncomingMessage, SystemMessage

router = APIRouter(tags=["chat"])


@router.get("/online", summary="Кто сейчас в чате")
def online() -> list[str]:
    return manager.online


@router.websocket("/ws/{username}")
async def chat(websocket: WebSocket, username: str) -> None:
    username = username.strip()[:32]
    if not await manager.connect(username, websocket):
        return
    await manager.broadcast(SystemMessage(text=f"Участник {username} присоединился к чату", online=manager.online).model_dump())
    try:
        while True:
            raw = await websocket.receive_json()
            try:
                incoming = IncomingMessage.model_validate(raw)
            except ValidationError:
                continue
            await manager.broadcast(ChatMessage(username=username, text=incoming.text.strip()).model_dump())
    except WebSocketDisconnect:
        manager.disconnect(username)
        await manager.broadcast(SystemMessage(text=f"Участник {username} покинул чат", online=manager.online).model_dump())
