from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active: dict[str, WebSocket] = {}

    async def connect(self, username: str, websocket: WebSocket) -> bool:
        await websocket.accept()
        if username in self.active:
            await websocket.close(code=4409, reason="Имя уже занято")
            return False
        self.active[username] = websocket
        return True

    def disconnect(self, username: str) -> None:
        self.active.pop(username, None)

    @property
    def online(self) -> list[str]:
        return sorted(self.active)

    async def broadcast(self, payload: dict) -> None:
        for username, websocket in list(self.active.items()):
            try:
                await websocket.send_json(payload)
            except RuntimeError:
                self.disconnect(username)


manager = ConnectionManager()
