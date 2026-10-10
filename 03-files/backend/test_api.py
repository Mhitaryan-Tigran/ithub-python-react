import io

from fastapi.testclient import TestClient
from PIL import Image

from main import app

client = TestClient(app)


def png(w, h):
    buf = io.BytesIO()
    Image.new("RGB", (w, h), "teal").save(buf, "PNG")
    return buf.getvalue()


def test_flow():
    ok = client.post("/uploads", files={"file": ("a.png", png(1600, 800), "image/png")})
    body = ok.json()
    assert ok.status_code == 200 and body["thumbnail_url"].startswith("http://")
    assert (body["thumbnail_width"], body["thumbnail_height"]) == (320, 160)
    assert client.get(body["thumbnail_url"].replace("http://localhost:8000", "")).status_code == 200
    assert client.post("/uploads", files={"file": ("a.gif", b"GIF89a", "image/gif")}).status_code == 400
    big = client.post("/uploads", files={"file": ("b.jpg", b"0" * (5 * 1024 * 1024 + 10), "image/jpeg")})
    assert big.status_code == 400 and "5 МБ" in big.json()["detail"]
