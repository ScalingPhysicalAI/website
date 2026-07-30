<script lang="ts">
	import { onMount } from 'svelte';

	let currentSlide = 0;
	const TOTAL = 9;

	function renderSlides() {
		const nodes = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
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
		if (el) el.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`;
	}

	function goToSlide(index: number) {
		const nodes = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
		currentSlide = (index + nodes.length) % nodes.length;
		renderSlides();
	}

	function nextSlide() { goToSlide(currentSlide + 1); }
	function prevSlide() { goToSlide(currentSlide - 1); }

	function handleKey(event: KeyboardEvent) {
		const t = event.target as HTMLElement | null;
		if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
		if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); nextSlide(); }
		else if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); prevSlide(); }
		else if (event.key === 'Home') { event.preventDefault(); goToSlide(0); }
		else if (event.key === 'End') { event.preventDefault(); goToSlide(TOTAL - 1); }
	}

	function printDeck() {
		window.print();
	}

	onMount(() => {
		const dotsContainer = document.getElementById('navDots');
		const nodes = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
		if (!dotsContainer || nodes.length === 0) return;

		document.body.style.overflow = 'hidden';
		dotsContainer.replaceChildren();
		nodes.forEach((_, i) => {
			const dot = document.createElement('div');
			dot.className = 'nav-dot';
			dot.addEventListener('click', (e) => { e.stopPropagation(); goToSlide(i); });
			dotsContainer.appendChild(dot);
		});

		const stage = document.getElementById('deckStage');
		stage?.addEventListener('click', nextSlide);
		document.addEventListener('keydown', handleKey);
		goToSlide(0);

		return () => {
			stage?.removeEventListener('click', nextSlide);
			document.removeEventListener('keydown', handleKey);
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:head>
	<title>StarForge Robotics — Pitch Deck</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="deck-viewport">
	<main class="deck-stage" id="deckStage">

		<!-- NAV -->
		<nav>
			<img src="/assets/logo.png" alt="StarForge" class="nav-logo-img" />
			<div class="nav-center">
				<div class="nav-slides" id="navDots"></div>
				<span class="slide-counter" id="slideCounter">01 / 09</span>
			</div>
			<button class="print-btn" onclick={printDeck}>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
				Export PDF
			</button>
		</nav>

		<!-- SLIDE 1 — COVER -->
		<section class="slide" id="s1">
			<div class="cover-bg"></div>
			<div class="cover-grid"></div>
			<div class="cover-content">
				<div class="cover-tag anim-in anim-d1">Seed Round · 2026</div>
				<h1 class="cover-title anim-in anim-d2">
					Building<br />
					<span class="hl-gold">Autonomous</span><br />
					Factories for<br />
					Space Infrastructure
				</h1>
				<div class="cover-divider anim-in anim-d3"></div>
				<a href="https://starforgerobotics.com" class="cover-url anim-in anim-d3">starforgerobotics.com</a>
			</div>
			<div class="cover-star anim-in anim-d2">
				<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 10 L108 92 L190 100 L108 108 L100 190 L92 108 L10 100 L92 92 Z" fill="url(#starGrad)" />
					<defs>
						<linearGradient id="starGrad" x1="10" y1="10" x2="190" y2="190" gradientUnits="userSpaceOnUse">
							<stop offset="0%" stop-color="#c4a96b" />
							<stop offset="50%" stop-color="#8a6040" />
							<stop offset="100%" stop-color="#c4a96b" />
						</linearGradient>
					</defs>
				</svg>
			</div>
		</section>

		<!-- SLIDE 2 — MARKET / ORBITAL DATA CENTRES -->
		<section class="slide" id="s2">
			<div class="section-label anim-in anim-d1">The Opportunity</div>
			<h2 class="headline anim-in anim-d2">
				Orbital data centres:<br />
				<span class="hl-gold">The next frontier that needs launch stack</span>
			</h2>
			<div class="bullet-list anim-in anim-d3">
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>Companies that own their launch infrastructure will be the ones that make orbital commute <strong>economically feasible.</strong></p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>The industry needs <strong>10s of 1000s of reusable rockets</strong> — not over the next decade, but effectively right now.</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>This demand cannot be filled with current rocket development costs and timelines. Starship development alone has already consumed <strong>$20 billion.</strong></p>
				</div>
			</div>
		</section>

		<!-- SLIDE 3 — PROBLEM / PHYSICAL AI -->
		<section class="slide" id="s3">
			<div class="section-label anim-in anim-d1">The Problem</div>
			<h2 class="headline anim-in anim-d2">
				Physical AI is the <span class="hl-gold">key to space</span>
			</h2>
			<div class="bullet-list anim-in anim-d3">
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>Today most of the time and money in rocket infrastructure goes into <strong>learning through real world launch attempts.</strong></p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>Every test, every failure and every iteration exists just to make the system <strong>1% better.</strong></p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>A rocket program spans <strong>hundreds of thousands of components,</strong> millions of design decisions, years of test data.</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>Humans are remarkably bad at one thing — <strong>holding vast, interconnected context simultaneously.</strong></p>
				</div>
			</div>
		</section>

		<!-- SLIDE 4 — SOLUTION -->
		<section class="slide" id="s4">
			<div class="section-label anim-in anim-d1">Our Solution</div>
			<h2 class="headline anim-in anim-d2">
				We have built the <span class="hl-gold">Physical AI stack</span><br />
				for Space Infrastructure
			</h2>
			<div class="solution-cards anim-in anim-d3">
				<div class="solution-card">
					<div class="solution-card-num">01</div>
					<p>Our Physical AI stack can ingest every simulation run, every failure mode, every material property, and every environmental variable — and iterate on all of it simultaneously. This <strong>compresses years of development cycles to months.</strong></p>
				</div>
				<div class="solution-card">
					<div class="solution-card-num">02</div>
					<p>The stack controls <strong>all humanoid robots</strong> that can use tools and drive heavy machines — required to build a fully autonomous space infrastructure.</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 5 — WHY US -->
		<section class="slide" id="s5">
			<div class="section-label anim-in anim-d1">Competitive Advantage</div>
			<h2 class="headline anim-in anim-d2">Why <span class="hl-gold">us</span></h2>
			<div class="why-grid anim-in anim-d3">
				<div class="why-card">
					<div class="why-card-line"></div>
					<div class="why-card-num">01</div>
					<p class="why-card-body">Putting AI infrastructure in space requires a <strong>vertically integrated space tech</strong> company.</p>
				</div>
				<div class="why-card">
					<div class="why-card-line"></div>
					<div class="why-card-num">02</div>
					<p class="why-card-body">To train robot AI models we need physical data — <strong>we have solved this at scale.</strong></p>
				</div>
				<div class="why-card">
					<div class="why-card-line"></div>
					<div class="why-card-num">03</div>
					<p class="why-card-body">We have the <strong>world's best AI model</strong> for robot industrial use cases.</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 6 — TRACTION / ROCKET -->
		<section class="slide" id="s6">
			<div class="rocket-photo-bg">
				<img src="/assets/rocket.jpeg" alt="FORGE-1 rocket" class="rocket-photo" />
				<div class="rocket-photo-fade"></div>
			</div>
			<div class="rocket-left anim-in anim-d1">
				<div class="section-label">Proof of Execution</div>
				<h2 class="headline">
					StarForge designed, simulated,<br />and built a<br />
					<span class="hl-gold">9-foot VTVL hopper rocket</span>
				</h2>
				<div class="rocket-stats anim-in anim-d3">
					<div class="rstat">
						<div class="rstat-val">9 ft</div>
						<div class="rstat-label">Vehicle Height</div>
					</div>
					<div class="rstat">
						<div class="rstat-val">VTVL</div>
						<div class="rstat-label">Architecture</div>
					</div>
					<div class="rstat">
						<div class="rstat-val">AI</div>
						<div class="rstat-label">Simulated</div>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 7 — TEAM -->
		<section class="slide" id="s7">
			<div class="section-label anim-in anim-d1">Founding Team</div>
			<h2 class="headline anim-in anim-d2">Built by <span class="hl-gold">operators</span></h2>
			<div class="team-grid anim-in anim-d3">
				<div class="team-card">
					<div class="team-initials">VS</div>
					<div class="team-name">Vipul Saini</div>
					<div class="team-role">CEO · Chief Engineer</div>
					<div class="team-bio">Prev. Nymble Labs. Founded Cypherock, scaled to $600M AUM.</div>
				</div>
				<div class="team-card">
					<div class="team-initials">RJ</div>
					<div class="team-name">Rakshit Jain</div>
					<div class="team-role">Head of Mechatronics</div>
					<div class="team-bio">Prev. Arka AeroSpace. IIIT Delhi. Deep aerospace manufacturing background.</div>
				</div>
				<div class="team-card">
					<div class="team-initials">CS</div>
					<div class="team-name">Chirag Singla</div>
					<div class="team-role">Leading AI</div>
					<div class="team-bio">Prev. Cypherock. Core AI and systems engineering across multiple product cycles.</div>
				</div>
				<div class="team-card">
					<div class="team-initials">CS</div>
					<div class="team-name">Celia Sherman</div>
					<div class="team-role">Aerospace Lead</div>
					<div class="team-bio">Aerospace Engineering, University of Miami. NAR Level 1 certified for high-power rocket launch.</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 8 — COMPETITION -->
		<section class="slide" id="s8">
			<div class="section-label anim-in anim-d1">Competitive Position</div>
			<h2 class="headline anim-in anim-d2">
				How we stand <span class="hl-gold">better</span> than competition
			</h2>
			<div class="comp-list anim-in anim-d3">
				<div class="comp-item">
					<div class="comp-num">01</div>
					<div class="comp-content">
						<div class="comp-title">SpaceX / Starship</div>
						<p class="comp-body">Starship has consumed <strong>$20 billion</strong> in development costs. SpaceX cannot reduce payload launch cost significantly without affecting total profit margins — leaving the market wide open.</p>
					</div>
				</div>
				<div class="comp-item">
					<div class="comp-num">02</div>
					<div class="comp-content">
						<div class="comp-title">The Physical AI Gap</div>
						<p class="comp-body"><strong>No company</strong> has a physical AI solution deployed for space infrastructure development. We are uniquely positioned as the first mover in this category.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 9 — ASK / VISION -->
		<section class="slide" id="s9">
			<div class="section-label anim-in anim-d1">The Ask</div>
			<h2 class="headline anim-in anim-d2">Our <span class="hl-gold">vision</span></h2>
			<div class="vision-body anim-in anim-d3">
				<p class="vision-text">Our first product will generate revenue as a <strong>rocket launch service provider</strong> for deploying orbital data centers in Low Earth Orbit.</p>
				<p class="vision-text">SpaceX's launch service business revenue is estimated at approximately <strong>$4.1 billion in 2025</strong> — this is our addressable wedge.</p>
			</div>
			<div class="ask-row anim-in anim-d3">
				<div class="ask-amount">$100M</div>
				<div class="ask-details">
					<div class="ask-item">
						<div class="ask-val">$1B</div>
						<div class="ask-label">Post-Money Valuation</div>
					</div>
					<div class="ask-divider"></div>
					<div class="ask-item">
						<div class="ask-val">Seed</div>
						<div class="ask-label">Round Stage</div>
					</div>
					<div class="ask-divider"></div>
					<div class="ask-item">
						<div class="ask-val">LEO</div>
						<div class="ask-label">First Target Market</div>
					</div>
				</div>
			</div>
			<div class="ask-footer anim-in anim-d3">
				<a href="https://starforgerobotics.com">starforgerobotics.com</a> &nbsp;·&nbsp; <a href="mailto:vipulsaini594@gmail.com">vipulsaini594@gmail.com</a>
			</div>
		</section>

	</main>

	<!-- ARROW CONTROLS -->
	<button class="arrow arrow-prev" onclick={prevSlide} aria-label="Previous slide">
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
	</button>
	<button class="arrow arrow-next" onclick={nextSlide} aria-label="Next slide">
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
	</button>
</div>

<style>
	:global(html), :global(body) { height: 100%; }

	:global(body) {
		background: #050505;
		color: #e8e2d6;
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
		background: #050505;
	}

	.deck-stage {
		position: relative;
		width: min(100vw, calc(100vh * (16 / 9)));
		height: min(100vh, calc(100vw * (9 / 16)));
		aspect-ratio: 16 / 9;
		background: #080808;
		overflow: hidden;
		box-shadow: 0 0 0 1px rgba(184, 156, 114, 0.12), 0 40px 120px rgba(0,0,0,0.8);
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
		background: rgba(8, 8, 8, 0.95);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(184, 156, 114, 0.12);
	}

	.nav-logo-img {
		height: 32px;
		width: auto;
		object-fit: contain;
		mix-blend-mode: screen;
		filter: brightness(1.1);
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
		background: #2a2520;
		cursor: pointer;
		transition: background 0.3s, transform 0.2s;
	}
	:global(.nav-dot:hover) { background: #6b6155; transform: scale(1.2); }
	:global(.nav-dot.active) { background: #b89c72; transform: scale(1.3); }

	.slide-counter {
		font-family: 'Space Mono', monospace;
		font-size: 10px;
		color: #6b6155;
		letter-spacing: 0.15em;
	}

	.print-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 7px 14px;
		background: transparent;
		border: 1px solid rgba(184, 156, 114, 0.3);
		color: #b89c72;
		font-family: 'Space Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.2s;
	}
	.print-btn:hover {
		background: rgba(184, 156, 114, 0.08);
		border-color: rgba(184, 156, 114, 0.6);
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
		background: rgba(8,8,8,0.6);
		border: 1px solid rgba(184, 156, 114, 0.15);
		color: #6b6155;
		cursor: pointer;
		transition: all 0.2s;
	}
	.arrow:hover { color: #b89c72; border-color: rgba(184, 156, 114, 0.4); background: rgba(8,8,8,0.9); }
	.arrow-prev { left: 8px; }
	.arrow-next { right: 8px; }

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
		transition: opacity 0.5s ease, transform 0.5s ease;
		background: #080808;
	}

	:global(.slide.active) { opacity: 1; transform: translateX(0); pointer-events: auto; }

	:global(.slide.active .anim-in) {
		opacity: 0;
		transform: translateY(18px);
		animation: riseIn 0.6s ease forwards;
	}
	:global(.slide.active .anim-d1) { animation-delay: 0.06s; }
	:global(.slide.active .anim-d2) { animation-delay: 0.14s; }
	:global(.slide.active .anim-d3) { animation-delay: 0.24s; }

	@keyframes riseIn {
		to { opacity: 1; transform: translateY(0); }
	}

	/* ── TYPOGRAPHY ── */
	.section-label {
		font-family: 'Space Mono', monospace;
		font-size: clamp(8px, 1.6vmin, 11px);
		letter-spacing: 0.3em;
		color: #b89c72;
		text-transform: uppercase;
		margin-bottom: clamp(8px, 2.5vh, 18px);
	}

	.headline {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(22px, 5vmin, 56px);
		font-weight: 400;
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: #e8e2d6;
		max-width: 820px;
	}

	.hl-gold { color: #b89c72; }

	/* ── SLIDE 1 COVER ── */
	#s1 {
		justify-content: center;
		background: #050505;
	}

	.cover-bg {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 70% 60% at 80% 50%, rgba(184, 156, 114, 0.06) 0%, transparent 70%),
			radial-gradient(ellipse 40% 70% at 10% 80%, rgba(184, 156, 114, 0.03) 0%, transparent 60%);
	}

	.cover-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(184, 156, 114, 0.06) 1px, transparent 1px),
			linear-gradient(90deg, rgba(184, 156, 114, 0.06) 1px, transparent 1px);
		background-size: 56px 56px;
		mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%);
	}

	.cover-content {
		position: relative;
		z-index: 2;
	}

	.cover-tag {
		font-family: 'Space Mono', monospace;
		font-size: clamp(9px, 1.8vmin, 12px);
		letter-spacing: 0.3em;
		color: #b89c72;
		text-transform: uppercase;
		margin-bottom: clamp(12px, 3vh, 24px);
	}

	.cover-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(26px, 6.5vmin, 72px);
		font-weight: 400;
		line-height: 0.95;
		letter-spacing: 0.04em;
		color: #e8e2d6;
		max-width: 600px;
	}

	.cover-divider {
		width: 40px;
		height: 1px;
		background: #b89c72;
		margin: clamp(12px, 3vh, 28px) 0 clamp(8px, 2vh, 16px);
	}

	.cover-url {
		font-family: 'Space Mono', monospace;
		font-size: clamp(10px, 1.8vmin, 13px);
		color: #6b6155;
		letter-spacing: 0.08em;
	}

	.cover-star {
		position: absolute;
		right: 8%;
		top: 50%;
		transform: translateY(-50%);
		width: clamp(160px, 28vw, 320px);
		opacity: 0.85;
		z-index: 2;
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
		background: rgba(255,255,255,0.02);
		border: 1px solid rgba(184, 156, 114, 0.1);
		border-left: 2px solid rgba(184, 156, 114, 0.4);
	}

	.bullet-icon {
		color: #b89c72;
		font-size: 12px;
		padding-top: 2px;
		flex-shrink: 0;
	}

	.bullet-item p {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.2vmin, 15px);
		font-weight: 300;
		color: #c8c0b4;
		line-height: 1.6;
	}

	.bullet-item p strong {
		color: #e8e2d6;
		font-weight: 500;
	}

	/* ── SOLUTION CARDS ── */
	.solution-cards {
		margin-top: clamp(16px, 5vh, 40px);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3px;
		max-width: 900px;
	}

	.solution-card {
		padding: clamp(16px, 4vh, 36px) clamp(16px, 3vw, 32px);
		background: rgba(255,255,255,0.02);
		border: 1px solid rgba(184, 156, 114, 0.12);
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
		background: linear-gradient(90deg, #b89c72, transparent);
	}

	.solution-card-num {
		font-family: 'Space Mono', monospace;
		font-size: clamp(8px, 1.6vmin, 10px);
		color: #b89c72;
		letter-spacing: 0.2em;
		margin-bottom: clamp(8px, 2vh, 16px);
	}

	.solution-card p {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.2vmin, 15px);
		font-weight: 300;
		color: #c8c0b4;
		line-height: 1.7;
	}

	.solution-card p strong {
		color: #e8e2d6;
		font-weight: 500;
	}

	/* ── WHY US ── */
	.why-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3px;
		margin-top: clamp(16px, 5vh, 48px);
	}

	.why-card {
		padding: clamp(16px, 4vh, 40px) clamp(14px, 2.5vw, 28px);
		background: rgba(255,255,255,0.02);
		border: 1px solid rgba(184, 156, 114, 0.1);
		position: relative;
	}

	.why-card-line {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, #b89c72, transparent);
	}

	.why-card-num {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(28px, 7vmin, 52px);
		color: rgba(184, 156, 114, 0.15);
		line-height: 1;
		letter-spacing: 0.02em;
		margin-bottom: clamp(8px, 2vh, 16px);
	}

	.why-card-body {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.2vmin, 15px);
		font-weight: 300;
		color: #c8c0b4;
		line-height: 1.65;
	}

	.why-card-body strong {
		color: #e8e2d6;
		font-weight: 500;
	}

	/* ── ROCKET SLIDE ── */
	#s6 {
		background: #050505;
		padding: 0;
		overflow: hidden;
	}

	.rocket-photo-bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.rocket-photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 55% 65%;
		filter: brightness(0.82) contrast(1.1) saturate(0.55) sepia(0.08);
	}

	.rocket-photo-fade {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			rgba(5, 5, 5, 0.95) 0%,
			rgba(5, 5, 5, 0.65) 28%,
			rgba(5, 5, 5, 0.08) 50%,
			rgba(5, 5, 5, 0.0) 100%
		);
	}

	.rocket-left {
		position: relative;
		z-index: 2;
		max-width: 44%;
		padding: clamp(56px, 14vh, 96px) clamp(36px, 5vw, 72px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
	}

	.rocket-stats {
		display: grid;
		grid-template-columns: repeat(3, auto);
		gap: 3px;
		margin-top: clamp(12px, 4vh, 48px);
	}

	.rstat {
		padding: clamp(12px, 3vh, 28px) clamp(12px, 2.5vw, 24px);
		background: rgba(255,255,255,0.02);
		border: 1px solid rgba(184, 156, 114, 0.1);
	}

	.rstat-val {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(22px, 5.5vmin, 42px);
		color: #b89c72;
		letter-spacing: 0.04em;
		line-height: 1;
	}

	.rstat-label {
		font-family: 'Space Mono', monospace;
		font-size: 10px;
		color: #6b6155;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		margin-top: 8px;
	}

	/* ── TEAM ── */
	.team-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 3px;
		margin-top: clamp(12px, 4vh, 40px);
	}

	.team-card {
		padding: clamp(14px, 3.5vh, 28px) clamp(12px, 2.5vw, 24px);
		background: rgba(255,255,255,0.02);
		border: 1px solid rgba(184, 156, 114, 0.1);
		border-top: 2px solid rgba(184, 156, 114, 0.3);
	}

	.team-initials {
		width: clamp(28px, 5vmin, 40px);
		height: clamp(28px, 5vmin, 40px);
		border: 1px solid rgba(184, 156, 114, 0.35);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Mono', monospace;
		font-size: clamp(9px, 1.8vmin, 12px);
		color: #b89c72;
		margin-bottom: clamp(8px, 2vh, 16px);
	}

	.team-name {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.4vmin, 17px);
		font-weight: 600;
		color: #e8e2d6;
	}

	.team-role {
		font-family: 'Space Mono', monospace;
		font-size: clamp(8px, 1.4vmin, 10px);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #b89c72;
		margin-top: 3px;
		margin-bottom: clamp(6px, 1.5vh, 12px);
	}

	.team-bio {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(10px, 1.8vmin, 13px);
		font-weight: 300;
		color: #6b6155;
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
		background: rgba(255,255,255,0.02);
		border: 1px solid rgba(184, 156, 114, 0.1);
		border-left: 3px solid #b89c72;
	}

	.comp-num {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(24px, 5.5vmin, 40px);
		color: rgba(184, 156, 114, 0.25);
		line-height: 1;
		flex-shrink: 0;
	}

	.comp-title {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(13px, 2.4vmin, 17px);
		font-weight: 600;
		color: #e8e2d6;
		margin-bottom: clamp(5px, 1.2vh, 8px);
	}

	.comp-body {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.2vmin, 15px);
		font-weight: 300;
		color: #c8c0b4;
		line-height: 1.65;
	}

	.comp-body strong {
		color: #e8e2d6;
		font-weight: 500;
	}

	/* ── VISION / ASK ── */
	#s9 {
		background:
			radial-gradient(ellipse 60% 80% at 90% 50%, rgba(184, 156, 114, 0.05) 0%, transparent 60%),
			#050505;
	}

	.vision-body {
		margin-top: clamp(10px, 3vh, 28px);
		display: flex;
		flex-direction: column;
		gap: clamp(6px, 1.5vh, 12px);
		max-width: 680px;
	}

	.vision-text {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.2vmin, 15px);
		font-weight: 300;
		color: #c8c0b4;
		line-height: 1.65;
	}

	.vision-text strong {
		color: #e8e2d6;
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
		color: #b89c72;
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
		color: #e8e2d6;
		letter-spacing: 0.06em;
	}

	.ask-label {
		font-family: 'Space Mono', monospace;
		font-size: 10px;
		color: #6b6155;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		margin-top: 4px;
	}

	.ask-divider {
		width: 1px;
		height: 36px;
		background: rgba(184, 156, 114, 0.2);
	}

	.ask-footer {
		margin-top: 32px;
		font-family: 'Space Mono', monospace;
		font-size: clamp(10px, 1.8vmin, 12px);
		color: #6b6155;
		letter-spacing: 0.08em;
	}

	/* ── LINKS ── */
	a.cover-url {
		display: inline-block;
		text-decoration: none;
		color: #6b6155;
	}
	a.cover-url:hover { color: #b89c72; }

	.ask-footer a {
		color: #b89c72;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: rgba(184, 156, 114, 0.4);
	}
	.ask-footer a:hover {
		text-decoration-color: #b89c72;
	}

	/* ── PRINT / PDF EXPORT ── */
	@media print {
		@page {
			size: 1280px 720px;
			margin: 0;
		}

		:global(body) {
			background: #050505 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		.deck-viewport {
			display: block;
			width: auto;
			height: auto;
			overflow: visible;
		}

		.arrow { display: none !important; }
		.print-btn { display: none !important; }
		nav { display: none !important; }

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

		/* keep rocket bg anchored inside its slide */
		#s6 {
			position: relative !important;
			padding: 0 !important;
			overflow: hidden !important;
		}

		.cover-star { display: none; }
	}
</style>
