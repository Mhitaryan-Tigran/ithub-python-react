from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active: dict[str, list[WebSocket]] = {}

    async def connect(self, username: str, websocket: WebSocket) -> bool:
        await websocket.accept()
        first = username not in self.active
        self.active.setdefault(username, []).append(websocket)
        return first

    def disconnect(self, username: str, websocket: WebSocket) -> bool:
        sockets = self.active.get(username, [])
        if websocket in sockets:
            sockets.remove(websocket)
        if not sockets:
            self.active.pop(username, None)
            return True
        return False

    @property
    def online(self) -> list[str]:
        return sorted(self.active)

    async def send_personal(self, username: str, payload: dict) -> None:
        for websocket in list(self.active.get(username, [])):
            try:
                await websocket.send_json(payload)
            except RuntimeError:
                self.disconnect(username, websocket)

    async def broadcast(self, payload: dict) -> None:
        for username in list(self.active):
            await self.send_personal(username, payload)


manager = ConnectionManager()
