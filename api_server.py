import threading
import time
import traceback
import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import runs_db
from jira_bot import PipelineHalt, run_pipeline

runs_db.init_db()

app = FastAPI(title="Jira SDLC Pipeline API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class RunTicketRequest(BaseModel):
    ticket_key: str


def _execute(run_id: str, ticket_key: str) -> None:
    start = time.monotonic()

    def on_step(step_key: str, state: str, log: str | None = None) -> None:
        runs_db.update_step(run_id, step_key, state, log)

    try:
        result = run_pipeline(ticket_key=ticket_key, on_step=on_step)
        runs_db.finish_run(run_id, "success", result.get("pr_url"), int(time.monotonic() - start))
    except PipelineHalt as e:
        runs_db.finish_run(run_id, e.status, None, int(time.monotonic() - start))
    except Exception:
        print(f"!! Unhandled error running {ticket_key} (run {run_id}):")
        traceback.print_exc()
        runs_db.finish_run(run_id, "error", None, int(time.monotonic() - start))


@app.post("/api/run-ticket")
def run_ticket(req: RunTicketRequest):
    run_id = str(uuid.uuid4())
    started_at = datetime.now(timezone.utc).isoformat()
    runs_db.create_run(run_id, req.ticket_key, started_at)
    threading.Thread(target=_execute, args=(run_id, req.ticket_key), daemon=True).start()
    return {"run_id": run_id}


@app.get("/api/run-status/{run_id}")
def run_status(run_id: str):
    run = runs_db.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run


@app.get("/api/runs")
def list_runs():
    return runs_db.get_runs()


@app.get("/api/stats")
def stats():
    return runs_db.get_stats()
