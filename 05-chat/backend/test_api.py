from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_two_users():
    with client.websocket_connect("/ws/Анна") as anna:
        assert anna.receive_json()["text"] == "Участник Анна присоединился к чату"
        with client.websocket_connect("/ws/Борис") as boris:
            assert anna.receive_json()["online"] == ["Анна", "Борис"]
            boris.receive_json()
            boris.send_json({"text": "Привет!"})
            got = anna.receive_json()
            assert got["type"] == "message" and got["username"] == "Борис" and got["text"] == "Привет!" and got["timestamp"]
            boris.receive_json()
        left = anna.receive_json()
        assert left["type"] == "system" and "покинул" in left["text"]
