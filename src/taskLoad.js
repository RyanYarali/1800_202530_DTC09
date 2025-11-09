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
    card.innerHTML = `
      <p>${task.course || "No course"}</p>
      <p>${task.name || "Untitled task"}</p>
      <p>${task.priority || "Normal"}</p>
    `;
    
    // When the card is clicked:
    // - Redirect the user to the task detail page
    card.addEventListener("click", () => {
      localStorage.setItem("selectedTaskId", task.id);
      window.location.href = "taskDetail.html";
    });
    
    // Add the completed card to the container in the web page
    container.appendChild(card);
  });
});
});
























