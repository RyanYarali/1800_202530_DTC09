document.getElementById("taskForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const newTask = {
			course: document.getElementById("course").value,
			name: document.getElementById("name").value,
			description: document.getElementById("description").value,
			date: document.getElementById("date").value,
			priority: document.getElementById("priority").value,
		};
		let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
		tasks.push(newTask);
		localStorage.setItem("tasks", JSON.stringify(tasks));
		console.log("Form saved, redirecting...");
		window.location.href = "viewTasks.html";

});
