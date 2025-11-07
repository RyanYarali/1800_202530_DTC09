// taskEdit.js
import { auth, db } from "/src/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editForm");
  const deleteBtn = document.getElementById("delete");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.error("No user logged in");
      window.location.href = "login.html";
      return;
    }

    const GroupID = localStorage.getItem("selectedGroupID");
    if (!GroupID) {
      console.error("No group selected");
      window.location.href = "groups.html";
      return;
    }
    
    
    const groupRef = doc(db, "groups", GroupID);
    
    
    // Load task into form
    try {
      const snap = await getDoc(groupRef);
      if (snap.exists()) {
        const group = snap.data();
        document.getElementById("name").value = group.name || "";
        document.getElementById("course").value = group.course || "";
        document.getElementById("description").value = group.description || "";
        if (user.uid != group.uid) {
          form.className += ", disabled";
          console.log(user.uid)
        }
      } else {
        console.error("group not found");
        window.location.href = "groups.html";
      }
    } catch (err) {
      console.error("Error loading group:", err);
    }
    

    // Save changes
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await updateDoc(groupRef, {
          name: document.getElementById("name").value,
          course: document.getElementById("course").value,
          description: document.getElementById("description").value,
        });
        window.location.href = "groups.html";
      } catch (err) {
        console.error("Error updating group:", err);
        alert("Failed to update group");
      }
    });

    // Delete task
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this group?")) return;
      try {
        await deleteDoc(groupRef);
        window.location.href = "groups.html";
      } catch (err) {
        console.error("Error deleting group:", err);
        alert("Failed to delete group");
      }
    });
  });
});
