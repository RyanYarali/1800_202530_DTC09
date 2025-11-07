// taskEdit.js
import { auth, db } from "/src/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, getDocs, addDoc, collection, doc } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("editForm");
    const deleteBtn = document.getElementById("delete");
    const container = document.getElementById("availableTasks");

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.error("No user logged in");
            window.location.href = "login.html";
            return;
        }

        container.innerHTML = "";

        const tasksCollectionRef = collection(db, `users/${user.uid}/tasks`);
        const querySnapshot = await getDocs(tasksCollectionRef);

        for (const doc of querySnapshot.docs) {
            const taskData = doc.data();
            const taskOption = document.createElement("option");
            taskOption.value = doc.id;
            taskOption.textContent = taskData.name || "Unnamed Task";
            container.appendChild(taskOption);
        }

        let taskRef = null;

        container.addEventListener("change", async (event) => {
            event.preventDefault();
            const taskID = event.target.value;
            taskRef = doc(db, `users/${user.uid}/tasks/${taskID}`);

            try {
                const snap = await getDoc(taskRef);
                if (snap.exists()) {
                    const task = snap.data();
                    document.getElementById("course").value = task.course || "";
                    document.getElementById("name").value = task.name || "";
                    document.getElementById("description").value = task.description || "";
                    document.getElementById("date").value = task.date || "";
                    document.getElementById("priority").value = task.priority || "Medium";
                } else {
                    console.error("Task not found");
                    window.location.href = "viewTasks.html";
                }
            } catch (err) {
                console.error("Error loading task:", err);
            }
        });

        form.addEventListener("submit", async (e) => {
            event.preventDefault();
                    const newTask = {
                        course: document.getElementById("course").value,
                        name: document.getElementById("name").value,
                        description: document.getElementById("description").value,
                        date: document.getElementById("date").value,
                        priority: document.getElementById("priority").value,
                    };
                    onAuthStateChanged(auth, async (users) => {
                        if (users) {
                            try {
                                const GroupID = localStorage.getItem("selectedGroupID");
                                const userTasks = collection(db, "groups", GroupID, "tasks");
                                await addDoc(userTasks, newTask);
                                window.location.href = "groupTasks.html";
                                console.log("Task added for user:", users.uid);
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    })
        });



        // Delete task
        deleteBtn.addEventListener("click", async () => {
            window.location.href = "groupTasks.html";
        });
    });
});
