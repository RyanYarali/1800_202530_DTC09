const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const container = document.getElementById("events-container");

tasks.forEach(task => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
    <div class="col">
            <h2>Due: ${task.date}</h2>
            <div class="card">
                <p>${task.course}</p>
                <p>${task.name}</p>
                <p>${task.priority}</p>
                <p>${task.description}</p>
            </div>
        </div>
        `;
        container.appendChild(card);
});