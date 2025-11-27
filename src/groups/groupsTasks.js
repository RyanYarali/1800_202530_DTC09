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

    // ⭐ ADDED — FILTER BAR UI
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
    // ⭐ END ADDED


    // Reference to the current logged-in user's 'tasks' collection in Firestore
    const tasksCollectionRef = collection(db, `groups/${GroupID}/tasks`);
    const querySnapshot = await getDocs(tasksCollectionRef);

    // ⭐ ADDED — Convert docs to array
    let allTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));
    // ⭐ END


    // Sort tasks by date (ascending)
    const querySnapshotDocs = querySnapshot.docs;

    querySnapshotDocs.sort((a, b) => {
        const dateA = new Date(a.data().date)
        const dateB = new Date(b.data().date)
        return dateA - dateB
    });

    // ⭐ ADDED — Populate course dropdown
    const courseSelect = document.getElementById("filterCourse");
    const uniqueCourses = [...new Set(allTasks.map((t) => t.course).filter(Boolean))];

    uniqueCourses.forEach((course) => {
        const opt = document.createElement("option");
        opt.value = course;
        opt.textContent = course;
        courseSelect.appendChild(opt);
    });
    // ⭐ END


    // ⭐ ADDED — FILTER FUNCTION USING YOUR ORIGINAL RENDER CODE
    function applyFilters() {
        const selectedCourse = courseSelect.value;
        const selectedPriority = document.getElementById("filterPriority").value;

        const filtered = allTasks.filter((task) => {
            const matchCourse = selectedCourse === "all" || task.course === selectedCourse;
            const matchPriority = selectedPriority === "all" || task.priority === selectedPriority;
            return matchCourse && matchPriority;
        });

        // Re-render using your existing card logic
        container.innerHTML = "";

        filtered.forEach((task) => {
            const card = document.createElement("div");
            card.classList.add("card");

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

            card.addEventListener("click", () => {
                localStorage.setItem("selectedTaskId", task.id);
                window.location.href = "taskDetailGroup.html";
            });

            container.appendChild(card);
        });
    }
    // ⭐ END ADDED


    // ⭐ ADDED — Filter triggers
    courseSelect.addEventListener("change", applyFilters);
    document.getElementById("filterPriority").addEventListener("change", applyFilters);
    // ⭐ END




    // Loop through each task and create a visual card for it
    querySnapshotDocs.forEach((doc) => {
        const task = doc.data();
        const card = document.createElement("div");
        card.classList.add("card");

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

        card.addEventListener("click", () => {
            localStorage.setItem("selectedTaskId", doc.id);
            window.location.href = "taskDetailGroup.html";
        });
        
        container.appendChild(card);
    });
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
