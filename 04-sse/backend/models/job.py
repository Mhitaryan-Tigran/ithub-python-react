from pydantic import BaseModel


class Progress(BaseModel):
    job: str
    step: int
    total: int
    percent: int
    message: str


class Complete(BaseModel):
    job: str
    message: str
    result_url: str
