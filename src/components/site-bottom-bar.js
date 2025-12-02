import styleUrl from "../styles/style.css?url";
import darkUrl from "../styles/dark.css?url";
class SiteBottomBar extends HTMLElement {
	connectedCallback() {
		// normalize current file name (basename)
		const currentPath = window.location.pathname || "/";
		const currentBase = currentPath.split("/").pop() || "index.html";

		const getBasename = (p) => {
			try {
				const u = new URL(p, window.location.href);
				return (u.pathname.split("/").pop() || "index.html");
			} catch {
				return (p.split("/").pop() || "index.html");
			}
		};

		const isActive = (page) => {
			const pageBase = getBasename(page);
			if (currentBase === pageBase) return true;
			if ((currentBase === "" || currentBase === "index.html" || currentPath === "/") && pageBase === "main.html") return true;
			if (currentBase.replace(/\.html$/, "") === pageBase.replace(/\.html$/, "")) return true;
			return false;
		};

    // Check if current page is any group-related page
    const isGroupPage =
      currentPage === "groups.html" ||
      currentPage === "groupCreate.html" ||
      currentPage === "groupAddTask.html" ||
      currentPage === "groupDetail.html" ||
      currentPage === "groupTasks.html";

    this.innerHTML = `
			<link rel="stylesheet" href="./src/styles/style.css" />
			<style>
				.nav-item {
					position: relative;
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 4px;
					padding: 12px 16px;
					text-decoration: none;
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					border-radius: 16px;
				}
				
				.nav-item:not(.active):hover {
					background-color: rgba(164, 6, 6, 0.08);
					transform: translateY(-2px);
				}
				
				.nav-item.active {
					background: linear-gradient(135deg, rgba(164, 6, 6, 0.15) 0%, rgba(35, 0, 7, 0.1) 100%);
					box-shadow: 0 4px 12px rgba(164, 6, 6, 0.2);
				}
				
				.nav-item.active::before {
					content: '';
					position: absolute;
					top: -2px;
					left: 50%;
					transform: translateX(-50%);
					width: 40px;
					height: 3px;
					background: linear-gradient(90deg, #A40606 0%, #8B0000 100%);
					border-radius: 0 0 3px 3px;
				}
				
				.nav-icon {
					transition: all 0.3s ease;
				}
				
				.nav-item:not(.active):hover .nav-icon {
					transform: scale(1.1);
				}
				
				.nav-item.active .nav-icon {
					filter: drop-shadow(0 2px 4px rgba(164, 6, 6, 0.3));
				}
				
				.nav-label {
					font-size: 0.75rem;
					font-weight: 500;
					transition: all 0.3s ease;
					letter-spacing: 0.02em;
				}
				
				.nav-item.active .nav-label {
					font-weight: 700;
					font-size: 0.8rem;
				}
			</style>
			
			<footer
				class="fixed bottom-0 left-0 w-full mx-auto"
				style="
					background: linear-gradient(180deg, rgba(245, 240, 246, 0.92) 0%, rgba(255, 255, 255, 0.95) 100%);
					border-radius: 24px 24px 0 0;
					margin: 0;
					width: 100%;
					box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12), 0 -2px 8px rgba(164, 6, 6, 0.08);
					backdrop-filter: blur(20px);
					-webkit-backdrop-filter: blur(20px);
					border-top: 1px solid rgba(164, 6, 6, 0.1);
				"
			>
				<div class="flex justify-around items-center px-4 py-2" style="max-width: 600px; margin: 0 auto;">

                    <a href="main.html" class="nav-item ${isActive("main.html") ? "active" : ""}" 
                        style="color: ${isActive("main.html") ? "#A40606" : "#230007"};">
                        <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" 
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0h-4a2 2 0 01-2-2v-6H9v6a2 2 0 01-2 2H3"/>
                        </svg>
                        <span class="nav-label">Home</span>
                    </a>

					<a href="groups.html" class="nav-item ${isGroupPage ? "active" : ""}"
						style="color: ${isGroupPage ? "#A40606" : "#230007"};">
						<svg class="nav-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" 
							xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
							<path d="M13 20V18C13 15.2386 10.7614 13 8 13C5.23858 13 3 15.2386 3 18V20H13ZM13 20H21V19C21 16.0545 18.7614 14 16 14C14.5867 14 13.3103 14.6255 12.4009 15.6311M11 7C11 8.65685 9.65685 10 8 10C6.34315 10 5 8.65685 5 7C5 5.34315 6.34315 4 8 4C9.65685 4 11 5.34315 11 7ZM18 9C18 10.1046 17.1046 11 16 11C14.8954 11 14 10.1046 14 9C14 7.89543 14.8954 7 16 7C17.1046 7 18 7.89543 18 9Z" 
								stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						<span class="nav-label">Groups</span>
					</a>

                    <a href="addTask.html" class="nav-item ${isActive("addTask.html") ? "active" : ""
			}"
                        style="color: ${isActive("addTask.html") ? "#A40606" : "#230007"};">
                        <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" 
                            fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
                            <path d="M12 11v6" />
                            <path d="M9 14h6" />
                        </svg>
                        <span class="nav-label">Add</span>
                    </a>

                    <a href="viewTasks.html" class="nav-item ${isActive("viewTasks.html") ? "active" : ""
			}"
                        style="color: ${isActive("viewTasks.html") ? "#A40606" : "#230007"};">
                        <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" 
                            fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
                            <circle cx="12" cy="14" r="3" />
                            <path d="M12 12v2l1.5 1.5" />
                        </svg>
                        <span class="nav-label">To do</span>
                    </a>

                    <a href="completedTask.html" class="nav-item ${isActive("completedTask.html") ? "active" : ""
			}"
                        style="color: ${isActive("completedTask.html") ? "#A40606" : "#230007"};">
                        <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" 
                            fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
                            <path d="M9 14l2 2l4 -4" />
                        </svg>
                        <span class="nav-label">Done</span>
                    </a>

                </div>
            </footer>
        `;
	}
}

customElements.define("site-bottom-bar", SiteBottomBar);
