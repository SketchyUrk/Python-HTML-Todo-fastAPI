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

loadTasks();