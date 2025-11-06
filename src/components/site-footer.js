class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <!-- Footer: single source of truth -->
            <link rel="stylesheet" href="./src/styles/style.css" />
            <footer class="footer">
			<div class="footer-content">
				<div class="footer-brand">
					<h3>TaskMate</h3>
					<p>Helping you stay organized, one task at a time.</p>
				</div>

				<div class="footer-links">
					<a href="#">Privacy Policy</a>
					<a href="#">Terms of Service</a>
					<a href="#">Conatct Us</a>
				</div>

			</div>

			<div class="footer-bottom">
				<p>&copy; 2025 TaskMate. All rights reserved.</p>
			</div>
		</footer>
        `;
    }
}

customElements.define('site-footer', SiteFooter);