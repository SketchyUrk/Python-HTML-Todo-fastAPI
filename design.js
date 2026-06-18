async function loadTasks() {
    const response = await fetch("http://127.0.0.1:8000/tasks");
    const tasks = await response.json();

    const tableBody = document.getElementById("taskTable");

    tableBody.innerHTML = "";

    tasks.forEach(task => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td class="${task.complete ? 'completed' : ''}">
                ${task.complete ? 'Yes' : 'No'}
            </td>
        `;

        tableBody.appendChild(row);
    });
}


document.getElementById("addBtn").addEventListener("click", async () => {

    const title = document.getElementById("taskTitle").value;

    if (!title.trim()) {
        alert("Please enter a task title");
        return;
    }

    await fetch("http://127.0.0.1:8000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title
        })
    });

    document.getElementById("taskTitle").value = "";

    loadTasks();
});

document.getElementById("completeBtn").addEventListener("click", async () => {
    
    const input = document.getElementById("taskID");
    const id = input.value;

    console.log("ID input element:", document.getElementById("taskID"));
    console.log("ID value:", document.getElementById("taskID").value);

    await fetch(`http://127.0.0.1:8000/tasks/${id}/complete:${id}`, {
        method: "PUT"
    });

    loadTasks();
});

document.getElementById("deleteBtn").addEventListener("click", async () => {
    const id = document.getElementById("taskID").value;

    await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
});

loadTasks()