import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js"; // Make sure db is imported if used later

// Check if a user is already logged in
onAuthReady((user) => {
  if (user) {
    // If logged in → skip landing page and go to main dashboard
    window.location.href = "main.html";
  }
});
