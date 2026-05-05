<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<footer>
	<div class="footer-inner">
		<div class="footer-brand">
			<div class="footer-logo">STARFORGE</div>
			<p class="footer-tagline">Physical automation to transform industry and move the world.</p>
			<a href="mailto:vipulsaini594@gmail.com" class="footer-contact-link">vipul@starforgerobotics.com</a>
		</div>

		<nav class="footer-nav" aria-label="Footer">
			<div class="footer-col">
				<span class="footer-col-label">Company</span>
				<ul>
					<li><a href={resolve('/#mission')}>Mission</a></li>
					<li><a href={resolve('/vision')}>Vision</a></li>
					<li><a href={resolve('/#milestone')}>Milestones</a></li>
					<li><a href={resolve('/#built')}>Technology</a></li>
				</ul>
			</div>

			<div class="footer-col">
				<span class="footer-col-label">Products</span>
				<ul>
					<li><a href={resolve('/robo-dev-kit')}>Robo Dev Kit</a></li>
					<li><a href={resolve('/#why-now')}>Why Now</a></li>
					<li><a href={resolve('/#launch-window')}>Launch Window</a></li>
				</ul>
			</div>

			<div class="footer-col">
				<span class="footer-col-label">Developers</span>
				<ul>
					<li><a href={resolve('/developer')}>Dev Portal</a></li>
					<li><a href={resolve('/developer/register')}>Register</a></li>
					<li><a href={resolve('/developer/login')}>Sign In</a></li>
					<li><a href={resolve('/developer/dashboard')}>Dashboard</a></li>
				</ul>
			</div>

			<div class="footer-col">
				<span class="footer-col-label">Connect</span>
				<ul>
					<li><a href="mailto:vipulsaini594@gmail.com,vipul@starforgerobotics.com">Join Us</a></li>
					<li><a href="mailto:vipulsaini594@gmail.com">Contact</a></li>
					<li><a href={resolve('/deck')} aria-label="Investor deck">Investor Deck</a></li>
				</ul>
			</div>
		</nav>
	</div>

	<div class="footer-bottom">
		<span class="footer-copy">© 2026 Starforge Robotics, Inc. All rights reserved.</span>
		<span class="footer-build-tag">BUILT FOR MARS</span>
	</div>
</footer>
