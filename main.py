from fastapi import FastAPI, HTTPException, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()

templates = Jinja2Templates(directory="templates")

app.mount(
         "/static",
          StaticFiles(
              directory="static"
              ),
          name="static"
          )




class TaskCreate(BaseModel):
    title: str
    

def loadTasks():
    if not path.exists(TASKS_FILE):
        return []
    
    try:
        with open(TASKS_FILE, "r") as file:
            return load(file)
    except (JSONDecodeError, FileNotFoundError):
        return []


def saveTasks(tasks):
    with open(TASKS_FILE, "w") as file:
        dump(tasks, file, indent=4)


def nextID(tasks):
    if not tasks:
        return 1
    return max(task["id"] for task in tasks) + 1


@app.get("/")
def home(request: Request):
    tasks = loadTasks()

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "tasks": tasks
        }
    )


@app.get("/tasks")
def listTasks():
    return loadTasks()


@app.post("/tasks")
def addTask(taskData : TaskCreate):
    tasks = loadTasks()
    
    task = {
        "id": nextID(tasks),
        "title": taskData.title,
        "completed": False
    }
    
    tasks.append(task)
    saveTasks(tasks)
    
    return {
        "message": "Task added",
        "Task": task
    }
    

@app.put("/tasks/{taskID}/complete")
def completeTask(taskID: int):
    tasks = loadTasks()

    for task in tasks:
        if task["id"] == taskID:
            task["completed"] = True
            saveTasks(tasks)
            return {"message": "Task marked complete"}

    raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/tasks/{taskID}")
def deleteTask(taskID: int):
    tasks = loadTasks()
    
    for task in tasks:
        if task["id"] == taskID:
            tasks.remove(task)
            saveTasks(tasks)
            
            return {"message" : "Task deleted"}
        
    raise HTTPException(status_code=404, 
                        detail="Task not found")