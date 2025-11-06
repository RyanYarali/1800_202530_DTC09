// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';

// document.addEventListener('DOMContentLoaded', sayHello);
import { doc, onSnapshot, getDoc } from "firebase/firestore";

import { onAuthReady } from "./authentication.js";
function showDashboard() {
  const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"

  onAuthReady(async (user) => {
    if (!user) {
      // If no user is signed in → redirect back to login page.
      location.href = "index.html";
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const name = userDoc.exists()
      ? userDoc.data().name
      : user.displayName || user.email;

    // Update the welcome message with their name/email.
    if (nameElement) {
      nameElement.textContent = `${name}!`;
    }
  });
}

showDashboard();
