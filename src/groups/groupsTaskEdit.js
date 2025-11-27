// taskEdit.js
import { auth, db } from "/src/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, deleteDoc } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editForm");
  const backBtn = document.getElementById("back");
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

    const groupId = localStorage.getItem("selectedGroupID");
    const taskRef = doc(db, "groups", groupId, "tasks", taskId);

    // Load task into form
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

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const newTask = {
        course: document.getElementById("course").value,
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        date: document.getElementById("date").value,
        priority: document.getElementById("priority").value,
      };
      // Update task in Firestore
      if (user) {
        try {
          const userTasks = collection(db, "users", user.uid, "tasks");
          await addDoc(userTasks, newTask);
          window.location.href = "viewTasks.html";
          console.log("Task added for user:", user.uid);
        } catch (error) {
          console.log(error);
        }
      } else {
        window.location.href = "login.html";
      }
    });

    backBtn.addEventListener("click", () => {
      window.location.href = "groupTasks.html";
    })

      // Disable delete button if not task owner
    if (user.uid != doc(db, "groups", groupId).uid) {
      deleteBtn.classList.add("disabled");
      console.log(user.uid)
    }

    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this task?")) return;
      try {
        await deleteDoc(taskRef);
        window.location.href = "groupTasks.html";
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task");
      }
    });
  });
});
