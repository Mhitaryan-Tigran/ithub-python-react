import asyncio
import uuid

from fastapi import APIRouter, Query, Request
from sse_starlette.sse import EventSourceResponse

from models import Complete, Progress

router = APIRouter(prefix="/jobs", tags=["jobs"])

STAGES = [
    "Собираем задачи за квартал",
    "Считаем выполненные и просроченные",
    "Группируем по категориям",
    "Строим диаграммы",
    "Собираем PDF-отчёт",
]


async def report_events(request: Request, delay: float):
    job = uuid.uuid4().hex[:8]
    total = len(STAGES)
    for step, message in enumerate(STAGES, start=1):
        if await request.is_disconnected():
            return
        await asyncio.sleep(delay)
        progress = Progress(job=job, step=step, total=total, percent=step * 100 // total, message=message)
        yield {"event": "progress", "data": progress.model_dump_json()}
    done = Complete(job=job, message="Отчёт готов", result_url=f"/reports/{job}.pdf")
    yield {"event": "complete", "data": done.model_dump_json()}


@router.get("/report/stream", summary="Прогресс генерации отчёта (SSE)")
async def report_stream(request: Request, delay: float = Query(0.9, ge=0, le=5)):
    return EventSourceResponse(report_events(request, delay))
