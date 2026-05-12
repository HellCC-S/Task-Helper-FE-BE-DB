from http.client import HTTPException

from fastapi import FastAPI
from pydantic import BaseModel
import uuid

app = FastAPI()

tasks = []

class CreateTaskRequest(BaseModel):
    title: str

status_list = ["Todo","In Progress","Done"]

def getNextStatus(status:str):
    if(status in status_list):
        return status_list[(status_list.index(status) + 1) % 3]
    raise HTTPException(status_code=404, detail="Status invalid")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/tasks")
def get_tasks():
    return tasks

@app.post("/tasks")
def create_task(request: CreateTaskRequest):
    new_task = {
        "id": str(uuid.uuid4()),
        "title": request.title,
        "status" : "Todo",
    }

    tasks.append(new_task)
    return new_task

@app.patch("/tasks/{task_id}")
def on_status_change(task_id : str):
    for task in tasks:
        if task["id"] == task_id:
            task["status"] = getNextStatus(task["status"])
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.patch("/tasks/{task_id}")
def on_status_change(task_id : str):
    for task in tasks:
        if task["id"] == task_id:
            tasks.remove(task)
    raise HTTPException(status_code=404, detail="Task not found")