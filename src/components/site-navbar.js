// Import specific functions from the Firebase Auth SDK
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "/src/firebaseConfig.js";
import { logoutUser } from "/src/authentication.js";

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
    this.renderAuthControls();
  }

  renderNavbar() {
    this.innerHTML = `
            <!-- Navbar: single source of truth -->
            <link rel="stylesheet" href="./src/styles/style.css" />
            <nav class="navbar">
                <div class="navbar-brand">
                    <a href="#">TaskMate</a>
                </div>

                <div class="navbar-links">
                    <a href="#">Home</a>
                    <a href="#">Review</a>
                    <a href="#">FAQ</a>
                    <a href="#">About Us</a>
                </div>

            </nav>
        `;
  }
  renderAuthControls() {
    const authControls = this.querySelector("#authControls");
// 
    // Initialize with invisible placeholder to maintain layout space
    authControls.innerHTML = `<div class="btn btn-outline-light" style="visibility: hidden; min-width: 80px;">Log out</div>`;
// 
    onAuthStateChanged(auth, (user) => {
      let updatedAuthControl;
      if (user) {
        updatedAuthControl = `<button class="btn btn-outline-light" id="signOutBtn" type="button" style="min-width: 80px;">Log out</button>`;
        authControls.innerHTML = updatedAuthControl;
        const signOutBtn = authControls.querySelector("#signOutBtn");
        signOutBtn?.addEventListener("click", logoutUser);
      } else {
        updatedAuthControl = `<a class="btn btn-outline-light" id="loginBtn" href="/login.html" style="min-width: 80px;">Log in</a>`;
        authControls.innerHTML = updatedAuthControl;
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
