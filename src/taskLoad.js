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
  const querySnapshotDocs = querySnapshot.docs

  querySnapshotDocs.sort((a, b) => {
    const dateA = new Date (a.data().date)
    const dateB = new Date (b.data().date)
    return dateA - dateB
  });

  // Loop through each task and create a visual card for it
  querySnapshotDocs.forEach((doc) => {
    const task = doc.data();
    const card = document.createElement("div");
  
    
    card.innerHTML = `
      <div class="col">
        <h2>Due: ${task.date || "No due date"}</h2>
        <div class="card">
          <p>${task.course || "No course"}</p>
          <p>${task.name || "Untitled task"}</p>
          <p>${task.priority || "Normal"}</p>
        </div>
      </div>
    `;

    // When the card is clicked:
    // - Redirect the user to the task detail page
    card.addEventListener("click", () => {
      localStorage.setItem("selectedTaskId", doc.id);
      window.location.href = "taskDetail.html";
    });

    // Add the completed card to the container in the web page
    container.appendChild(card);
  });
});
