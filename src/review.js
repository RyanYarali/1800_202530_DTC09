import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { createLoadingSpinner } from "./loader.js"; // import loader function
const loader = createLoadingSpinner(); //set variable to loader


document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const ratingSelect = document.getElementById("rating");
  const feedbackInput = document.getElementById("feedback");
  const reviewForm = document.getElementById("reviewForm");

  let currentUserId = null;

  const feedbackModal = document.getElementById("feedbackModal");
  const feedbackModalTitle = document.getElementById("feedbackModalTitle");
  const feedbackModalMessage = document.getElementById("feedbackModalMessage");
  const feedbackModalButtons = document.getElementById("feedbackModalButtons");

  // -------------------------------
  // Show modal function
  // -------------------------------
  function showModal(title, message, buttons) {
    feedbackModalTitle.textContent = title;
    feedbackModalMessage.textContent = message;

    // Clear previous buttons
    feedbackModalButtons.innerHTML = "";

    // Responsive button container: vertical on small, horizontal on large
    feedbackModalButtons.className =
      "flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center w-full";

    buttons.forEach((btn) => {
      const button = document.createElement("button");
      button.textContent = btn.text;

      // Button color classes
      let bgClass = "";
      switch (btn.color?.toLowerCase()) {
        case "red":
          bgClass = "bg-red-600";
          break;
        case "teal":
          bgClass = "bg-teal";
          break; // <-- use custom color
        case "coral":
          bgClass = "bg-coral";
          break;
        default:
          bgClass = "bg-gray-600";
      }
      // Responsive button: smaller on mobile
      button.className = `
        py-1 px-3 sm:py-2 sm:px-4 rounded-lg text-white ${bgClass} 
        transition text-sm sm:text-base w-full sm:w-auto text-center
      `;

      button.addEventListener("click", () => {
        hideModal();
        if (btn.onClick) btn.onClick();
      });

      feedbackModalButtons.appendChild(button);
    });

    // Show modal
    feedbackModal.classList.remove(
      "hidden",
      "opacity-0",
      "pointer-events-none"
    );
    feedbackModal.classList.add("flex", "items-center", "justify-center");
  }

  function hideModal() {
    feedbackModal.classList.add("hidden", "opacity-0", "pointer-events-none");
    feedbackModal.classList.remove("flex", "items-center", "justify-center");
  }

  // Close modal on backdrop click
  feedbackModal.addEventListener("click", (e) => {
    if (e.target === feedbackModal) hideModal();
  });

  // -------------------------------
  // Auto-fill user info
  // -------------------------------
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    currentUserId = user.uid;

    try {
      loader.show()
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        nameInput.value = data.name || "";
        emailInput.value = data.email || user.email || "";
      }
    } catch (error) {
      console.error("Error loading user info:", error);
    }
    finally{loader.hide()}
  });

  // -------------------------------
  // Submit review
  // -------------------------------
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const feedback = feedbackInput.value.trim();
    const rating = ratingSelect.value;

    if (!feedback) {
      showModal("Oops!", "Please enter your review or suggestion!", [
        { text: "Close", color: "red" },
      ]);
      return;
    }

    try {
      await addDoc(collection(db, "reviews"), {
        userId: currentUserId,
        name: nameInput.value,
        email: emailInput.value,
        rating,
        feedback,
        createdAt: serverTimestamp(),
      });

      feedbackInput.value = "";

      showModal("Thank You!", "Your review has been submitted successfully!", [
        { text: "Stay", color: "teal" },
        {
          text: "Leave",
          color: "coral",
          onClick: () => (window.location.href = "main.html"),
        },
      ]);
    } catch (err) {
      console.error("Error submitting review:", err);
      showModal("Error", "Failed to submit review. Please try again.", [
        { text: "Close", color: "red" },
      ]);
    }
  });
});
