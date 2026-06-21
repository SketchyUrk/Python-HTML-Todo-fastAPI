const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

async function loadTasks() {
    const response = await fetch("/tasks");
    const tasks = await response.json();

    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed
            ? "Undo"
            : "Complete";

        completeBtn.onclick = async () => {
            await fetch(`/tasks/${task.id}`, {
                method: "PUT"
            });

            loadTasks();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.onclick = async () => {
            await fetch(`/tasks/${task.id}`, {
                method: "DELETE"
            });

            loadTasks();
        };

        const actions = document.createElement("div");
        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(actions);

        taskList.appendChild(li);
    });
}

addBtn.addEventListener("click", async () => {
    const text = taskInput.value.trim();

    if (!text) return;

    await fetch("/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    taskInput.value = "";
    loadTasks();
});

loadTasks();