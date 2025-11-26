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

  // -------------------------------------------------------------
  // Populate user info on page load
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
      } else {
        console.log("User document does not exist!");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
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

});
