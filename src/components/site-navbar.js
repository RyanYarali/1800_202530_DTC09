// Import specific functions from the Firebase Auth SDK
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "/src/firebaseConfig.js";

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Theme is now set by page logic (profile.js) after Firestore loads
    this.renderNavbar();
    // Defer setup so the rest of the page can set data attributes
    requestAnimationFrame(() => this.setupNavbar());
  }

  renderNavbar() {
    this.innerHTML = `
      <!-- Navbar: single source of truth -->
      <link rel="stylesheet" href="./src/styles/style.css" />
      <link rel="stylesheet" href="./src/styles/dark.css" />
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

        <div id="authControls" class="auth-controls" style="width: 40px; height: 40px;"></div>

        <div class="navbar-links" id="navbarLinks" style="display:none;">
          <!-- <a href="#">Home</a> -->
          <a href="review.html">Review</a>
          <a href="faq.html">FAQ</a>
          <a href="aboutUs.html">About Us</a>
          
          <!-- Dark Mode Toggle in Hamburger Menu -->
          <div class="hamburger-theme-toggle" id="hamburgerThemeToggle" style="display:none;">
            <span class="theme-label">Dark Mode</span>
            <button class="theme-switch" id="themeSwitchBtn" type="button" role="switch" aria-checked="false">
              <span class="theme-slider"></span>
            </button>
          </div>
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

    // Show toggle on pages that opt-in OR on profile page
    const showToggle = document.body?.dataset?.showToggle === "true";
    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    const alwaysShowTogglePages = ["profile.html"];
    // Hide toggle on index.html and login.html
    const hideTogglePages = ["index.html", "login.html", ""];
    const shouldShowToggle =
      (showToggle || alwaysShowTogglePages.includes(currentPage)) &&
      !hideTogglePages.includes(currentPage);

    if (!shouldShowToggle && toggle) toggle.style.display = "none";

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
    <a href="profile.html">
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
    </a>
    `;

    // Start with empty state (no profile icon shown by default)
    authControls.innerHTML = "";

    // Use Firebase auth to update avatar destination
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Show profile icon (link to profile page)
        authControls.innerHTML = `<div class="profile-link" title="${
          (user.displayName || user.email) ?? "Profile"
        }">${profileIconSVG}</div>`;
        // Load theme from Firestore and apply
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          const theme = snap.data()?.theme;
          if (theme === "dark" || theme === "light") {
            document.documentElement.setAttribute("data-theme", theme);
            sessionStorage.setItem("theme", theme);
          }
        } catch (e) {
          // Fail silently if theme cannot be loaded
        }
      } else {
        authControls.innerHTML = "";
        // Default to light when logged out
        document.documentElement.setAttribute("data-theme", "light");
        sessionStorage.setItem("theme", "light");
      }
      updateThemeToggle();
    });

    // Theme toggle in hamburger menu
    const hamburgerThemeToggle = this.querySelector("#hamburgerThemeToggle");
    const themeSwitchBtn = this.querySelector("#themeSwitchBtn");

    // Show theme toggle on pages except index and login
    const hideThemePages = ["index.html", "login.html", ""];
    const shouldShowThemeToggle = !hideThemePages.includes(currentPage);

    if (shouldShowThemeToggle && hamburgerThemeToggle) {
      hamburgerThemeToggle.style.display = "flex";
    }

    // Update theme toggle UI
    const updateThemeToggle = () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      if (themeSwitchBtn) {
        const isDark = currentTheme === "dark";
        themeSwitchBtn.setAttribute("aria-checked", isDark ? "true" : "false");

        if (isDark) {
          themeSwitchBtn.classList.add("active");
        } else {
          themeSwitchBtn.classList.remove("active");
        }
      }
    };

    // Theme toggle click handler
    if (themeSwitchBtn) {
      themeSwitchBtn.addEventListener("click", async () => {
        const currentTheme =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "dark"
            : "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);
        sessionStorage.setItem("theme", newTheme);
        updateThemeToggle();

        // Save to Firestore if user is logged in
        const user = auth.currentUser;
        if (user) {
          try {
            const { updateDoc } = await import("firebase/firestore");
            await updateDoc(doc(db, "users", user.uid), { theme: newTheme });
          } catch (e) {
            console.error("Error saving theme:", e);
          }
        }
      });

      // Initialize on page load
      updateThemeToggle();
    }

    // Theme sync via storage is no longer needed; Firestore now authoritative
  }
}

customElements.define("site-navbar", SiteNavbar);
