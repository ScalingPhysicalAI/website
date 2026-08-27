<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<footer>
	<div class="footer-inner">
		<div class="footer-brand">
			<div class="footer-logo">STARFORGE</div>
			<p class="footer-tagline">Physical automation to transform industry and move the world.</p>
			<a href="mailto:vipulsaini594@gmail.com" class="footer-contact-link"
				>vipul@starforgerobotics.com</a
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
						<a href="mailto:vipulsaini594@gmail.com,vipul@starforgerobotics.com">Contact Us</a>
					</li>
				</ul>
			</div>
		</nav>
	</div>

	<div class="footer-bottom">
		<span class="footer-copy">© 2026 Starforge Robotics, Inc. All rights reserved.</span>
		<span class="footer-build-tag">BUILT FOR MARS</span>
	</div>
</footer>
