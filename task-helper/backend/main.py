from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uuid
import sqlite3

conn = sqlite3.connect("task_helper.db")
cursor = conn.cursor()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CreateTaskRequest(BaseModel):
    title: str

status_list = ["Todo","In Progress","Done"]

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        status TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()

def get_connection():
    conn = sqlite3.connect("task_helper.db")
    conn.row_factory = sqlite3.Row
    return conn

def getNextStatus(status:str):
    if(status in status_list):
        return status_list[(status_list.index(status) + 1) % 3]
    raise HTTPException(status_code=404, detail="Status invalid")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/tasks")
def get_tasks():
    conn = get_connection()
    cursor = conn.cursor()
    fetched_value = cursor.execute(
        "SELECT * FROM tasks"
    ).fetchall()
    conn.close()
    result = []
    for task in fetched_value:
        result.append({
            "id": task["id"],
            "title": task["title"],
            "status": task["status"],
        })    
    return result

@app.post("/tasks")
def create_task(request: CreateTaskRequest):
    new_id = str(uuid.uuid4())
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO tasks (id, title, status) VALUES (?, ?, ?)",
        (new_id, request.title, "Todo")
    )
    conn.commit()
    conn.close()
    return {
        "id": new_id,
        "title": request.title,
        "status": "Todo"
    }

@app.patch("/tasks/{task_id}")
def on_status_change(task_id : str):

    conn = get_connection()
    cursor = conn.cursor()
    target_task = cursor.execute(
        "SELECT * FROM tasks WHERE id = ?",
        (task_id,)
    ).fetchone()
    if target_task is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    next_status = getNextStatus(target_task["status"])
    cursor.execute(
        """
            UPDATE tasks
            SET status = ?
            WHERE id = ?
        """,(next_status,task_id)
    )
    conn.commit()
    conn.close()
    return {
        "id": task_id,
        "title": target_task["title"],
        "status": next_status,
    }

@app.delete("/tasks/{task_id}")
def on_delete(task_id : str):
    conn = get_connection()
    cursor = conn.cursor()
    target_task = cursor.execute(
        "SELECT * FROM tasks WHERE id = ?",
        (task_id,)
    ).fetchone()
    if target_task is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    cursor.execute(
        """
            DELETE FROM tasks
            WHERE id = ?;
        """,(task_id,)
    )
    conn.commit()
    conn.close()
    return {
        "id": task_id,
        "title": target_task["title"],
        "status": target_task["status"],
    }