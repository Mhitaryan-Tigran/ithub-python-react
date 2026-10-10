from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_stream():
    with client.stream("GET", "/jobs/report/stream?delay=0") as response:
        body = "".join(response.iter_text())
    assert body.count("event: progress") == 5
    assert body.count("event: complete") == 1
    assert '"percent":100' in body
