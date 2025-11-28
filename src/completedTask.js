// Import helper to run code only after Firebase Authentication is ready
import { onAuthReady } from "./authentication.js";
// Import Firestore functions for reading and writing data
import { collection, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";
// Import initialized Firestore database instance
import { db } from "./firebaseConfig.js";
import { createLoadingSpinner } from "./loader.js"; // import l
const loader = createLoadingSpinner(); //set variable to loader

// --- RENDER FUNCTION: render completed tasks based on provided data ---
function renderCompletedTasks(container, tasksByDate, user) {
  container.innerHTML = "";

  Object.keys(tasksByDate).forEach((date) => {
    // Date header
    const dateHeader = document.createElement("h2");
    dateHeader.textContent = `Completed: ${date}`;
    dateHeader.className = "text-lg font-semibold mt-4";
    container.appendChild(dateHeader);

    // Each task card
    tasksByDate[date].forEach((task) => {
      const card = document.createElement("div");
      card.className = "card-task";
      if (task.name.length > 11 || task.course.length > 11) {
        if (task.name.length > 11) {
          task.name = task.name.substring(0,8) + "...";
        }
        if (task.course.length > 11) {
          task.course = task.course.substring(0,8) + "...";
        }
      }
      card.innerHTML = `
          <p style="grid-column: 1;">${task.course || "No course"}</p>
          <p style="grid-column: 2;">${task.name || "Untitled task"}</p>
          <p style="grid-column: 3;">${task.priority || "Normal"}</p>

        <!-- Checked icon -->
        <svg class="task-checkbox" id="checked" viewBox="0 0 100 100" style="grid-column: 4;"
             xmlns="http://www.w3.org/2000/svg" width="30" height="30"
             style="cursor:pointer;">
          <circle cx="50" cy="50" r="35" fill="#A40606" stroke="#A40606" stroke-width="3"/>
          <path d="M 30 50 L 43 63 L 70 33"
                stroke="#FFFFFF"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"/>
        </svg>

        <!-- Empty circle (for reverting) -->
        <svg class="task-checkbox hidden" id="unchecked" viewBox="0 0 100 100" style="grid-column: 4;"
             xmlns="http://www.w3.org/2000/svg" width="30" height="30"
             style="cursor:pointer;">
          <circle cx="50" cy="50" r="35" fill="none" stroke="#A40606" stroke-width="3"/>
        </svg>
      `;

      // Task detail click
      card.addEventListener("click", (e) => {
        if (e.target.closest(".task-checkbox")) return;
        localStorage.setItem("selectedTaskId", task.id);
        window.location.href = "taskDetail.html";
      });

      // Checkbox click — move back to pending
      const checked = card.querySelector("#checked");
      const unchecked = card.querySelector("#unchecked");

      checked.addEventListener("click", async (e) => {
        e.stopPropagation();
        checked.classList.add("hidden");
        unchecked.classList.remove("hidden");

        try {
          const tasksRef = collection(db, `users/${user.uid}/tasks`);
          await setDoc(doc(tasksRef, task.id), {
            ...task,
            restoredAt: new Date().toISOString(),
          });
          await deleteDoc(doc(db, `users/${user.uid}/completedTasks/${task.id}`));

          console.log(`Task "${task.name}" marked as pending again.`);
          setTimeout(() => {
            window.location.href = "completedTask.html";
          }, 300);
        } catch (error) {
          console.error("Error restoring task:", error);
        }
      });

      container.appendChild(card);
    });
  });

  if (Object.keys(tasksByDate).length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No completed tasks found for this filter.";
    emptyMsg.className = "text-gray-500 text-center mt-4";
    container.appendChild(emptyMsg);
  }
}

// --- MAIN SCRIPT ---
onAuthReady(async (user) => {
  if (!user) {
    console.log("No user logged in");
    return;
  }

  // SHOW LOADER at the start
  loader.show();
  const container = document.getElementById("events-container");
  container.innerHTML = "";

  // ✅ Create filter bar at the top
  const filterBar = document.createElement("div");
  filterBar.className = "flex flex-wrap gap-4 mb-4 justify-center";

  filterBar.innerHTML = `
    <select id="filterCourse" class="border px-2 py-1 rounded">
      <option value="all">All Courses</option>
    </select>
    <select id="filterPriority" class="border px-2 py-1 rounded">
      <option value="all">All Priorities</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
  `;

  container.before(filterBar);

  const completedCollectionRef = collection(db, `users/${user.uid}/completedTasks`);
  const querySnapshot = await getDocs(completedCollectionRef);
  const allTasks = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

  // --- Fill unique course options ---
  const courseSelect = document.getElementById("filterCourse");
  const uniqueCourses = [...new Set(allTasks.map((t) => t.course).filter(Boolean))];
  uniqueCourses.forEach((course) => {
    const opt = document.createElement("option");
    opt.value = course;
    opt.textContent = course;
    courseSelect.appendChild(opt);
  });

  // --- Function to filter tasks and re-render ---
  function filterTasks() {
    loader.show();
    const selectedCourse = courseSelect.value;
    const selectedPriority = document.getElementById("filterPriority").value;

    const filtered = allTasks.filter((task) => {
      const matchCourse = selectedCourse === "all" || task.course === selectedCourse;
      const matchPriority = selectedPriority === "all" || task.priority === selectedPriority;
      return matchCourse && matchPriority;
    });

    // Group by date again
    const tasksByDate = {};
    filtered.forEach((task) => {
      const date = task.date || "No due date";
      if (!tasksByDate[date]) tasksByDate[date] = [];
      tasksByDate[date].push(task);
    });

    renderCompletedTasks(container, tasksByDate, user);
    loader.hide();
  }

  // --- Filter change listeners ---
  courseSelect.addEventListener("change", filterTasks);
  document.getElementById("filterPriority").addEventListener("change", filterTasks);

  // --- Initial render ---
  const tasksByDate = {};
  allTasks
    .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0))
    .forEach((task) => {
      const date = task.date || "No due date";
      if (!tasksByDate[date]) tasksByDate[date] = [];
      tasksByDate[date].push(task);
    });

  renderCompletedTasks(container, tasksByDate, user);
  loader.hide();
});
