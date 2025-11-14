import { onAuthReady } from "../authentication.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

onAuthReady(async (user) => {
    if (!user) {
        console.log("No user logged in");
        return;
    }

    const container = document.getElementById("events-container");
    container.innerHTML = "";

    const GroupID = localStorage.getItem("selectedGroupID");
    const tasksCollectionRef = collection(db, `groups/${GroupID}/tasks`);
    const querySnapshot = await getDocs(tasksCollectionRef);

    const querySnapshotDocs = querySnapshot.docs

    querySnapshotDocs.sort((a, b) => {
        const dateA = new Date(a.data().date)
        const dateB = new Date(b.data().date)
        return dateA - dateB
    });

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
});
