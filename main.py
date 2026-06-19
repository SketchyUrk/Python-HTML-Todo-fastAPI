from fastapi import FastAPI, Request, Form
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates

app = FastAPI()

templates = Jinja2Templates(directory="templates")

tasks = []
task_id = 1

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "tasks": tasks
        }
    )

@app.post("/add")
def add_task(title: str = Form(...)):
    global task_id
    
    tasks.append({
        "id": task_id,
        "title": title,
        "completed": False
    })
    
    task_id += 1
    
    return RedirectResponse("/", status_code=303)

@app.post("/toggle/{id}")
def toggle_task(id: int):
    for task in tasks:
        if task["id"] == id:
            task["completed"] = not task["completed"]
            break

    return RedirectResponse("/", status_code=303)

@app.post("/delete/{id}")
def delete_task(id: int):
    global tasks
    
    tasks = [task for task in tasks if task["id"] != id]
    
    return RedirectResponse("/", status_code=303)