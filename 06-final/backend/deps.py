from urllib.parse import unquote

from fastapi import Header


def current_user(x_user: str = Header(default="%D0%B3%D0%BE%D1%81%D1%82%D1%8C")) -> str:
    return unquote(x_user).strip()[:32] or "гость"
