class SiteLoader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initLoader();
  }

  render() {
    this.innerHTML = `
      <style>
        .site-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #230007 0%, #3d0a12 50%, #5a0f1e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .site-loader.hidden {
          opacity: 0;
          visibility: hidden;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .loader-logo {
          width: 100px;
          height: 100px;
          position: relative;
          animation: smoothPulse 2s ease-in-out infinite;
        }

        @keyframes smoothPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        .loader-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #a40606 0%, #f9a03f 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 40px rgba(164, 6, 6, 0.4);
        }

        .loader-checkmark {
          width: 45%;
          height: 45%;
          stroke: #F5F0F6;
          stroke-width: 5;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawCheck 2s ease-in-out infinite;
        }

        @keyframes drawCheck {
          0%, 100% {
            stroke-dashoffset: 100;
          }
          40%, 80% {
            stroke-dashoffset: 0;
          }
        }

        .loader-text {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 500;
          font-family: 'Maven Pro', sans-serif;
          letter-spacing: 0.5px;
        }
      </style>

      <div class="site-loader" id="siteLoader">
        <div class="loader-content">
          <div class="loader-logo">
            <div class="loader-circle">
              <svg class="loader-checkmark" viewBox="0 0 100 100">
                <path d="M 20 50 L 40 70 L 80 30" />
              </svg>
            </div>
          </div>

          <div class="loader-text">TaskMate</div>
        </div>
      </div>
    `;
  }

  initLoader() {
    const loader = this.querySelector("#siteLoader");

    // Hide loader when page is fully loaded
    window.addEventListener("load", () => {
      setTimeout(() => {
        if (loader) {
          loader.classList.add("hidden");
          // Remove from DOM after animation
          setTimeout(() => {
            loader.remove();
          }, 500);
        }
      }, 500); // Small delay to ensure smooth transition
    });

    // Fallback: hide loader after max 5 seconds
    setTimeout(() => {
      if (loader && !loader.classList.contains("hidden")) {
        loader.classList.add("hidden");
        setTimeout(() => {
          loader.remove();
        }, 500);
      }
    }, 5000);
  }
}

customElements.define("site-loader", SiteLoader);
