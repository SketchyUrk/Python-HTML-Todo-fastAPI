from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

tasks = []
task_id = 1


class TaskCreate(BaseModel):
    text: str
    
@app.get("/tasks")
async def get_tasks():
    
    return tasks


@app.post("/tasks")
async def create_task(task: TaskCreate):
    
    global task_id
    
    new_task = {
        "id": task_id,
        "text": task.text,
        "completed": False
    }
    
    tasks.append(new_task)
    task_id += 1
    
    return new_task


@app.put("/tasks/{task_id}")
async def toggle_task(task_id: int):
    
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]
            return task
        
    return JSONResponse(
        status_code=404,
        content={"message": "Task not found"}
    )
    

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    
    global tasks
    
    tasks = [task for task in tasks if task["id"] != task_id]
    
    return {"message": "Task deleted"}