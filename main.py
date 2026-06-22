from  fastapi              import FastAPI
from  fastapi.responses    import FileResponse, JSONResponse
from  fastapi.staticfiles  import StaticFiles
from  pydantic             import BaseModel
from  json                 import dump, load
from  os                   import path

app  = FastAPI ()

BASE_DIR = path.dirname ( path.abspath ( __file__ ) )
app.mount (
    "/static",
    StaticFiles ( directory = BASE_DIR ),
    name = "static"
 )


TASKS_FILE = path.join ( BASE_DIR , "tasks.json" )


class TaskCreate ( BaseModel ):
    text: str


def load_tasks():
    if not path.exists ( TASKS_FILE ) :
        with open ( TASKS_FILE , "w" ) as f:
            dump( [] , f )

    with open( TASKS_FILE , "r" ) as f:
        return load( f )


def save_tasks(tasks):
    with open(TASKS_FILE, "w") as f:
        dump(tasks, f, indent=4)


def next_id(tasks):
    if not tasks:
        return 1

    return max(task["id"] for task in tasks) + 1


app.mount("/static", StaticFiles(directory=BASE_DIR), name="static")


@app.get("/")
async def home():
    return FileResponse(path.join(BASE_DIR, "index.html"))


@app.get("/tasks")
async def get_tasks():
    return load_tasks()


@app.post("/tasks")
async def create_task(task: TaskCreate):
    tasks = load_tasks()

    new_task = {
        "id": next_id(tasks),
        "text": task.text,
        "completed": False
    }

    tasks.append(new_task)
    save_tasks(tasks)

    return new_task


@app.put("/tasks/{task_id}")
async def toggle_task(task_id: int):
    tasks = load_tasks()

    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]

            save_tasks(tasks)

            return task

    return JSONResponse(
        status_code=404,
        content={"message": "Task not found"}
    )


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    tasks = load_tasks()

    updated_tasks = [
        task for task in tasks
        if task["id"] != task_id
    ]

    save_tasks(updated_tasks)

    return {"message": "Task deleted"}