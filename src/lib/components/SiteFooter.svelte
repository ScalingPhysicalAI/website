<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<footer>
	<div class="footer-inner">
		<div class="footer-brand">
			<div class="footer-logo-row">
				<div class="footer-logo">STARFORGE</div>
				<div class="footer-socials">
					<a
						class="footer-social footer-social-li"
						href="https://www.linkedin.com/company/starforgerobotics/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Starforge on LinkedIn"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
							/>
						</svg>
					</a>
					<a
						class="footer-social footer-social-x"
						href="https://x.com/Starforge2030"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Starforge on X"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.727-8.888L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
							/>
						</svg>
					</a>
				</div>
			</div>
			<p class="footer-tagline">Building the intelligence layer for physical AI</p>
			<p class="footer-location">Made with love in New York City - 500 7th Ave</p>
			<a href="mailto:contact@starforgerobotics.com" class="footer-contact-link"
				>contact@starforgerobotics.com</a
			>
		</div>

		<nav class="footer-nav" aria-label="Footer">
			<div class="footer-col">
				<span class="footer-col-label">Product</span>
				<ul>
					<li><a href={resolve('/buildo')}>Buildo</a></li>
				</ul>
			</div>

			<div class="footer-col">
				<span class="footer-col-label">Company</span>
				<ul>
					<li><a href={resolve('/team')}>Team</a></li>
				</ul>
			</div>

			<div class="footer-col">
				<span class="footer-col-label">Developers</span>
				<ul>
					<li><a href="https://portal.starforgerobotics.com">Dev Portal</a></li>
				</ul>
			</div>

			<div class="footer-col">
				<span class="footer-col-label">Connect</span>
				<ul>
					<li>
						<a href="mailto:contact@starforgerobotics.com">Contact Us</a>
					</li>
				</ul>
			</div>
		</nav>
	</div>

	<div class="footer-bottom">
		<span class="footer-copy">© 2026 Starforge Robotics, Inc. All rights reserved.</span>
	</div>
</footer>
