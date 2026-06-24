const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

async function loadTasks() {
    const response = await fetch("/tasks");
    const tasks = await response.json();

    taskList.innerHTML = "";

    tasks.forEach(task => {
        createTaskElement(task);
    });
}

async function loadTasks() {
    const response = await fetch("/tasks");

    console.log("Status:", response.status);

    const tasks = await response.json();

    console.log("Tasks:", tasks);
    console.log("Is array?", Array.isArray(tasks));

    taskList.innerHTML = "";

    tasks.forEach(task => {
        createTaskElement(task);
    });
}

function createTaskElement(task) {
    const li = document.createElement("li");

    li.className = task.completed
        ? "task completed"
        : "task";

    li.innerHTML = `
        <span class="task-text">
            ${task.text}
        </span>

        <div class="actions">
            <button class="complete-btn">
                ${task.completed ? "Undo" : "Complete"}
            </button>

            <button class="delete-btn">
                Delete
            </button>
        </div>
    `;

    const completeBtn =
        li.querySelector(".complete-btn");

    const deleteBtn =
        li.querySelector(".delete-btn");

    completeBtn.addEventListener(
        "click",
        async () => {
            await fetch(
                `/tasks/${task._id}`,
                {
                    method: "PUT"
                }
            );

            loadTasks();
        }
    );

    deleteBtn.addEventListener(
        "click",
        async () => {
            await fetch(
                `/tasks/${task._id}`,
                {
                    method: "DELETE"
                }
            );

            loadTasks();
        }
    );

    taskList.appendChild(li);
}

taskForm.addEventListener(
    "submit",
    async e => {
        e.preventDefault();

        const text =
            taskInput.value.trim();

        if (!text) return;

        await fetch("/tasks", {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify({
                text
            })
        });

        taskInput.value = "";

        loadTasks();
    }
);

loadTasks();