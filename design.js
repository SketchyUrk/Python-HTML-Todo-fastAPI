fetch("tasks.json")
    .then(response => response.json())
    .then(tasks => {
        const tableBody = document.getElementById('taskTableBody');

        tasks.forEach(task => {
            const row = document.createElement('tr');

            row.innerHTML =`
            <td class="taskID">${task.id}</td>
            <td class="taskTitle">${task.title}</td>
            <td class="tastComplete">${task.completed ? 'Yes' : 'No'}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading tasks:',error));