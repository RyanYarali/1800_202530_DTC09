import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const ratingSelect = document.getElementById("rating");
  const feedbackInput = document.getElementById("feedback");
  const reviewForm = document.getElementById("reviewForm");

  let currentUserId = null;

  // ------------------------------------------------------------------
  // Auto-fill user info when logged in
  // ------------------------------------------------------------------
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    currentUserId = user.uid;

    try {
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
  });

  // ------------------------------------------------------------------
  // Submit Review
  // ------------------------------------------------------------------
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const feedback = feedbackInput.value.trim();
    const rating = ratingSelect.value;

    if (!feedback) {
      alert("Please enter your review or suggestion!");
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

      alert("Thank you for your review!");
      feedbackInput.value = "";

    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    }
  });
});
