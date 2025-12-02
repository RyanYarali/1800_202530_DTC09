// Import helper to run code only after Firebase Authentication is ready
import { onAuthReady } from "./authentication.js";
// Import Firestore functions for reading and writing data
import { collection, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";
// Import initialized Firestore database instance
import { db } from "./firebaseConfig.js";

onAuthReady(async (user) => {
  if (!user) {
    console.log("No user logged in");
    return;
  }

  const container = document.getElementById("events-container");
  container.innerHTML = "";

  // Reference Firestore collection for this user’s pending tasks
  const tasksCollectionRef = collection(db, `users/${user.uid}/tasks`);
  const querySnapshot = await getDocs(tasksCollectionRef);
  const querySnapshotDocs = querySnapshot.docs;

  // Parse tasks
  const allTasks = querySnapshotDocs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  // Sort tasks by date ascending
  allTasks.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  // --- 🔹 Build Filter UI ---
  const filterContainer = document.createElement("div");
  filterContainer.className = "flex flex-wrap gap-2 justify-center mb-4";

  // Course filter dropdown
  const courseSelect = document.createElement("select");
  courseSelect.className = "border rounded px-3 py-2";
  courseSelect.innerHTML = `<option value="">All Courses</option>`;

  // Populate course list dynamically (unique course names)
  const uniqueCourses = [...new Set(allTasks.map((t) => t.course).filter(Boolean))];
  uniqueCourses.forEach((course) => {
    const opt = document.createElement("option");
    opt.value = course;
    opt.textContent = course;
    courseSelect.appendChild(opt);
  });

  // Priority filter dropdown
  const prioritySelect = document.createElement("select");
  prioritySelect.className = "border rounded px-3 py-2";
  prioritySelect.innerHTML = `
    <option value="">All Priorities</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
    <option value="Normal">Normal</option>
  `;

  filterContainer.appendChild(courseSelect);
  filterContainer.appendChild(prioritySelect);
  container.appendChild(filterContainer);

  // --- 🔹 Function to render tasks ---
  function renderTasks(tasksToShow) {
    // Clear old content except the filter
    container.querySelectorAll(".card, h2").forEach((el) => el.remove());

    // Group by date
    const tasksByDate = {};
    tasksToShow.forEach((task) => {
      const date = task.date || "No due date";
      if (!tasksByDate[date]) tasksByDate[date] = [];
      tasksByDate[date].push(task);
    });

    Object.keys(tasksByDate).forEach((date) => {
      const dateHeader = document.createElement("h2");
    dateHeader.className = "text-lg font-semibold mt-4";
      dateHeader.textContent = `Due: ${date}`;
      container.appendChild(dateHeader);

      tasksByDate[date].forEach((task) => {
        const card = document.createElement("div");
        card.className = "card-task";
        if (task.name.length > 11 || task.course.length > 11) {
          if (task.name.length > 11) {
            task.name = task.name.substring(0, 8) + "...";
          }
          if (task.course.length > 11) {
            task.course = task.course.substring(0, 8) + "...";
          }
        }
        card.innerHTML = `
          <p style="grid-column: 1;">${task.course || "No course"}</p>
          <p style="grid-column: 2;">${task.name || "Untitled task"}</p>
          <p style="grid-column: 3;">${task.priority || "Normal"}</p>

          <!-- Checkbox icons -->
          <svg class="task-checkbox" id="unchecked" viewBox="0 0 100 100" style="grid-column: 4;"
               xmlns="http://www.w3.org/2000/svg" width="30" height="30">
            <circle cx="50" cy="50" r="35" fill="none" stroke="#A40606" stroke-width="3"/>
          </svg>
          <svg class="task-checkbox hidden" id="checked" viewBox="0 0 100 100"
               xmlns="http://www.w3.org/2000/svg" width="30" height="30">
            <circle cx="50" cy="50" r="35" fill="#A40606" stroke="#A40606" stroke-width="3"/>
            <path d="M 30 50 L 43 63 L 70 33"
                  stroke="#FFFFFF" 
                  stroke-width="5" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  fill="none"/>
          </svg>
        `;

        // Redirect to detail
        card.addEventListener("click", (e) => {
          if (e.target.closest(".task-checkbox")) return;
          localStorage.setItem("selectedTaskId", task.id);
          window.location.href = "taskDetail.html";
        });

        // Handle checkbox -> mark completed
        const unchecked = card.querySelector("#unchecked");
        const checked = card.querySelector("#checked");

        unchecked.addEventListener("click", async (e) => {
          e.stopPropagation();
          unchecked.classList.add("hidden");
          checked.classList.remove("hidden");

          try {
            const completedRef = collection(db, `users/${user.uid}/completedTasks`);
            await setDoc(doc(completedRef, task.id), {
              ...task,
              completedAt: new Date().toISOString(),
            });

            await deleteDoc(doc(db, `users/${user.uid}/tasks/${task.id}`));
            console.log(`Task "${task.name}" moved to completed tasks.`);

            // Smooth redirect
            setTimeout(() => {
              window.location.href = "viewTasks.html";
            }, 300);
          } catch (error) {
            console.error("Error moving task:", error);
          }
        });

        container.appendChild(card);
      });
    });
    // Show message if no tasks match filters
    if (tasksToShow.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No tasks match the selected filters.";
      empty.className = "text-gray-500 text-center mt-4";
      container.appendChild(empty);
    }
  }
  renderTasks(allTasks);

  // FIlter application function
  function applyFilters() {
    const selectedCourse = courseSelect.value;
    const selectedPriority = prioritySelect.value;

    const filtered = allTasks.filter((task) => {
      const matchCourse = !selectedCourse || task.course === selectedCourse;
      const matchPriority = !selectedPriority || task.priority === selectedPriority;
      return matchCourse && matchPriority;
    });

    renderTasks(filtered);
  }

  // Apply filters when dropdowns change
  courseSelect.addEventListener("change", applyFilters);
  prioritySelect.addEventListener("change", applyFilters);
});
