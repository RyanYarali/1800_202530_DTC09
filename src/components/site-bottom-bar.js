class SiteBottomBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <!-- Footer: single source of truth -->
            <link rel="stylesheet" href="./src/styles/style.css" />
			<footer
			class="fixed bottom-0 left-0 w-full bg-cream border-t border-gray-300"
			>
			<div class="flex justify-between items-center px-6 py-3 relative">
				<a
				href="viewTasks.html"
				class="flex flex-col items-center text-teal hover:text-coral"
				>
				
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#84A59D"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
					d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8"
					/>
					<path d="M14 19l2 2l4 -4" />
					<path d="M9 8h4" />
					<path d="M9 12h2" />
				</svg>

				<span class="text-xs">Task</span>
				</a>

				<a
				href="addTask.html"
				class="absolute left-1/2 transform -translate-x-1/2 -translate-y-6 bg-coral text-white rounded-full p-4 shadow-lg hover:bg-mustard transition"
				>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-8H4"
					/>
				</svg>
				</a>

				<a
				href="main.html"
				class="flex flex-col items-center text-teal hover:text-coral"
				>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 mb-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 
						0h-4a2 2 0 01-2-2v-6H9v6a2 2 0 01-2 2H3"
					/>
				</svg>
				<span class="text-xs">Home</span>
				</a>
			</div>
			</footer>
        `;
    }
}

customElements.define('site-bottom-bar', SiteBottomBar);