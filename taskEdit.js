const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const index = localStorage.getItem("editIndex");

document.getElementById("course").value = tasks[index].course;
document.getElementById("name").value = tasks[index].name;
document.getElementById("description").value = tasks[index].description;
document.getElementById("date").value = tasks[index].date;
document.getElementById("priority").value = tasks[index].priority;

document.getElementById("editForm").addEventListener("submit", function(edit) {
	edit.preventDefault();

	tasks[index] = {
		course: document.getElementById("course").value,
		name: document.getElementById("name").value,
		description: document.getElementById("description").value,
		date: document.getElementById("date").value,
		priority: document.getElementById("priority").value,
	};

	localStorage.setItem("tasks", JSON.stringify(tasks));
	window.location.href = "viewTasks.html"; 
});

document.getElementById("delete").addEventListener("click", function() {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    window.location.href = "viewTasks.html";
});
