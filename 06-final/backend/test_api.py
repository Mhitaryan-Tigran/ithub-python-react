import io

from fastapi.testclient import TestClient
from PIL import Image

from urllib.parse import quote

from main import app

client = TestClient(app)


def test_live_board():
    with client.websocket_connect("/ws/Анна") as anna:
        snapshot = anna.receive_json()
        assert snapshot["type"] == "snapshot" and len(snapshot["tasks"]) == 4
        assert anna.receive_json()["type"] == "presence"
        with client.websocket_connect("/ws/Борис") as boris:
            boris.receive_json()
            assert anna.receive_json()["online"] == ["Анна", "Борис"]
            boris.receive_json()

            made = client.post("/tasks", json={"title": "Новая задача", "assignee": "Борис"}, headers={"X-User": quote("Анна")})
            assert made.status_code == 201
            assert anna.receive_json()["type"] == "task_created"
            assert boris.receive_json()["type"] == "task_created"
            assert boris.receive_json()["type"] == "notification"

            task_id = made.json()["id"]
            client.patch(f"/tasks/{task_id}", json={"status": "done"}, headers={"X-User": quote("Борис")})
            moved = anna.receive_json()
            assert moved["task"]["status"] == "done" and "Готово" in moved["activity"]["text"]
            boris.receive_json()

            buf = io.BytesIO()
            Image.new("RGB", (1200, 900), "orange").save(buf, "JPEG")
            cover = client.post(f"/tasks/{task_id}/cover", files={"file": ("c.jpg", buf.getvalue(), "image/jpeg")}, headers={"X-User": quote("Анна")})
            assert cover.json()["cover_url"].startswith("http://")
            anna.receive_json()
            boris.receive_json()

            anna.send_json({"type": "chat", "text": "Готово!"})
            assert boris.receive_json()["message"]["text"] == "Готово!"
            anna.receive_json()

    assert client.post("/tasks", json={"title": "ab"}).status_code == 422
