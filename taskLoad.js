const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const container = document.getElementById("events-container");

tasks.forEach((task, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
    <div class="col">
            <h2>Due: ${task.date}</h2>
            <div class="card">
                <p>${task.course}</p>
                <p>${task.name}</p>
                <p>${task.priority}</p>
            </div>
        </div>
        `;

        card.addEventListener("click", () => {
        localStorage.setItem("editIndex", index);
        window.location.href = "taskDetail.html";
        });
        
        container.appendChild(card);
});