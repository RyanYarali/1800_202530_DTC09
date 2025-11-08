import { signOut } from "firebase/auth";
import { auth } from "/src/firebaseConfig.js";

let test = document.getElementById("logout")

test.addEventListener("click", async () => {
  signOut(auth)
  window.location.href = "index.html";
});
