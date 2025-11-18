class SiteBottomBar extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<!-- Footer: single source of truth -->
			<link rel="stylesheet" href="./src/styles/style.css" />
			<footer
			class="fixed bottom-0 left-0 w-full border-t border-gray-300 mx-auto"
			style="background-color: rgba(245, 240, 246, 0.95); border-radius: 30px; margin: 1rem; width: calc(100% - 2rem); box-shadow: 0 20px 20px rgba(0, 0, 0, 0.15); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); transition: all 0.3s ease; border: 1px solid rgba(255, 255, 255, 0.3);"
			>
			<div class="flex justify-between items-center px-9 py-3 relative">

				<a
				href="main.html"
				class="flex flex-col items-center    "
				style="color: #230007; "
				onmouseover="this.style.color='#A40606'"
				onmouseout="this.style.color='#230007'"
				>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 mb-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="#230007"
				>
					<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 
						0h-4a2 2 0 01-2-2v-6H9v6a2 2 0 01-2 2H3"
					/>
				</svg>
				<span class="text-sm">Home</span>
				</a>
				<a
				href="viewTasks.html"
				class="flex flex-col items-center    "
				style="color: #230007;"
				onmouseover="this.style.color='#A40606'"	
				onmouseout="this.style.color='#230007'"
				>
				
				<svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#230007"
    stroke-width="1"
    stroke-linecap="round"
    stroke-linejoin="round"
>
    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
    <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
    <circle cx="12" cy="14" r="3" />
    <path d="M12 12v2l1.5 1.5" />
</svg>

				<span class="text-sm">Pending</span>
				</a>
								<a
				href="groups.html"
				class="flex flex-col items-center px-4 py-2 "
				style="color: #230007;"
				onmouseover="this.style.color='#A40606'"
				onmouseout="this.style.color='#230007'"
				>
				<svg 
					width="32"
					height="32" viewBox="0 0 24 24"
					fill="none" xmlns="http://www.w3.org/2000/svg"
					stroke="#230007">
					<g 	
						id="SVGRepo_bgCarrier" 
						stroke-width="0">
					</g>
					<g 
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke="#CCCCCC"
						stroke-width="0.096">
					</g>
					<g
						id="SVGRepo_iconCarrier">
						<path 
							d="M13 20V18C13 15.2386 10.7614 13 8 13C5.23858 13 3 15.2386 3 18V20H13ZM13 20H21V19C21 16.0545 18.7614 14 16 14C14.5867 14 13.3103 14.6255 12.4009 15.6311M11 7C11 8.65685 9.65685 10 8 10C6.34315 10 5 8.65685 5 7C5 5.34315 6.34315 4 8 4C9.65685 4 11 5.34315 11 7ZM18 9C18 10.1046 17.1046 11 16 11C14.8954 11 14 10.1046 14 9C14 7.89543 14.8954 7 16 7C17.1046 7 18 7.89543 18 9Z" 
							stroke="#230007" 
							stroke-width="1.2" 
							stroke-linecap="round" 
							stroke-linejoin="round">
						</path>
					</g>
				</svg>
				<span class="text-sm">Groups</span>
				</a>
								<a
				href="completedTask.html"
				class="flex flex-col items-center    "
				style="color: #230007;"
				onmouseover="this.style.color='#A40606'"
				onmouseout="this.style.color='#230007'"
				>
				
<svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#230007"
    stroke-width="1"
    stroke-linecap="round"
    stroke-linejoin="round"
>
    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
    <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
    <path d="M9 14l2 2l4 -4" />
</svg>

				<span class="text-sm">Completed</span>
				</a>
								<a
				href="addTask.html"
				class="flex flex-col items-center    "
				style="color: #230007;"
				onmouseover="this.style.color='#A40606'"
				onmouseout="this.style.color='#230007'"
				>
				
<svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#230007"
    stroke-width="1"
    stroke-linecap="round"
    stroke-linejoin="round"
>
    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
    <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
    <path d="M12 11v6" />
    <path d="M9 14h6" />
</svg>

				<span class="text-sm">Add</span>
				</a>



			</div>
			</footer>
		`;
	}
}

customElements.define("site-bottom-bar", SiteBottomBar);
