document.addEventListener("DOMContentLoaded", () => {

let currentUser = null;
let currentPassword = null;

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const loginBtn = document.getElementById("loginBtn");
const loginScreen = document.getElementById("loginScreen");
const todoScreen = document.getElementById("todoScreen");

const registerBtn = document.getElementById("registerBtn");



async function loadTasks() {
    if (!currentUser || !currentPassword) return;

    const response = await fetch(
        `/tasks?username=${currentUser}&password=${currentPassword}`
    );

    if (!response.ok) return;

    const tasks = await response.json();

    taskList.innerHTML = "";
    tasks.forEach(createTaskElement);
}

function createTaskElement(task) {
    const li = document.createElement("li");

    li.className = task.completed ? "task completed" : "task";

    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <div class="actions">
            <button class="complete-btn">
                ${task.completed ? "Undo" : "Complete"}
            </button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    li.querySelector(".complete-btn").addEventListener("click", async () => {
        await fetch(`/tasks/${task._id}`, { method: "PUT" });
        loadTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", async () => {
        await fetch(`/tasks/${task._id}`, { method: "DELETE" });
        loadTasks();
    });

    taskList.appendChild(li);
}

loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch(
        `/tasks?username=${username}&password=${password}`
    );

    if (!response.ok) {
        alert("Login failed");
        return;
    }

    currentUser = username;
    currentPassword = password;

    loginScreen.style.display = "none";
    todoScreen.style.display = "block";

    loadTasks();
});

taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return;

    await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            text,
            username: currentUser,
            password: currentPassword
        })
    });

    taskInput.value = "";
    loadTasks();
});

registerBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message || "Register failed");
        return;
    }

    alert("Account created! You can now log in.");
});


loadTasks();

});