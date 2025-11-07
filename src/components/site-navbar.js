// Import specific functions from the Firebase Auth SDK
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "/src/firebaseConfig.js";

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.renderNavbar();
    // Defer setup so the rest of the page can set data attributes
    requestAnimationFrame(() => this.setupNavbar());
  }

  renderNavbar() {
    this.innerHTML = `
      <!-- Navbar: single source of truth -->
      <link rel="stylesheet" href="./src/styles/style.css" />
      <nav class="navbar">
        <div class="nav-left" style="display:flex; align-items:center; gap:1rem;">
          <button class="navbar-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
          <div class="navbar-brand" style="z-index: 10;">
            <a href="#" style="display: flex; align-items: center; text-decoration: none;">
              <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" style="width: 180px; height: 40px; display: block;">
                <defs>
                  <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#A40606;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#F9A03F;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle cx="40" cy="40" r="28" fill="url(#iconGrad)"/>
                <path d="M 28 40 L 36 48 L 52 30" 
                      stroke="#F5F0F6" 
                      stroke-width="4" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      fill="none"/>
                <text x="85" y="52" 
                      font-family="'Maven Pro', Arial, sans-serif" 
                      font-size="36" 
                      font-weight="700" 
                      fill="#F5F0F6" 
                      letter-spacing="0.5">TaskMate</text>
              </svg>
            </a>
          </div>
        </div>

        <div class="nav-center" style="position:absolute; left:50%; transform:translateX(-50%);">
          <span class="nav-placeholder" aria-hidden="true"></span>
        </div>

        <div id="authControls" class="auth-controls"></div>

        <div class="navbar-links" id="navbarLinks" style="display:none;">
          <!-- <a href="#">Home</a> -->
          <a href="review.html">Review</a>
          <a href="faq.html">FAQ</a>
          <a href="aboutUs.html">About Us</a>
        </div>
      </nav>
    `;
  }

  setupNavbar() {
    const toggle = this.querySelector(".navbar-toggle");
    const links = this.querySelector("#navbarLinks");
    const brand = this.querySelector(".navbar-brand");
    const placeholder = this.querySelector(".nav-placeholder");
    const authControls = this.querySelector("#authControls");

    // Page-specific center text (page title). Pages can set: <body data-page="All Tasks">
    const pageTitle = document.body?.dataset?.page;
    if (pageTitle) {
      // Task pages: show brand on the left and page title in center
      placeholder.textContent = pageTitle;
      placeholder.style.display = "inline-block";
      if (brand) brand.style.display = "block";
    } else {
      // Home/Index: center the app name and hide the left brand (toggle remains on left)
      placeholder.textContent = "TaskMate";
      placeholder.style.color = "white";
      placeholder.style.fontSize = "30px"; // or whatever size you want
      placeholder.style.fontWeight = "700"; // makes it bold
      placeholder.style.display = "inline-block";
      if (brand) brand.style.display = "none";
    }

    // Show toggle only on pages that opt-in: <body data-show-toggle="true">
    const showToggle = document.body?.dataset?.showToggle === "true";
    if (!showToggle && toggle) toggle.style.display = "none";

    // Wire up toggle to show navbar-links (mobile menu)
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const isOpen = links.classList.toggle("open");
        links.style.display = isOpen ? "flex" : "none";
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    // Custom SVG profile icon
    const profileIconSVG = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width: 40px; height: 40px; display: block;">
        <defs>
          <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#A40606;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#F9A03F;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background circle -->
        <circle cx="50" cy="50" r="48" fill="url(#profileGrad)"/>
        
        <!-- User icon -->
        <!-- Head -->
        <circle cx="50" cy="38" r="14" fill="#F5F0F6"/>
        
        <!-- Body/Shoulders -->
        <path d="M 28 75 Q 28 58 50 58 Q 72 58 72 75 L 72 85 Q 72 90 50 90 Q 28 90 28 85 Z" 
              fill="#F5F0F6"/>
      </svg>
    `;


    // Use Firebase auth to update avatar destination
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // show profile (link to main/profile page)
        authControls.innerHTML = `<a class="profile-link" href="#" title="${
          (user.displayName || user.email) ?? "Profile"
        }">${profileIconSVG}</a>`;
      } else {
        authControls.innerHTML = `<a class="profile-link" href="#" title="Login">${profileIconSVG}</a>`;
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
