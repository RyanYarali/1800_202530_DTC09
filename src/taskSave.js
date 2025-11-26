import { auth, db } from "/src/firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { createLoadingSpinner } from "./loader.js"; // import loader function
const loader = createLoadingSpinner(); //set variable to loader

document
	.getElementById("taskForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();
		const newTask = {
			course: document.getElementById("course").value,
			name: document.getElementById("name").value,
			description: document.getElementById("description").value,
			date: document.getElementById("date").value,
			priority: document.getElementById("priority").value,
		};
		// Show loader immediately
		loader.show(); 
		onAuthStateChanged(auth, async (users) => {
			if (users) {
				try {
					const userTasks = collection(db, "users", users.uid, "tasks");
					await addDoc(userTasks, newTask);
					window.location.href = "viewTasks.html";
					console.log("Task added for user:", users.uid);
				} catch (error) {
					console.log(error);
				} finally{
					// Hide loader no matter what
					loader.hide()
				}
			}
		});
	});
