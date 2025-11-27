// ...existing code...
import { onAuthReady } from "../authentication.js";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

onAuthReady(async (user) => {
  if (!user) {
    console.log("No user logged in");
    return;
  }

  const container = document.getElementById("groups-container");
  container.innerHTML = "";

  const userGroupsRef = collection(db, "users", user.uid, "groups");
  const userGroupsSnapshot = await getDocs(userGroupsRef);

  for (const userGroupDoc of userGroupsSnapshot.docs) {
    const groupId = userGroupDoc.id;
    let groupData = null;

    const groupDocRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupDocRef);

    if (groupSnap.exists()) {
      groupData = groupSnap.data();
    } else {
      const infoColRef = collection(db, "groups", groupId, "info");
      const infoSnap = await getDocs(infoColRef);
      if (!infoSnap.empty) {
        groupData = infoSnap.docs[0].data();
      }
    }

    groupData = groupData || userGroupDoc.data() || {};

    const name = groupData.name || "No group name";
    const course = groupData.course || "No course";
    const description = groupData.description || "No description";

    // Create group card
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="col">
        <h2>${name}</h2>
        <div class="card">
          <p>${course}</p>
          <p>${description}</p>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      localStorage.setItem("selectedGroupID", groupId);
      window.location.href = "groupTasks.html";
    });

    container.appendChild(card);
  }
});