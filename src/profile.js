import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createLoadingSpinner } from "./loader.js"; // import loader function
const loader = createLoadingSpinner(); //set variable to loader


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
  // Populate user info and theme on page load
  // -------------------------------------------------------------
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    try {
      loader.show()
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
        // Apply theme from Firestore if present
        if (userData.theme === "dark" || userData.theme === "light") {
          document.documentElement.setAttribute("data-theme", userData.theme);
        } else {
          document.documentElement.setAttribute("data-theme", "light");
        }
      } else {
        console.log("User document does not exist!");
        document.documentElement.setAttribute("data-theme", "light");
      }
      applyThemeLabel();
    } catch (err) {
      console.error("Error fetching user data:", err);
      document.documentElement.setAttribute("data-theme", "light");
      applyThemeLabel();
    }
    finally{
      loader.hide()
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
      loader.show()
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
    finally{loader.hide()}
  });

  // -------------------------------------------------------------
  // Logout
  // -------------------------------------------------------------
  logoutButton.addEventListener("click", async () => {
    try {
      loader.show()
      await signOut(auth);
      window.location.href = "index.html";
    } catch (err) {
      console.error("Logout failed:", err);
    } finally{
      loader.hide()
    }
  });

  // Dark/Light Theme Toggle
  const applyThemeLabel = () => {
    try {
      const theme =
        document.documentElement.getAttribute("data-theme") || "light";
      if (themeToggle) {
        // Update toggle switch state
        const isDark = theme === "dark";
        themeToggle.setAttribute("aria-checked", isDark ? "true" : "false");

        // Toggle background color
        if (isDark) {
          themeToggle.classList.add("bg-[#A40606]");
          themeToggle.classList.remove("bg-gray-300");
        } else {
          themeToggle.classList.remove("bg-[#A40606]");
          themeToggle.classList.add("bg-gray-300");
        }

        // Toggle slider position
        const slider = themeToggle.querySelector(".toggle-slider");
        if (slider) {
          if (isDark) {
            slider.classList.add("translate-x-7");
          } else {
            slider.classList.remove("translate-x-7");
          }
        }
      }
    } catch (_) {}
  };

  // Save theme to Firestore for the current user
  const setTheme = async (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    sessionStorage.setItem("theme", theme);
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { theme });
      }
    } catch (err) {
      console.error("Error saving theme to Firestore:", err);
    }
    applyThemeLabel();
  };

  // Initialize button label
  applyThemeLabel();
  if (themeToggle) {
    themeToggle.addEventListener("click", async () => {
      const current =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light";
      await setTheme(current === "dark" ? "light" : "dark");
    });
  }
});
