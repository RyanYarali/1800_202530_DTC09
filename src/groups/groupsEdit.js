import { auth, db } from "/src/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editForm");
  const deleteBtn = document.getElementById("delete");
  const copyBtn = document.getElementById("copyGroupId");

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
    // Load group into form
    try {
      const snap = await getDoc(groupRef);
      if (snap.exists()) {
        const group = snap.data();
        document.getElementById("name").value = group.name || "";
        document.getElementById("course").value = group.course || "";
        document.getElementById("description").value = group.description || "";
        document.getElementById("groupID").innerHTML = GroupID || "";
        // Disable form if not group owner
        if (user.uid != group.uid) {
          form.classList.add("disabled");
          console.log(user.uid)
        }
      } else {
        console.error("group not found");
        window.location.href = "groups.html";
      }
    } catch (err) {
      console.error("Error loading group:", err);
    }
    // Copy Group ID button handler
    if (copyBtn) {
      copyBtn.disabled = false;
      copyBtn.style.pointerEvents = "auto";
      copyBtn.addEventListener("click", async () => {
        const text = document.getElementById("groupID").textContent.trim();
        if (!text) return;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            fallbackCopyTextToClipboard(text);
          }
          const prior = copyBtn.textContent;
          copyBtn.textContent = "Copied!";
          setTimeout(() => (copyBtn.textContent = prior), 1400);
        } catch (err) {
          fallbackCopyTextToClipboard(text);
        }
      });
    }

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
  // Fallback copy function
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    } finally {
      document.body.removeChild(textArea);
    }
  }
});
