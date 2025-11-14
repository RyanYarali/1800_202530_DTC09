import { onAuthReady } from "../authentication.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

onAuthReady(async (user) => {
  if (!user) {
    console.log("No user logged in");
    return;
  }

  const container = document.getElementById("groups-container");
  container.innerHTML = "";

  const tasksCollectionRef = collection(db, "groups");
  const querySnapshot = await getDocs(tasksCollectionRef);
  const querySnapshotDocs = querySnapshot.docs
  querySnapshotDocs.forEach((doc) => {
    const task = doc.data();
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="col">
        <h2>${task.name || "No group name"}</h2>
        <div class="card">
          <p>${task.course || "No course"}</p>
          <p>${task.name || "Untitled task"}</p>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      localStorage.setItem("selectedGroupID", doc.id);
      window.location.href = "groupTasks.html";
    });

    container.appendChild(card);
  });
});
