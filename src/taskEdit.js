// taskEdit.js
import { auth, db } from "/src/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { createLoadingSpinner } from "./loader.js"; // import loader function
const loader = createLoadingSpinner(); //set variable to loader

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editForm");
  const deleteBtn = document.getElementById("delete");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.error("No user logged in");
      window.location.href = "login.html";
      return;
    }

    const taskId = localStorage.getItem("selectedTaskId");
    if (!taskId) {
      console.error("No task selected");
      window.location.href = "viewTasks.html";
      return;
    }

    const taskRef = doc(db, "users", user.uid, "tasks", taskId);

    // Load task into form
    try {
      loader.show()
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
    }finally{
      loader.hide()
    }

    // Save changes
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        loader.show()
        await updateDoc(taskRef, {
          course: document.getElementById("course").value,
          name: document.getElementById("name").value,
          description: document.getElementById("description").value,
          date: document.getElementById("date").value,
          priority: document.getElementById("priority").value,
        });
        window.location.href = "viewTasks.html";
      } catch (err) {
        console.error("Error updating task:", err);
        alert("Failed to update task");
      }finally{
        loader.hide()
      }
    });

    // Delete task
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this task?")) return;
      try {
        loader.show()
        await deleteDoc(taskRef);
        window.location.href = "viewTasks.html";
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task");
      }finally{
        loader.hide()
      }
    });
  });
});
