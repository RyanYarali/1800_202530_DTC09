import { onAuthReady } from "../authentication.js";

// Import Firestore functions for reading data
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// Import initialized Firestore database instance
import { db } from "../firebaseConfig.js";

onAuthReady(async (user) => {
    if (!user) {
        console.log("No user logged in");
        return;
    }

    const container = document.getElementById("events-container");
    container.innerHTML = "";

    const GroupID = localStorage.getItem("selectedGroupID");

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


    // Reference to the current group's tasks collection
    const tasksCollectionRef = collection(db, `groups/${GroupID}/tasks`);
    const querySnapshot = await getDocs(tasksCollectionRef);

    // Convert Firestore documents to JS array of task objects
    let allTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));


    // Sort tasks by date (ascending)
    const querySnapshotDocs = querySnapshot.docs;

    querySnapshotDocs.sort((a, b) => {
        const dateA = new Date(a.data().date)
        const dateB = new Date(b.data().date)
        return dateA - dateB
    });

    // Create unique course options for filter
    const courseSelect = document.getElementById("filterCourse");
    const uniqueCourses = [...new Set(allTasks.map((t) => t.course).filter(Boolean))];

    uniqueCourses.forEach((course) => {
        const opt = document.createElement("option");
        opt.value = course;
        opt.textContent = course;
        courseSelect.appendChild(opt);
    });


    // Apply filters and re-render tasks
    function applyFilters() {
        const selectedCourse = courseSelect.value;
        const selectedPriority = document.getElementById("filterPriority").value;

        const filtered = allTasks.filter((task) => {
            const matchCourse = selectedCourse === "all" || task.course === selectedCourse;
            const matchPriority = selectedPriority === "all" || task.priority === selectedPriority;
            return matchCourse && matchPriority;
        });

        container.innerHTML = "";
        // Render filtered tasks
        filtered.forEach((task) => {
            const card = document.createElement("div");
            card.classList.add("card");
            if (task.name.length > 13 || task.course.length > 13) {
                if (task.name.length > 13) {
                    taskCut = task.name.substring(0, 10) + "...";
                }
                if (task.course.length > 13) {
                    courseCut = task.course.substring(0, 10) + "...";
                }
            }

            card.innerHTML = `
          <p style="grid-column: 1;">${courseCut || task.course || "No course"}</p>
          <p style="grid-column: 2;">${taskCut || task.name || "Untitled task"}</p>
          <p style="grid-column: 3;">${task.priority || "Normal"}</p>
          `;

            card.addEventListener("click", () => {
                localStorage.setItem("selectedTaskId", task.id);
                window.location.href = "taskDetailGroup.html";
            });

            container.appendChild(card);
        });
    }


    // Filter change listeners
    courseSelect.addEventListener("change", applyFilters);
    document.getElementById("filterPriority").addEventListener("change", applyFilters);




    // Loop through each task and create a visual card for it
    querySnapshotDocs.forEach((doc) => {
        const task = doc.data();
        var taskCut = null;
        var courseCut = null;
        const card = document.createElement("div");
        card.classList.add("card");
        if (task.name.length > 13 || task.course.length > 13) {
            if (task.name.length > 13) {
                task.name = task.name.substring(0, 10) + "...";
            }
            if (task.course.length > 13) {
                task.course = task.course.substring(0, 10) + "...";
            }
        }
        card.innerHTML = `
    <div class="col">
        <h2>Due: ${task.date || "No due date"}</h2>
        <div class="card">
          <p style="grid-column: 1;">${task.course || "No course"}</p>
          <p style="grid-column: 2;">${task.name || "Untitled task"}</p>
          <p style="grid-column: 3;">${task.priority || "Normal"}</p>
        </div>
    </div>
    `;
    // Redirect to detail
        card.addEventListener("click", () => {
            localStorage.setItem("selectedTaskId", doc.id);
            window.location.href = "taskDetailGroup.html";
        });

        container.appendChild(card);
    });
    // Leave group button handler
    document.getElementById("leaveGroup").addEventListener("click", async () => {
        try {
            await deleteDoc(doc(db, `users/${user.uid}/groups/${GroupID}`));
        } catch (err) {
            console.error("Error leaving group:", err);
        }
        // Redirect to groups overview page
        window.location.href = "groups.html";
    });
});
