from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_flow():
    assert client.get("/tasks").status_code == 200
    created = client.post("/tasks", json={"title": "Новая", "category": {"name": "Учёба", "color": "red"}, "internal_note": "secret"})
    assert created.status_code == 201
    body = client.get(f"/tasks/{created.json()['id']}").json()
    assert "internal_note" not in body and body["category"]["color"] == "red"
    bad = client.post("/tasks", json={"title": "ab", "category": {"name": "x", "color": "y"}})
    assert bad.status_code == 422 and "не менее 3" in bad.text
    assert client.get("/tasks/999").status_code == 404
    pre = client.options("/tasks", headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "GET"})
    assert pre.headers["access-control-allow-origin"] == "http://localhost:5173"
