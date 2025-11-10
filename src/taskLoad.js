// Import helper to run code only after Firebase Authentication is ready
import { onAuthReady } from "./authentication.js";
// Import Firestore functions for reading data
import { collection, getDocs } from "firebase/firestore";
// Import initialized Firestore database instance
import { db } from "./firebaseConfig.js";

// Run this code when Firebase Auth is ready and a user state is known
onAuthReady(async (user) => {
  // If no one is logged in, stop running the code
  if (!user) {
    console.log("No user logged in");
    return;
  }

  // Get the container element in the HTML where tasks will be displayed
  const container = document.getElementById("events-container");
  container.innerHTML = "";

  // Reference to the current logged-in user's 'tasks' collection in Firestore
  const tasksCollectionRef = collection(db, `users/${user.uid}/tasks`);

  // Fetch all documents (tasks) from that collection
  const querySnapshot = await getDocs(tasksCollectionRef);

  // Sort tasks by date (ascending)
  const querySnapshotDocs = querySnapshot.docs;
  querySnapshotDocs.sort((a, b) => {
    const dateA = new Date(a.data().date);
    const dateB = new Date(b.data().date);
    return dateA - dateB;
  });

  // Group tasks by date first
  const tasksByDate = {};
  querySnapshotDocs.forEach((doc) => {
    const task = doc.data();
    const date = task.date || "No due date";
    if (!tasksByDate[date]) {
      tasksByDate[date] = [];
    }
    tasksByDate[date].push({ id: doc.id, ...task });
  });

  // Loop through each date group and create visual cards
  Object.keys(tasksByDate).forEach((date) => {
    // Create date header (only once per date)
    const dateHeader = document.createElement("h2");
    dateHeader.textContent = `Due: ${date}`;
    container.appendChild(dateHeader);

    // Create cards for all tasks under this date
    tasksByDate[date].forEach((task) => {
      const card = document.createElement("div");
      card.className = "card";

      // Card HTML (only show unchecked circle initially)
      card.innerHTML = `
        <p>${task.course || "No course"}</p>
        <p>${task.name || "Untitled task"}</p>
        <p>${task.priority || "Normal"}</p>
        <svg class="task-checkbox" id="unchecked" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
          <!-- Unchecked Circle -->
          <circle cx="50" cy="50" r="35" fill="none" stroke="#A40606" stroke-width="3"/>
        </svg>
        <svg class="task-checkbox hidden" id="checked" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
          <!-- Checked Circle -->
          <circle cx="50" cy="50" r="35" fill="#A40606" stroke="#A40606" stroke-width="3"/>
          <path d="M 30 50 L 43 63 L 70 33" 
                stroke="#FFFFFF" 
                stroke-width="5" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                fill="none"/>
        </svg>
      `;

      // Redirect to task detail when the card (but not checkbox) is clicked
      card.addEventListener("click", (e) => {
        // Avoid triggering this when checkbox is clicked
        if (e.target.closest(".task-checkbox")) return;
        localStorage.setItem("selectedTaskId", task.id);
        window.location.href = "taskDetail.html";
      });

      // Handle checkbox click
      const unchecked = card.querySelector("#unchecked");
      const checked = card.querySelector("#checked");

      unchecked.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent triggering the card click
        unchecked.classList.add("hidden");
        checked.classList.remove("hidden");

        // Redirect after small delay (looks smoother)
        setTimeout(() => {
          window.location.href = "completedTask.html";
        }, 300);
      });

      container.appendChild(card);
    });
  });
});
