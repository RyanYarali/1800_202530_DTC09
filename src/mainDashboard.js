// mainDashboard.js
import { onAuthReady } from "./authentication.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

// Run this code when Firebase Auth is ready
onAuthReady(async (user) => {
  if (!user) {
    console.log("No user logged in");
    location.href = "index.html";
    return;
  }

  const nameElement = document.getElementById("name-goes-here");
  if (nameElement) {
    nameElement.textContent = `${user.displayName || user.email}!`;
  }

  await loadTodaysTasks(user);
});

async function loadTodaysTasks(user) {
  const container = document.getElementById("todays-tasks-container");
  if (!container) return;

  container.innerHTML = '<p class="text-gray-500">Loading tasks...</p>';

  try {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const tasksCollectionRef = collection(db, `users/${user.uid}/tasks`);
    const querySnapshot = await getDocs(tasksCollectionRef);

    const todaysTasks = [];
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      if (task.date === todayString) {
        todaysTasks.push({ id: doc.id, ...task });
      }
    });

    if (todaysTasks.length === 0) {
      container.innerHTML = `
        <p class="text-gray-500 text-center py-4">
          No tasks due today! 🎉
        </p>
      `;
      return;
    }

    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    todaysTasks.sort((a, b) => {
      return (
        (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
      );
    });

    container.innerHTML = "";
    todaysTasks.forEach((task) => {
      const taskCard = createTaskCard(task);
      container.appendChild(taskCard);
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
    container.innerHTML = `
      <p class="text-red-500 text-center py-4">
        Error loading tasks. Please try again.
      </p>
    `;
  }
}

function createTaskCard(task) {
  const card = document.createElement("div");
  card.classList.add(
    "bg-white/80",
    "backdrop-blur-md",
    "rounded-xl",
    "p-4",
    "shadow-md",
    "border",
    "border-gray-200/50",
    "hover:shadow-lg",
    "transition-all",
    "duration-300",
    "cursor-pointer"
  );

  const priorityColors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };
  const priorityClass = priorityColors[task.priority] || priorityColors.Medium;

  card.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-bold text-[#230007] text-lg">${
        task.name || "Untitled"
      }</h3>
      <span class="px-3 py-1 rounded-full text-xs font-semibold ${priorityClass}">
        ${task.priority || "Medium"}
      </span>
    </div>
    <p class="text-sm text-gray-600 mb-2">${task.course || "No course"}</p>
    ${
      task.description
        ? `<p class="text-sm text-gray-500 mb-2">${task.description}</p>`
        : ""
    }
    <p class="text-xs text-gray-400">Due Today</p>
  `;

  card.addEventListener("click", () => {
    localStorage.setItem("selectedTaskId", task.id);
    window.location.href = "taskDetail.html";
  });

  return card;
}
