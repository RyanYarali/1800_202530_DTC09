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
