function fetchData() {
    fetch("./tasks.json")
        .then(response => {
            if (!response.ok) {
                throw new Error (`HTTP error! Status: ${response.status}`);
            }
            return response.json()
        })
        .then(data => {
            const tasks = document.getElementsByClassName("taskName");

            data.forEach(task =>{
                const p = document.createElement('p');
                p.textContent = `${task.title}`;
                tasks.appendChild(p);
            });
        })
        .catch(error => console.error('Failed to fetch data:', error))
}
fetchData();

let taskTitles = document.getElementsByClassName("taskTitle");
let completed  = document.getElementsByClassName("completed");
