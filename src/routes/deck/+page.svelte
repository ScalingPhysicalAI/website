<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let currentSlide = 0;
	const SLIDE_SELECTOR = '.slide:not(.slide-hidden)';

	function renderSlides() {
		const nodes = Array.from(document.querySelectorAll<HTMLElement>(SLIDE_SELECTOR));
		nodes.forEach((slide, i) => {
			const offset = i - currentSlide;
			slide.classList.toggle('active', offset === 0);
			slide.style.transform = `translateX(${offset * 100}%)`;
			slide.style.opacity = offset === 0 ? '1' : '0';

			if (offset === 0) {
				slide.querySelectorAll<HTMLElement>('.anim-in').forEach((node) => {
					node.style.animation = 'none';
					void node.offsetWidth;
					node.style.animation = '';
				});
			}
		});

		document.querySelectorAll<HTMLElement>('.nav-dot').forEach((dot, i) => {
			dot.classList.toggle('active', i === currentSlide);
		});

		const el = document.getElementById('slideCounter');
		if (el)
			el.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(nodes.length).padStart(2, '0')}`;
	}

	function goToSlide(index: number) {
		const nodes = Array.from(document.querySelectorAll<HTMLElement>(SLIDE_SELECTOR));
		currentSlide = (index + nodes.length) % nodes.length;
		renderSlides();
	}

	function nextSlide() {
		goToSlide(currentSlide + 1);
	}
	function prevSlide() {
		goToSlide(currentSlide - 1);
	}

	function handleKey(event: KeyboardEvent) {
		const t = event.target as HTMLElement | null;
		if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
		if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
			event.preventDefault();
			nextSlide();
		} else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
			event.preventDefault();
			prevSlide();
		} else if (event.key === 'Home') {
			event.preventDefault();
			goToSlide(0);
		} else if (event.key === 'End') {
			event.preventDefault();
			goToSlide(document.querySelectorAll(SLIDE_SELECTOR).length - 1);
		}
	}

	function printDeck() {
		window.print();
	}

	onMount(() => {
		const dotsContainer = document.getElementById('navDots');
		const nodes = Array.from(document.querySelectorAll<HTMLElement>(SLIDE_SELECTOR));
		if (!dotsContainer || nodes.length === 0) return;

		document.body.style.overflow = 'hidden';
		dotsContainer.replaceChildren();
		nodes.forEach((_, i) => {
			const dot = document.createElement('div');
			dot.className = 'nav-dot';
			dot.addEventListener('click', (e) => {
				e.stopPropagation();
				goToSlide(i);
			});
			dotsContainer.appendChild(dot);
		});

		// Advancing on any click made it impossible to select text or follow a
		// link on a slide; navigation is via the arrows, dots and keyboard.
		document.addEventListener('keydown', handleKey);
		goToSlide(0);

		return () => {
			document.removeEventListener('keydown', handleKey);
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:head>
	<title>StarForge Robotics - Pitch Deck</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="deck-viewport">
	<main class="deck-stage" id="deckStage">
		<!-- NAV -->
		<nav>
			<a href={resolve('/')} class="nav-logo-link" aria-label="Starforge home">
				<img src="/assets/logo-wordmark-dark.png" alt="StarForge" class="nav-logo-img" />
			</a>
			<div class="nav-center">
				<div class="nav-slides" id="navDots"></div>
				<span class="slide-counter" id="slideCounter">01 / 14</span>
			</div>
			<button class="print-btn" onclick={printDeck}>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					><polyline points="6 9 6 2 18 2 18 9" /><path
						d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
					/><rect x="6" y="14" width="12" height="8" /></svg
				>
				Export PDF
			</button>
		</nav>

		<!-- SLIDE 1 - COVER -->
		<section class="slide" id="s1">
			<div class="cover-bg"></div>
			<div class="cover-grid"></div>
			<div class="cover-content">
				<div class="cover-tag anim-in anim-d1">Seed Round · 2026</div>
				<h1 class="cover-title anim-in anim-d2">
					Building the<br />
					<span class="hl-gold">Compute Layer</span><br />
					for Physical<br />
					Intelligence
				</h1>
				<p class="cover-sub anim-in anim-d3">
					Our robot <a
						class="cover-sub-link"
						href="https://starforgerobotics.com/buildo"
						target="_blank"
						rel="noopener noreferrer"
						>Buildo<span class="cover-sub-arrow" aria-hidden="true">↗</span></a
					>. The most capable and affordable robot made possible by our compute layer.
				</p>
				<div class="cover-divider anim-in anim-d3"></div>
				<a href="https://starforgerobotics.com" class="cover-url anim-in anim-d3"
					>starforgerobotics.com</a
				>
			</div>
		</section>

		<!-- SLIDE 2 - HUMANOID BOOTLOADER -->
		<section class="slide" id="s2">
			<div class="section-label anim-in anim-d1">The Opportunity</div>
			<h2 class="headline anim-in anim-d2">
				General purpose humanoid robots are<br />
				the <span class="hl-gold">bootloader for Physical Intelligence</span>
			</h2>
			<div class="bullet-list anim-in anim-d3">
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						Human environment keeps advancing. <strong
							>Physical intelligence needs continuous data collection.</strong
						>
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						<strong>Unitree G1</strong> - an open, community-driven approach built around an accessible
						robotics platform that enables researchers and developers to experiment, build, and contribute.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						<strong>Figure AI</strong> - a vertically integrated approach where proprietary hardware,
						software, data collection, and AI development are handled by dedicated in-house teams.
					</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 3 - UNITREE -->
		<section class="slide" id="s3">
			<div class="section-label anim-in anim-d1">Market Signal</div>
			<h2 class="headline anim-in anim-d2">
				Unitree: a great candidate for<br />
				<span class="hl-gold">general purpose humanoid</span>
			</h2>
			<div class="bullet-list anim-in anim-d3">
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						<strong>70–80%</strong> of Unitree's humanoid sales were for research use cases; 20–30% for
						education and entertainment.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						Unitree opened near <strong>$66B</strong> - 5× its last VC round of $1.9B and ~7× its IPO
						price.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						Market Signal: developers and researchers are actively choosing open humanoid platforms
						at <strong>massive scale.</strong>
					</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 4 - UNITREE LACKED BRAIN -->
		<section class="slide" id="s4">
			<div class="section-label anim-in anim-d1">The Problem</div>
			<h2 class="headline anim-in anim-d2">
				Unitree solved the <span class="hl-gold">body</span> -<br />
				the brain remains unsolved
			</h2>
			<div class="bullet-list anim-in anim-d3">
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						We saw Unitree robots dancing, running - but <strong>no real-world deployment</strong> at
						scale.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						Unitree argues they have solved the body and the <strong
							>brain is the next constraint.</strong
						><a
							class="citation"
							href="https://x.com/RoboStrategy/status/2087561451468681234"
							target="_blank"
							rel="noopener noreferrer">[1]</a
						>
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						A robot foundation model approaching human-level generality could exceed <strong
							>500 billion parameters</strong
						> - making it extremely difficult and expensive to run on general purpose robots.
					</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 5 - BREAKTHROUGH -->
		<section class="slide" id="s5">
			<div class="section-label anim-in anim-d1">Our Solution</div>
			<h2 class="headline anim-in anim-d2">
				Our breakthrough allows running<br />
				<span class="hl-gold">any sized model</span> on humanoid robots
			</h2>
			<div class="solution-layout anim-in anim-d3">
				<div class="solution-card">
					<p>
						This <strong>fundamentally changes the architecture and economics</strong> of intelligent
						humanoid robots - models of any size can now run efficiently inside the robot.
					</p>
				</div>
				<figure class="solution-figure">
					<img
						src="/assets/architecture.jpg"
						alt="Architecture diagram: a large base VLA and action head on the server route token projections to very small VLA models running on the robot, with continuous observation embeddings flowing from the robot back to the server."
					/>
				</figure>
			</div>
		</section>

		<!-- SLIDE 6 - BUILDO KIT -->
		<section class="slide" id="s6">
			<div class="section-label anim-in anim-d1">Product</div>
			<h2 class="headline anim-in anim-d2">
				Buildo robot and<br />
				<span class="hl-gold">training kit</span> - v1
			</h2>
			<div class="why-grid why-grid--two anim-in anim-d3">
				<div class="why-card">
					<div class="why-card-line"></div>
					<div class="why-card-num">01</div>
					<p class="why-card-body">
						<strong>Buildo</strong> robot is designed for majority of
						<strong>real-world use cases</strong>.
					</p>
				</div>
				<div class="why-card">
					<div class="why-card-line"></div>
					<div class="why-card-num">02</div>
					<p class="why-card-body">
						Training kit enables <strong>teleoperation and real-world data collection</strong>.
					</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 7 - INFRA -->
		<section class="slide" id="s7">
			<div class="section-label anim-in anim-d1">Platform</div>
			<h2 class="headline anim-in anim-d2">
				StarForge<br />
				<span class="hl-gold">Physical Intelligence Infra</span>
			</h2>
			<div class="solution-cards anim-in anim-d3">
				<div class="solution-card">
					<div class="solution-card-num">Humanoid Platform</div>
					<p>
						Enable researchers and developers to <strong>collect real-world data</strong> and build better
						physical AI models on an open, accessible platform.
					</p>
				</div>
				<div class="solution-card">
					<div class="solution-card-num">Compute Layer</div>
					<p>
						<strong>Train and host robot models</strong> for inference - from any size model to production
						deployment.
					</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 8 - DEVELOPER REWARDS -->
		<section class="slide" id="s8">
			<div class="section-label anim-in anim-d1">Ecosystem</div>
			<h2 class="headline anim-in anim-d2">
				Developers earn rewards for<br />
				<span class="hl-gold">building and hosting models</span>
			</h2>
			<div class="bullet-list anim-in anim-d3">
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						Developers who build and contribute robot AI models to the platform <strong
							>earn direct rewards</strong
						> - aligning incentives with model quality.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						Hosting models on the StarForge compute layer generates ongoing revenue for
						contributors, creating a <strong>self-reinforcing developer flywheel.</strong>
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						Strong developer base already in place - <strong>community-driven growth</strong> mirrors
						the open-source software model applied to physical AI.
					</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 9 - REVENUE -->
		<section class="slide" id="s9">
			<div class="section-label anim-in anim-d1">Business Model</div>
			<h2 class="headline anim-in anim-d2">
				Revenue <span class="hl-gold">projection</span>
			</h2>
			<div class="solution-cards anim-in anim-d3">
				<div class="solution-card">
					<div class="solution-card-num">Hardware Sales Revenue</div>
					<p>
						Humanoid robot and training kit sales to researchers, developers, and enterprises
						deploying physical AI in the real world. <strong
							>Recurring hardware upgrade cycles</strong
						> as models improve.
					</p>
				</div>
				<div class="solution-card">
					<div class="solution-card-num">Compute Revenue</div>
					<p>
						Training and inference hosting on the StarForge compute layer. Compute demand for
						physical intelligence will increase <strong>100× with increasing adoption</strong> - far exceeding
						digital AI today.
					</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 10 - COMPETITION -->
		<section class="slide" id="s10">
			<div class="section-label anim-in anim-d1">Competitive Position</div>
			<h2 class="headline anim-in anim-d2">
				How we stand <span class="hl-gold">better</span> than competition
			</h2>
			<div class="comp-list anim-in anim-d3">
				<div class="comp-item">
					<div class="comp-num">01</div>
					<div class="comp-content">
						<div class="comp-title">1X Neo</div>
						<p class="comp-body">
							<strong>Costly and open platform</strong> - high barrier to entry for most researchers and
							developers, limiting community growth and data collection scale.
						</p>
					</div>
				</div>
				<div class="comp-item">
					<div class="comp-num">02</div>
					<div class="comp-content">
						<div class="comp-title">Figure O3</div>
						<p class="comp-body">
							<strong>Costly and closed platform</strong> - vertically integrated approach restricts the
							developer ecosystem needed to rapidly advance physical AI models.
						</p>
					</div>
				</div>
				<div class="comp-item">
					<div class="comp-num">03</div>
					<div class="comp-content">
						<div class="comp-title">Nori and similar</div>
						<p class="comp-body">
							<strong>Cheap but incapable</strong> - insufficient hardware performance to run meaningful
							physical AI models or collect high-quality training data.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 11 - WHY STARFORGE -->
		<section class="slide" id="s11">
			<div class="section-label anim-in anim-d1">Competitive Advantage</div>
			<h2 class="headline anim-in anim-d2">Why <span class="hl-gold">StarForge</span></h2>
			<div class="why-grid anim-in anim-d3">
				<div class="why-card">
					<div class="why-card-line"></div>
					<div class="why-card-num">01</div>
					<p class="why-card-body">
						We made a breakthrough that allows robots to run <strong>any sized model</strong> - making
						real-world deployments possible for the first time.
					</p>
				</div>
				<div class="why-card">
					<div class="why-card-line"></div>
					<div class="why-card-num">02</div>
					<p class="why-card-body">
						<strong>Strong developer base already.</strong> Community-driven data collection at scale
						that closed competitors cannot replicate.
					</p>
				</div>
				<div class="why-card">
					<div class="why-card-line"></div>
					<div class="why-card-num">03</div>
					<p class="why-card-body">
						Built the entire humanoid robot hardware and supply chain - especially the <strong
							>actuator and dextrous hand</strong
						>, the critical-path components.
					</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 12 - TEAM -->
		<section class="slide" id="s12">
			<div class="section-label anim-in anim-d1">Founding Team</div>
			<h2 class="headline anim-in anim-d2">Built by <span class="hl-gold">builders</span></h2>
			<div class="team-grid anim-in anim-d3">
				<div class="team-card">
					<div class="team-initials">VS</div>
					<div class="team-name">Vipul Saini</div>
					<div class="team-role">Founder · Chief Engineer</div>
					<div class="team-bio">
						Founded Cypherock, scaled to $600M AUM. Previously Nymble Labs.
					</div>
				</div>
				<div class="team-card">
					<div class="team-initials">RJ</div>
					<div class="team-name">Rakshit Jain</div>
					<div class="team-role">Senior Robotics Engineer</div>
					<div class="team-bio">Deep robotics and mechatronics background. IIIT Delhi.</div>
				</div>
				<div class="team-card">
					<div class="team-initials">SS</div>
					<div class="team-name">Sarthak</div>
					<div class="team-role">Senior Software Engineer</div>
					<div class="team-bio">Core systems and software engineering across robotics stacks.</div>
				</div>
				<div class="team-card">
					<div class="team-initials">CE</div>
					<div class="team-name">Celia</div>
					<div class="team-role">Aerospace Engineer</div>
					<div class="team-bio">
						Aerospace engineering background. Structural and propulsion systems.
					</div>
				</div>
				<div class="team-card">
					<div class="team-initials">AN</div>
					<div class="team-name">Anay</div>
					<div class="team-role">Electrical Engineer</div>
					<div class="team-bio">Electrical systems design and embedded hardware integration.</div>
				</div>
				<div class="team-card">
					<div class="team-initials">CS</div>
					<div class="team-name">Chirag</div>
					<div class="team-role">Software Engineer</div>
					<div class="team-bio">AI and systems engineering across multiple product cycles.</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 13 - TRACTION -->
		<section class="slide" id="s13">
			<div class="section-label anim-in anim-d1">Traction</div>
			<h2 class="headline anim-in anim-d2">
				Businesses and developers<br />
				<span class="hl-gold">love our robots</span>
			</h2>
			<div class="comp-list anim-in anim-d3">
				<div class="comp-item">
					<div class="comp-num">01</div>
					<div class="comp-content">
						<div class="comp-title">Mazout Electric</div>
						<p class="comp-body">
							Building <strong>lithium ion batteries using robots</strong> - deploying StarForge humanoids
							for real industrial manufacturing tasks.
						</p>
					</div>
				</div>
				<div class="comp-item">
					<div class="comp-num">02</div>
					<div class="comp-content">
						<div class="comp-title">Aryan Madhav Verma</div>
						<p class="comp-body">
							Building <strong>industrial warehouses</strong> on the StarForge platform - validating demand
							for open, capable humanoid robots beyond research.
						</p>
					</div>
				</div>
				<div class="comp-item">
					<div class="comp-num">03</div>
					<div class="comp-content">
						<div class="comp-title">Developer Ecosystem</div>
						<p class="comp-body">
							<strong>50+ developers</strong> are already using our compute platform - early signal of
							the community-driven flywheel taking hold.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 14 - VISION / ASK -->
		<section class="slide" id="s14">
			<div class="section-label anim-in anim-d1">The Vision</div>
			<h2 class="headline anim-in anim-d2">
				Robotics <span class="hl-gold">AGI</span> in the next<br />
				6 – 12 months
			</h2>
			<div class="vision-body anim-in anim-d3">
				<p class="vision-text">
					Our thesis: ecosystem-driven acceleration could bring the industry substantially closer to <strong
						>general purpose robotics AGI within the next year</strong
					> - creating transformational productivity gains across multiple industries.
				</p>
				<p class="vision-text">
					We intend to produce specialised robots for space stations, lunar and Mars base operations
					(multi-trillion-dollar space industry).
				</p>
				<p class="vision-text">
					<strong>Compute demand for physical intelligence will increase 100× with adoption</strong
					>, far exceeding digital AI today.<a
						class="citation"
						href="https://www.prnewswire.com/news-releases/the-space-economy-is-heading-for-1-8-trillion-the-bottleneck-nobody-talks-about-is-getting-there-302830042.html"
						target="_blank"
						rel="noopener noreferrer">[2]</a
					>
				</p>
			</div>
			<div class="ask-row anim-in anim-d3">
				<div class="ask-amount">Seed</div>
				<div class="ask-details">
					<div class="ask-item">
						<div class="ask-val">Hardware</div>
						<div class="ask-label">Revenue Stream 1</div>
					</div>
					<div class="ask-divider"></div>
					<div class="ask-item">
						<div class="ask-val">Compute</div>
						<div class="ask-label">Revenue Stream 2</div>
					</div>
					<div class="ask-divider"></div>
					<div class="ask-item">
						<div class="ask-val">Physical AI</div>
						<div class="ask-label">Category</div>
					</div>
				</div>
			</div>
			<div class="ask-footer anim-in anim-d3">
				<a href="https://starforgerobotics.com">starforgerobotics.com</a> &nbsp;·&nbsp;
				<a href="mailto:vipulsaini594@gmail.com">vipulsaini594@gmail.com</a>
			</div>
		</section>
	</main>

	<!-- ARROW CONTROLS -->
	<button class="arrow arrow-prev" onclick={prevSlide} aria-label="Previous slide">
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg
		>
	</button>
	<button class="arrow arrow-next" onclick={nextSlide} aria-label="Next slide">
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg
		>
	</button>
</div>

<style>
	:global(html),
	:global(body) {
		height: 100%;
	}

	:global(body) {
		background: #f1efeb;
		color: #141210;
		font-family: 'Barlow', sans-serif;
		cursor: default;
	}

	/* ── VIEWPORT ── */
	.deck-viewport {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: #f1efeb;
	}

	.deck-stage {
		position: relative;
		width: min(100vw, calc(100vh * (16 / 9)));
		height: min(100vh, calc(100vw * (9 / 16)));
		aspect-ratio: 16 / 9;
		background: #ffffff;
		overflow: hidden;
		box-shadow:
			0 0 0 1px rgba(20, 18, 16, 0.06),
			0 40px 120px rgba(20, 18, 16, 0.16);
	}

	/* ── NAV ── */
	nav {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 48px;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(20, 18, 16, 0.06);
	}

	.nav-logo-link {
		display: inline-flex;
		align-items: center;
		line-height: 0;
		text-decoration: none;
		transition: opacity 0.2s ease;
	}

	.nav-logo-link:hover {
		opacity: 0.75;
	}

	.nav-logo-img {
		display: block;
		height: 32px;
		width: auto;
	}

	.nav-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.nav-slides {
		display: flex;
		gap: 6px;
	}

	:global(.nav-dot) {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #e6e1d8;
		cursor: pointer;
		transition:
			background 0.3s,
			transform 0.2s;
	}
	:global(.nav-dot:hover) {
		background: #5f584e;
		transform: scale(1.2);
	}
	:global(.nav-dot.active) {
		background: #7a5e0f;
		transform: scale(1.3);
	}

	.slide-counter {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		color: #5f584e;
		letter-spacing: 0.15em;
	}

	.print-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 7px 14px;
		background: transparent;
		border: 2px solid rgba(20, 18, 16, 0.15);
		color: #7a5e0f;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.2s;
	}
	.print-btn:hover {
		background: rgba(20, 18, 16, 0.04);
		border-color: rgba(20, 18, 16, 0.82);
	}

	/* ── ARROWS ── */
	.arrow {
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		z-index: 200;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.6);
		border: 2px solid rgba(20, 18, 16, 0.075);
		color: #5f584e;
		cursor: pointer;
		transition: all 0.2s;
	}
	.arrow:hover {
		color: #7a5e0f;
		border-color: rgba(20, 18, 16, 0.82);
		background: rgba(255, 255, 255, 0.9);
	}
	.arrow-prev {
		left: 8px;
	}
	.arrow-next {
		right: 8px;
	}

	/* ── SLIDES ── */
	.slide {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: clamp(56px, 14vh, 96px) clamp(36px, 5vw, 72px) clamp(24px, 6vh, 56px);
		opacity: 0;
		transform: translateX(100%);
		pointer-events: none;
		transition:
			opacity 0.5s ease,
			transform 0.5s ease;
		background: #ffffff;
	}

	:global(.slide.active) {
		opacity: 1;
		transform: translateX(0);
		pointer-events: auto;
	}

	:global(.slide.active .anim-in) {
		opacity: 0;
		transform: translateY(18px);
		animation: riseIn 0.6s ease forwards;
	}
	:global(.slide.active .anim-d1) {
		animation-delay: 0.06s;
	}
	:global(.slide.active .anim-d2) {
		animation-delay: 0.14s;
	}
	:global(.slide.active .anim-d3) {
		animation-delay: 0.24s;
	}

	@keyframes riseIn {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ── TYPOGRAPHY ── */
	.section-label {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.6vmin, 11px);
		letter-spacing: 0.3em;
		color: #7a5e0f;
		text-transform: uppercase;
		margin-bottom: clamp(8px, 2.5vh, 18px);
	}

	.headline {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(22px, 5vmin, 56px);
		font-weight: 500;
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: #141210;
		max-width: 820px;
	}

	.hl-gold {
		color: #7a5e0f;
	}

	/* ── SLIDE 1 COVER ── */
	#s1 {
		justify-content: center;
		background: #f1efeb;
	}

	/* Cover slide only. The network art is 16:9 and the stage is 16:9, so `cover`
	   maps it edge to edge with nothing cropped. The white ramp holds the left
	   half solid - the cover title runs to roughly 49% of the stage - then
	   releases across the right. It settles at 0.18 rather than 0 so the graphic
	   stays a backdrop and never competes with the headline. */
	.cover-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(
				90deg,
				rgb(255, 255, 255) 0%,
				rgb(255, 255, 255) 29%,
				rgba(255, 255, 255, 0.82) 38%,
				rgba(255, 255, 255, 0.5) 50%,
				rgba(255, 255, 255, 0.24) 64%,
				rgba(255, 255, 255, 0.18) 76%,
				rgba(255, 255, 255, 0.18) 100%
			),
			radial-gradient(ellipse 70% 60% at 80% 50%, rgba(20, 18, 16, 0.03) 0%, transparent 70%),
			radial-gradient(ellipse 40% 70% at 10% 80%, rgba(20, 18, 16, 0.015) 0%, transparent 60%),
			url('/assets/network-graph.webp');
		background-size: auto, auto, auto, cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.cover-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(20, 18, 16, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(20, 18, 16, 0.03) 1px, transparent 1px);
		background-size: 56px 56px;
		mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%);
	}

	.cover-content {
		position: relative;
		z-index: 2;
	}

	.cover-tag {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(9px, 1.8vmin, 12px);
		letter-spacing: 0.3em;
		color: #7a5e0f;
		text-transform: uppercase;
		margin-bottom: clamp(12px, 3vh, 24px);
	}

	.cover-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(26px, 6.5vmin, 72px);
		font-weight: 500;
		line-height: 0.95;
		letter-spacing: 0.04em;
		color: #141210;
		max-width: 600px;
	}

	.cover-divider {
		width: 40px;
		height: 1px;
		background: #7a5e0f;
		margin: clamp(12px, 3vh, 28px) 0 clamp(8px, 2vh, 16px);
	}

	.cover-url {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(10px, 1.8vmin, 13px);
		color: #5f584e;
		letter-spacing: 0.08em;
	}

	/* Sits under the title, deliberately well below it in scale so the headline
	   still carries the slide. Sized in vmin like the title so it tracks the
	   stage rather than the browser window. */
	.cover-sub {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(11px, 1.9vmin, 19px);
		font-weight: 500;
		line-height: 1.55;
		color: rgba(20, 18, 16, 0.82);
		max-width: 46ch;
		margin-top: clamp(14px, 2.4vmin, 26px);
	}

	.cover-sub-link {
		color: var(--deck-accent, #7a5e0f);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
		white-space: nowrap;
		transition: color 0.2s ease;
	}

	.cover-sub-link:hover {
		color: #5c460b;
	}

	/* inline-block stops the link's underline being drawn through the arrow. */
	.cover-sub-arrow {
		display: inline-block;
		margin-left: 3px;
		transition: transform 0.2s ease;
	}

	.cover-sub-link:hover .cover-sub-arrow {
		transform: translate(2px, -2px);
	}

	/* ── BULLET LIST ── */
	.bullet-list {
		margin-top: clamp(16px, 5vh, 36px);
		display: flex;
		flex-direction: column;
		gap: 3px;
		max-width: 820px;
	}

	.bullet-item {
		display: flex;
		gap: 16px;
		padding: clamp(10px, 2.5vh, 18px) clamp(14px, 2.5vw, 24px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-left: 2px solid rgba(20, 18, 16, 0.2);
	}

	.bullet-icon {
		color: #7a5e0f;
		font-size: 12px;
		padding-top: 2px;
		flex-shrink: 0;
	}

	.bullet-item p {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.2vmin, 15px);
		font-weight: 500;
		color: #3a3630;
		line-height: 1.6;
	}

	.bullet-item p strong {
		color: #141210;
		font-weight: 500;
	}

	/* ── SOLUTION CARDS ── */
	/* Still used by slides 7 and 9. */
	.solution-cards {
		margin-top: clamp(16px, 5vh, 40px);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3px;
		max-width: 900px;
	}

	/* Slide 5 carries a much taller element than the rest of the deck. It sits
	   lower than the trimmed 68px I first tried but still higher than the 96px
	   the other slides use, and the bottom padding is trimmed hard so moving the
	   title down costs the diagram no height. */
	#s5 {
		padding-top: clamp(48px, 10.6vh, 82px);
		padding-bottom: clamp(8px, 1.6vh, 14px);
	}

	#s5 .section-label {
		margin-bottom: clamp(6px, 1.4vh, 10px);
	}

	/* Slide 5: text left, diagram right. Columns are minmax(0, ...) so the image
	   can shrink inside its track instead of forcing the grid wider than the
	   slide. */
	.solution-layout {
		margin-top: clamp(4px, 1vh, 12px);
		display: grid;
		grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
		gap: clamp(16px, 3vw, 44px);
		/* Centred against the diagram rather than pinned to the top, so the card
		   sits at the diagram's midpoint instead of crowding the headline. */
		align-items: center;
		width: 100%;
	}

	.solution-figure {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		margin: 0;
	}

	.solution-figure img {
		display: block;
		width: 100%;
		height: auto;
		/* The diagram is bound by slide height, not column width, so this cap is
		   what actually sizes it. The stage is min(100vh, 56.25vw), so the cap
		   has to track both: on a window wider than 16:9 the stage is shorter
		   than the viewport and a plain vh value overflows it. */
		max-height: clamp(200px, min(71vh, 40vw), 700px);
		object-fit: contain;
		background: #ffffff;
	}

	.solution-card {
		padding: clamp(16px, 4vh, 36px) clamp(16px, 3vw, 32px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.06);
		position: relative;
		overflow: hidden;
	}

	.solution-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, #7a5e0f, transparent);
	}

	.solution-card-num {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.6vmin, 10px);
		color: #7a5e0f;
		letter-spacing: 0.2em;
		margin-bottom: clamp(8px, 2vh, 16px);
	}

	.solution-card p {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.2vmin, 15px);
		font-weight: 500;
		color: #3a3630;
		line-height: 1.7;
	}

	.solution-card p strong {
		color: #141210;
		font-weight: 500;
	}

	/* Slide 5 only. With the number removed the card has room, and it sits
	   beside a large diagram, so the copy is set larger than the shared
	   .solution-card used on slides 7 and 9. */
	.solution-layout .solution-card p {
		font-size: clamp(13px, 2.4vmin, 17px);
		line-height: 1.65;
	}

	/* ── WHY US ── */
	.why-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3px;
		margin-top: clamp(16px, 5vh, 48px);
	}

	/* Slide 6 carries two cards; without this they would sit in two of three
	   tracks and leave a dead column. Slide 11 still uses the three-up grid. */
	.why-grid--two {
		grid-template-columns: repeat(2, 1fr);
	}

	.why-card {
		padding: clamp(16px, 4vh, 40px) clamp(14px, 2.5vw, 28px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		position: relative;
	}

	.why-card-line {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, #7a5e0f, transparent);
	}

	.why-card-num {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(28px, 7vmin, 52px);
		color: rgba(20, 18, 16, 0.82);
		line-height: 1;
		letter-spacing: 0.02em;
		margin-bottom: clamp(8px, 2vh, 16px);
	}

	.why-card-body {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.2vmin, 15px);
		font-weight: 500;
		color: #3a3630;
		line-height: 1.65;
	}

	.why-card-body strong {
		color: #141210;
		font-weight: 500;
	}

	/* ── TEAM ── */
	.team-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 3px;
		margin-top: clamp(12px, 4vh, 40px);
	}

	.team-card {
		padding: clamp(14px, 3.5vh, 28px) clamp(10px, 2vw, 20px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-top: 2px solid rgba(20, 18, 16, 0.15);
	}

	.team-initials {
		width: clamp(28px, 5vmin, 40px);
		height: clamp(28px, 5vmin, 40px);
		border: 2px solid rgba(20, 18, 16, 0.175);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(9px, 1.8vmin, 12px);
		color: #7a5e0f;
		margin-bottom: clamp(8px, 2vh, 16px);
	}

	.team-name {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(11px, 2vmin, 15px);
		font-weight: 600;
		color: #141210;
	}

	.team-role {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(7px, 1.2vmin, 9px);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #7a5e0f;
		margin-top: 3px;
		margin-bottom: clamp(6px, 1.5vh, 12px);
	}

	.team-bio {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(9px, 1.6vmin, 12px);
		font-weight: 500;
		color: #5f584e;
		line-height: 1.6;
	}

	/* ── COMPETITION ── */
	.comp-list {
		margin-top: clamp(16px, 5vh, 48px);
		display: flex;
		flex-direction: column;
		gap: 3px;
		max-width: 820px;
	}

	.comp-item {
		display: flex;
		gap: clamp(16px, 3vw, 32px);
		padding: clamp(16px, 4vh, 32px) clamp(18px, 3.5vw, 36px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-left: 3px solid #7a5e0f;
	}

	.comp-num {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(24px, 5.5vmin, 40px);
		color: rgba(20, 18, 16, 0.82);
		line-height: 1;
		flex-shrink: 0;
	}

	.comp-title {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(13px, 2.4vmin, 17px);
		font-weight: 600;
		color: #141210;
		margin-bottom: clamp(5px, 1.2vh, 8px);
	}

	.comp-body {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.2vmin, 15px);
		font-weight: 500;
		color: #3a3630;
		line-height: 1.65;
	}

	.comp-body strong {
		color: #141210;
		font-weight: 500;
	}

	/* ── VISION / ASK ── */
	#s14 {
		background:
			radial-gradient(ellipse 60% 80% at 90% 50%, rgba(20, 18, 16, 0.025) 0%, transparent 60%),
			#f1efeb;
	}

	.vision-body {
		margin-top: clamp(10px, 3vh, 28px);
		display: flex;
		flex-direction: column;
		gap: clamp(6px, 1.5vh, 12px);
		max-width: 680px;
	}

	/* Source markers. Ported from the teammate's deck; recoloured from the old
	   #b89c72 gold to the current accent, which that revision predates. */
	.citation {
		color: var(--deck-accent, #7a5e0f);
		text-decoration: none;
		font-size: 0.7em;
		vertical-align: super;
		line-height: 0;
		margin-left: 1px;
		cursor: pointer;
	}

	.citation:hover {
		text-decoration: underline;
	}

	/* Utility for parking a slide without breaking the counter, which now reads
	   the live slide count rather than a hardcoded total. Declared :global so
	   Svelte does not strip it as unused before anything applies the class. */
	:global(.slide-hidden) {
		display: none !important;
	}

	.vision-text {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.2vmin, 15px);
		font-weight: 500;
		color: #3a3630;
		line-height: 1.65;
	}

	.vision-text strong {
		color: #141210;
		font-weight: 500;
	}

	.ask-row {
		display: flex;
		align-items: center;
		gap: clamp(24px, 5vw, 48px);
		margin-top: clamp(12px, 4vh, 40px);
	}

	.ask-amount {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(40px, 12vmin, 96px);
		letter-spacing: 0.04em;
		color: #7a5e0f;
		line-height: 0.9;
		flex-shrink: 0;
	}

	.ask-details {
		display: flex;
		align-items: center;
		gap: 32px;
	}

	.ask-item {
		text-align: center;
	}

	.ask-val {
		font-family: 'Space Mono', monospace;
		font-size: clamp(13px, 2.8vmin, 18px);
		font-weight: 700;
		color: #141210;
		letter-spacing: 0.06em;
	}

	.ask-label {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		color: #5f584e;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		margin-top: 4px;
	}

	.ask-divider {
		width: 1px;
		height: 36px;
		background: rgba(20, 18, 16, 0.1);
	}

	.ask-footer {
		margin-top: 32px;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(10px, 1.8vmin, 12px);
		color: #5f584e;
		letter-spacing: 0.08em;
	}

	/* ── LINKS ── */
	a.cover-url {
		display: inline-block;
		text-decoration: none;
		color: #5f584e;
	}
	a.cover-url:hover {
		color: #7a5e0f;
	}

	.ask-footer a {
		color: #7a5e0f;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: rgba(20, 18, 16, 0.82);
	}
	.ask-footer a:hover {
		text-decoration-color: #7a5e0f;
	}

	/* ── PRINT / PDF EXPORT ── */
	@media print {
		@page {
			size: 1280px 720px;
			margin: 0;
		}

		:global(body) {
			background: #f1efeb !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		.deck-viewport {
			display: block;
			width: auto;
			height: auto;
			overflow: visible;
		}

		.arrow {
			display: none !important;
		}
		.print-btn {
			display: none !important;
		}
		nav {
			display: none !important;
		}

		.deck-stage {
			position: static;
			width: 100%;
			height: auto;
			aspect-ratio: unset;
			box-shadow: none;
			overflow: visible;
		}

		.slide {
			position: static !important;
			opacity: 1 !important;
			transform: none !important;
			pointer-events: auto !important;
			page-break-after: always;
			break-after: page;
			width: 100%;
			min-height: 100vh;
			padding: 80px 72px;
			display: flex !important;
		}
	}
</style>
