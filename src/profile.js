import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const userIdInput = document.getElementById("userIdInput"); // User ID field
  const schoolInput = document.getElementById("schoolInput");
  const emailInput = document.getElementById("emailInput");
  const cityInput = document.getElementById("cityInput");
  const editButton = document.getElementById("editButton");
  const saveButton = document.getElementById("saveButton");
  const logoutButton = document.getElementById("logout");
  const themeToggle = document.getElementById("themeToggle");

  // -------------------------------------------------------------
  // Populate user info on page load
  // -------------------------------------------------------------
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    try {
      // Show UID in the User ID field
      userIdInput.value = user.uid;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        nameInput.value = userData.name || "";
        schoolInput.value = userData.school || "";
        cityInput.value = userData.city || "";
        emailInput.value = userData.email || user.email || "";
      } else {
        console.log("User document does not exist!");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  });

  // -------------------------------------------------------------
  // Enable editing Name, School, City (Email and User ID stay read-only)
  // -------------------------------------------------------------
  editButton.addEventListener("click", () => {
    nameInput.disabled = false;
    schoolInput.disabled = false;
    cityInput.disabled = false;

    nameInput.focus();
  });

  // -------------------------------------------------------------
  // Save editable fields to Firestore
  // -------------------------------------------------------------
  saveButton.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("No user logged in");
      return;
    }

    try {
      const name = nameInput.value;
      const school = schoolInput.value;
      const city = cityInput.value;

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name, school, city });

      alert("Profile updated!");

      // Disable editing after save
      nameInput.disabled = true;
      schoolInput.disabled = true;
      cityInput.disabled = true;
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to save profile");
    }
  });

  // -------------------------------------------------------------
  // Logout
  // -------------------------------------------------------------
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  });

// Dark/Light Theme Toggle
  const applyThemeLabel = () => {
    try {
      const theme =
        document.documentElement.getAttribute("data-theme") || "light";
      if (themeToggle)
        themeToggle.textContent = theme === "dark" ? "Disable" : "Enable";
    } catch (_) {}
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}
    applyThemeLabel();
  };

  // Initialize button label
  applyThemeLabel();
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }
});
