import { auth, db } from "/src/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addGroupBtn");
    const overlay = document.getElementById("groupOverlay");
    const closeBtn = document.getElementById("overlayClose");
    const cancelBtn = document.getElementById("cancelJoin");
    const form = document.getElementById("joinGroupForm");
    const input = document.getElementById("groupIdInput");
    const msg = document.getElementById("joinMessage");

    function openOverlay() {
        msg.textContent = "";
        input.value = "";
        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");
        input.focus();
    }
    function closeOverlay() {
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
    }

    // Open when button clicked
    addBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        openOverlay();
    });

    // Close when clicking outside panel
    overlay?.addEventListener("click", (e) => {
        if (e.target === overlay) closeOverlay();
    });

    // Close buttons
    closeBtn?.addEventListener("click", () => closeOverlay());
    cancelBtn?.addEventListener("click", () => closeOverlay());

    // Prevent clicks inside panel from closing
    const panel = overlay?.querySelector(".overlay__panel");
    panel?.addEventListener("click", (e) => e.stopPropagation());

    // Submit: add the group ID to the user's groups collection
    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const groupId = input.value.trim();
        if (!groupId) {
            msg.textContent = "Please enter a Group ID.";
            return;
        }

        // Ensure user is logged in
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = "login.html";
                return;
            }

            try {
                msg.textContent = "Joining group...";
                // Use groupId as the document ID under users/{uid}/groups/{groupId}
                const groupRef = doc(db, "users", user.uid, "groups", groupId);
                await setDoc(groupRef, {
                    groupId,
                    joinedAt: serverTimestamp()
                });
                msg.textContent = "Successfully joined group.";
                setTimeout(() => {
                    closeOverlay();
                    // refresh the groups list to show the new group
                    window.location.reload();
                }, 800);
            } catch (err) {
                console.error(err);
                msg.textContent = "Failed to join group. Try again.";
            }
        }, { onlyOnce: true });
    });
});
// ...existing code...