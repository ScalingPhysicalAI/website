<script lang="ts">
	import { onMount } from 'svelte';

	let currentSlide = 0;

	function renderSlides() {
		const nodes = Array.from(document.querySelectorAll<HTMLElement>('.slide'));

		nodes.forEach((slide, i) => {
			const offset = i - currentSlide;
			slide.classList.toggle('active', offset === 0);
			slide.style.transform = `translateX(${offset * 100}%)`;
			slide.style.opacity = offset === 0 ? '1' : '0';

			if (offset === 0) {
				const animTargets = slide.querySelectorAll<HTMLElement>('.anim-in');
				animTargets.forEach((node) => {
					node.style.animation = 'none';
					void node.offsetWidth;
					node.style.animation = '';
				});
			}
		});

		document.querySelectorAll<HTMLElement>('.nav-dot').forEach((dot, i) => {
			dot.classList.toggle('active', i === currentSlide);
		});
	}

	function goToSlide(index: number) {
		const nodes = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
		currentSlide = (index + nodes.length) % nodes.length;
		renderSlides();
	}

	function nextSlide() {
		goToSlide(currentSlide + 1);
	}

	function prevSlide() {
		goToSlide(currentSlide - 1);
	}

	function handleKeyboardNavigation(event: KeyboardEvent) {
		const target = event.target as HTMLElement | null;
		if (
			target &&
			(target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				(target as HTMLElement).isContentEditable)
		) {
			return;
		}

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
			const nodes = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
			event.preventDefault();
			goToSlide(nodes.length - 1);
		}
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
			dot.addEventListener('click', (event) => {
				event.stopPropagation();
				goToSlide(i);
			});
			dotsContainer.appendChild(dot);
		});

		const stage = document.getElementById('deckStage');
		stage?.addEventListener('click', nextSlide);
		document.addEventListener('keydown', handleKeyboardNavigation);

		goToSlide(0);

		return () => {
			stage?.removeEventListener('click', nextSlide);
			document.removeEventListener('keydown', handleKeyboardNavigation);
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:head>
	<title>StarForge Robotics — Pitch Deck</title>
</svelte:head>

<div class="deck-viewport">
	<main class="deck-stage" id="deckStage">
		<nav>
			<div class="nav-logo">StarForge Robotics</div>
			<div class="nav-slides" id="navDots"></div>
		</nav>

		<!-- SLIDE 1 — COVER -->
		<section class="slide" id="s1" data-slide="1">
			<div class="cover-bg"></div>
			<div class="cover-grid"></div>
			<div class="slide-num">01 / 09</div>
			<div class="cover-tag anim-in anim-stagger-1">Physical AI for Space Infrastructure</div>
			<h1 class="cover-title">
				Building<br />Autonomous
				<em>Factories</em>
				for Space
			</h1>
			<p class="cover-sub anim-in anim-stagger-3">
				STARFORGE ROBOTICS &nbsp;·&nbsp; SEED ROUND 2026
			</p>
		</section>

		<!-- SLIDE 2 — MARKET OPPORTUNITY -->
		<section class="slide" id="s2" data-slide="2">
			<div class="slide-num">02 / 09</div>
			<div class="section-label">The Inflection Point</div>
			<h2 class="headline anim-in anim-stagger-1">
				SpaceTech is on the cusp of <span class="hl">escape velocity</span>
			</h2>
			<p class="body-text anim-in anim-stagger-2">
				Launch cost per kg has dropped 16× since the Space Shuttle. One threshold changes
				everything.
			</p>
			<div class="stat-grid anim-in anim-stagger-3">
				<div class="stat-cell">
					<div class="stat-val">$54,500</div>
					<div class="stat-label">Space Shuttle / kg</div>
				</div>
				<div class="stat-cell">
					<div class="stat-val">$13,000</div>
					<div class="stat-label">Atlas V / kg</div>
				</div>
				<div class="stat-cell">
					<div class="stat-val">$3,360</div>
					<div class="stat-label">Falcon 9 / kg</div>
				</div>
				<div class="stat-cell">
					<div class="stat-val">&lt;$1,000</div>
					<div class="stat-label">Orbital datacenter breakeven</div>
				</div>
			</div>
			<p class="body-text anim-in anim-stagger-3" style="margin-top:28px;">
				Once launch cost falls below $1,000/kg, orbital datacenters generate near-free money —
				converting solar energy into inference tokens.
			</p>
		</section>

		<!-- SLIDE 3 — PROBLEM -->
		<section class="slide" id="s3" data-slide="3">
			<div class="slide-num">03 / 09</div>
			<div class="section-label">The Problem</div>
			<h2 class="headline anim-in anim-stagger-1">
				Space needs bigger rockets.<br /><span class="hl"
					>Too many companies only scale cash burn.</span
				>
			</h2>
			<div class="item-list anim-in anim-stagger-2">
				<div class="list-item">
					<span class="list-idx">01</span>
					<div class="list-content">
						<div class="list-title">Blue Origin New Glenn</div>
						<div class="list-desc">
							Likely grounded 4 months to investigate upper stage failure.
						</div>
					</div>
				</div>
				<div class="list-item">
					<span class="list-idx">02</span>
					<div class="list-content">
						<div class="list-title">ULA Vulcan</div>
						<div class="list-desc">
							Grounded due to two Northrop Grumman solid rocket booster failures.
						</div>
					</div>
				</div>
				<div class="list-item">
					<span class="list-idx">03</span>
					<div class="list-content">
						<div class="list-title">Rocket Lab</div>
						<div class="list-desc">
							Burning ~$166M/year with no path to autonomous manufacturing.
						</div>
					</div>
				</div>
				<div class="list-item">
					<span class="list-idx">04</span>
					<div class="list-content">
						<div class="list-title">Relativity Space</div>
						<div class="list-desc">
							Burned over $1 billion cumulatively before leadership change.
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 4 — WHY AI -->
		<section class="slide" id="s4" data-slide="4">
			<div class="slide-num">04 / 09</div>
			<div class="section-label">The Solution</div>
			<h2 class="headline anim-in anim-stagger-1">
				AI must be trained — human <span class="hl">system-level knowledge doesn't scale.</span>
			</h2>
			<div class="hr anim-in anim-stagger-2"></div>
			<p class="body-text anim-in anim-stagger-2">
				Reusable rockets are a solved problem. The challenge is now scaling them. Fully trained
				Physical AI can compress Falcon 9–class infrastructure into 1 year for under $100M.
			</p>
			<div class="stat-grid anim-in anim-stagger-3" style="margin-top:48px;">
				<div class="stat-cell">
					<div class="stat-val">6 yrs</div>
					<div class="stat-label">Falcon 1 → Orbit · $90M</div>
				</div>
				<div class="stat-cell">
					<div class="stat-val">5 yrs</div>
					<div class="stat-label">Falcon 9 first launch · $300M</div>
				</div>
				<div class="stat-cell">
					<div class="stat-val">9 yrs</div>
					<div class="stat-label">New Glenn debut · $billions</div>
				</div>
				<div class="stat-cell">
					<div class="stat-val" style="color:var(--text);">1 yr</div>
					<div class="stat-label" style="color:var(--accent2);">StarForge target · &lt;$100M</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 5 — PRODUCT -->
		<section class="slide" id="s5" data-slide="5">
			<div class="slide-num">05 / 09</div>
			<div class="section-label">Our Product</div>
			<h2 class="headline anim-in anim-stagger-1">
				The Physical AI backbone for the <span class="hl">SpaceTech industry</span>
			</h2>
			<div class="item-list anim-in anim-stagger-2" style="margin-top:48px;">
				<div class="list-item">
					<span class="list-idx">▸</span>
					<div class="list-content">
						<div class="list-title">Humanoid Robots — 24/7 Operation</div>
						<div class="list-desc">
							General-purpose humanoids operating heavy machines around the clock in industrial
							environments and launch facilities.
						</div>
					</div>
				</div>
				<div class="list-item">
					<span class="list-idx">▸</span>
					<div class="list-content">
						<div class="list-title">Physical Sensor Data at Scale</div>
						<div class="list-desc">
							Training AI models requires real physical sensor data — this is the flywheel we have
							solved at large scale. Tesla and Figure are far behind.
						</div>
					</div>
				</div>
				<div class="list-item">
					<span class="list-idx">▸</span>
					<div class="list-content">
						<div class="list-title">AI Coordination System</div>
						<div class="list-desc">
							One unified brain orchestrating all robots in real-time — perception, planning, and
							execution across the entire autonomous workforce.
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 6 — TRACTION -->
		<section class="slide" id="s6" data-slide="6">
			<div class="slide-num">06 / 09</div>
			<div class="section-label">Traction</div>
			<h2 class="headline anim-in anim-stagger-1">Proof of <span class="hl">momentum</span></h2>
			<div class="traction-grid anim-in anim-stagger-2">
				<div class="traction-card">
					<div class="traction-icon">📋</div>
					<div class="traction-title">Letters of Intent</div>
					<div class="traction-body">
						LOIs secured from StarCloud, Space Force, and AST SpaceMobile — three distinct verticals
						validating real demand.
					</div>
				</div>
				<div class="traction-card">
					<div class="traction-icon">⚙️</div>
					<div class="traction-title">4 US Patents</div>
					<div class="traction-body">
						Four granted US patents in Physical AI, protecting our core sensor data collection and
						coordination technology.
					</div>
				</div>
				<div class="traction-card">
					<div class="traction-icon">🚀</div>
					<div class="traction-title">Autonomous Rocket Build</div>
					<div class="traction-body">
						Our Physical AI stack designed, simulated, and autonomously built a 15-foot fiberglass
						rocket in under one month.
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 7 — TEAM -->
		<section class="slide" id="s7" data-slide="7">
			<div class="slide-num">07 / 09</div>
			<div class="section-label">Founding Team</div>
			<h2 class="headline anim-in anim-stagger-1">
				Built by <span class="hl">operators</span>, not theorists
			</h2>
			<div class="team-grid anim-in anim-stagger-2">
				<div class="team-card">
					<div class="team-name">Vipul Saini</div>
					<div class="team-role">CEO · Chief Engineer</div>
					<div class="team-bio">
						Prev. Lockheed Martin, Nymble Labs. Founded Cypherock and scaled to $600M AUM.
					</div>
				</div>
				<div class="team-card">
					<div class="team-name">Rakshit Jain</div>
					<div class="team-role">Head of Mechanical</div>
					<div class="team-bio">
						Prev. Arka AeroSpace. IIIT Delhi. Deep aerospace manufacturing background.
					</div>
				</div>
				<div class="team-card">
					<div class="team-name">Celia Sherman</div>
					<div class="team-role">Aerospace Lead</div>
					<div class="team-bio">
						Aerospace Engineering, University of Miami. NAR Level 1 certified for high-power rocket
						launch.
					</div>
				</div>
				<div class="team-card">
					<div class="team-name">Chirag Madaan</div>
					<div class="team-role">AI Lead</div>
					<div class="team-bio">
						Prev. Cypherock, PayPal. Core AI and systems engineering across multiple product cycles.
					</div>
				</div>
				<div class="team-card">
					<div class="team-name">Parnika Gupta</div>
					<div class="team-role">Robotics Lead</div>
					<div class="team-bio">
						Prev. Cypherock. Electrical Engineering M.S., NYU. Specializes in autonomous robotic
						systems.
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 8 — MARKET -->
		<section class="slide" id="s8" data-slide="8">
			<div class="slide-num">08 / 09</div>
			<div class="section-label">Market Size</div>
			<h2 class="headline anim-in anim-stagger-1">
				A trillion-dollar SpaceX is the baseline.<br /><span class="hl"
					>This market is 100× bigger.</span
				>
			</h2>
			<div class="timeline anim-in anim-stagger-2">
				<div class="timeline-row">
					<div class="timeline-period">2 YRS<br />NEAR TERM</div>
					<div>
						<div class="timeline-val">$20B+</div>
						<div class="timeline-desc">
							Wedge across orbital compute, satellite internet, and defense contracts.
						</div>
					</div>
				</div>
				<div class="timeline-row">
					<div class="timeline-period">4 YRS<br />MID TERM</div>
					<div>
						<div class="timeline-val">$90B+</div>
						<div class="timeline-desc">Government-led lunar and Mars infrastructure buildout.</div>
					</div>
				</div>
				<div class="timeline-row">
					<div class="timeline-period">8 YRS<br />LONG TERM</div>
					<div>
						<div class="timeline-val">$1T+</div>
						<div class="timeline-desc">
							Full space economy — private Moon and Mars missions as ultimate upside.
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 9 — ASK -->
		<section class="slide" id="s9" data-slide="9">
			<div class="slide-num">09 / 09</div>
			<div class="section-label">The Ask</div>
			<h2 class="headline anim-in anim-stagger-1">
				Building toward fully autonomous <span class="hl">Starbase factories</span><br />on Earth,
				the Moon, and Mars.
			</h2>
			<div class="ask-amount anim-in anim-stagger-2">$100M</div>
			<div class="ask-details anim-in anim-stagger-3">
				<div class="ask-detail-item">
					<div class="ask-detail-val">Seed Round</div>
					<div class="ask-detail-label">Stage</div>
				</div>
				<div class="ask-detail-item">
					<div class="ask-detail-val">$1B</div>
					<div class="ask-detail-label">Valuation</div>
				</div>
				<div class="ask-detail-item">
					<div class="ask-detail-val">Miami, FL</div>
					<div class="ask-detail-label">HQ</div>
				</div>
			</div>
			<div class="hr" style="margin-top:48px;"></div>
			<p class="body-text anim-in anim-stagger-3">
				starforgerobotics.com &nbsp;·&nbsp; vipul@starforgerobotics.com
			</p>
		</section>
	</main>
</div>

<style>
	:global(html),
	:global(body) {
		height: 100%;
	}

	:global(body) {
		background: #080808;
		color: #f0ece4;
		font-family: 'Syne', sans-serif;
	}

	.deck-viewport {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.deck-stage {
		position: relative;
		width: min(100vw, calc(100vh * (16 / 9)));
		height: min(100vh, calc(100vw * (9 / 16)));
		aspect-ratio: 16 / 9;
		background: #080808;
		border: 1px solid #1e1e1e;
		overflow: hidden;
	}

	nav {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 48px;
		background: rgba(8, 8, 8, 0.9);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid #1e1e1e;
	}

	.nav-logo {
		font-family: 'Space Mono', monospace;
		font-size: 13px;
		letter-spacing: 0.2em;
		color: #e8d5a3;
		text-transform: uppercase;
	}

	.nav-slides {
		display: flex;
		gap: 6px;
	}

	:global(.nav-dot) {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #3a3530;
		cursor: pointer;
		transition: background 0.3s;
	}
	:global(.nav-dot.active) {
		background: #e8d5a3;
	}

	.slide {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 120px 80px 80px;
		overflow: hidden;
		opacity: 0;
		transform: translateX(100%);
		pointer-events: none;
		transition:
			opacity 0.55s ease,
			transform 0.55s ease;
	}

	:global(.slide.active) {
		opacity: 1;
		transform: translateX(0);
		pointer-events: auto;
	}

	:global(.slide.active .anim-in) {
		opacity: 0;
		transform: translateY(22px);
		animation: riseIn 0.65s ease forwards;
	}
	:global(.slide.active .anim-stagger-1) {
		animation-delay: 0.08s;
	}
	:global(.slide.active .anim-stagger-2) {
		animation-delay: 0.16s;
	}
	:global(.slide.active .anim-stagger-3) {
		animation-delay: 0.24s;
	}

	@keyframes riseIn {
		from {
			opacity: 0;
			transform: translateY(22px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.slide-num {
		position: absolute;
		top: 80px;
		right: 80px;
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		color: #6b6560;
		letter-spacing: 0.15em;
	}

	#s1 {
		background: #080808;
		justify-content: flex-end;
		padding-bottom: 120px;
		overflow: hidden;
	}

	.cover-bg {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 60% 50% at 70% 40%, rgba(196, 169, 107, 0.07) 0%, transparent 70%),
			radial-gradient(ellipse 40% 60% at 20% 80%, rgba(196, 169, 107, 0.04) 0%, transparent 60%);
	}
	.cover-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(#1e1e1e 1px, transparent 1px),
			linear-gradient(90deg, #1e1e1e 1px, transparent 1px);
		background-size: 60px 60px;
		opacity: 0.4;
		mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
	}

	.cover-tag {
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.3em;
		color: #c4a96b;
		text-transform: uppercase;
		margin-bottom: 24px;
	}

	.cover-title {
		font-size: clamp(48px, 8vw, 96px);
		font-weight: 800;
		line-height: 0.95;
		letter-spacing: -0.03em;
		color: #f0ece4;
		max-width: 800px;
	}
	.cover-title em {
		color: #e8d5a3;
		font-style: normal;
		display: block;
	}

	.cover-sub {
		margin-top: 32px;
		font-size: 15px;
		color: #6b6560;
		font-family: 'Space Mono', monospace;
		letter-spacing: 0.05em;
	}

	.section-label {
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.25em;
		color: #c4a96b;
		text-transform: uppercase;
		margin-bottom: 20px;
	}

	.headline {
		font-size: clamp(28px, 4vw, 52px);
		font-weight: 800;
		line-height: 1.05;
		letter-spacing: -0.02em;
		max-width: 780px;
	}
	.headline .hl {
		color: #e8d5a3;
	}

	.body-text {
		margin-top: 24px;
		font-size: 16px;
		color: #6b6560;
		line-height: 1.7;
		max-width: 640px;
		font-family: 'Space Mono', monospace;
		letter-spacing: 0.05em;
	}

	.stat-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1px;
		margin-top: 64px;
		border: 1px solid #1e1e1e;
	}

	.stat-cell {
		padding: 36px 32px;
		background: #0f0f0f;
		border-right: 1px solid #1e1e1e;
	}
	.stat-cell:last-child {
		border-right: none;
	}

	.stat-val {
		font-size: clamp(32px, 4vw, 52px);
		font-weight: 800;
		color: #e8d5a3;
		letter-spacing: -0.03em;
		line-height: 1;
	}

	.stat-label {
		margin-top: 10px;
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		color: #6b6560;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	#s2 .stat-val {
		font-family: 'Space Mono', monospace;
		font-size: clamp(30px, 3.8vw, 48px);
		letter-spacing: 0;
		font-variant-numeric: tabular-nums;
		font-feature-settings: 'tnum' 1;
	}

	.item-list {
		margin-top: 48px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.list-item {
		display: flex;
		align-items: flex-start;
		gap: 24px;
		padding: 24px 28px;
		background: #0f0f0f;
		border: 1px solid #1e1e1e;
		transition: border-color 0.2s;
	}

	.list-item:hover {
		border-color: #3a3530;
	}

	.list-idx {
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		color: #c4a96b;
		padding-top: 4px;
		flex-shrink: 0;
		letter-spacing: 0.1em;
	}

	.list-title {
		font-size: 17px;
		font-weight: 700;
		color: #f0ece4;
	}

	.list-desc {
		margin-top: 6px;
		font-family: 'Space Mono', monospace;
		font-size: 12px;
		color: #6b6560;
		line-height: 1.6;
	}

	.traction-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2px;
		margin-top: 56px;
	}
	@media (max-width: 900px) {
		.traction-grid {
			grid-template-columns: 1fr;
		}
	}
	.traction-card {
		padding: 40px 32px;
		background: #0f0f0f;
		border: 1px solid #1e1e1e;
		position: relative;
		overflow: hidden;
	}
	.traction-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, #c4a96b, transparent);
	}
	.traction-icon {
		font-size: 28px;
		margin-bottom: 20px;
	}
	.traction-title {
		font-size: 16px;
		font-weight: 700;
		color: #f0ece4;
		margin-bottom: 10px;
	}
	.traction-body {
		font-family: 'Space Mono', monospace;
		font-size: 12px;
		color: #6b6560;
		line-height: 1.6;
	}

	.team-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(300px, 1fr));
		gap: 12px;
		margin-top: 56px;
	}
	.team-card {
		padding: 40px;
		background: #0f0f0f;
		border: 1px solid #1e1e1e;
	}
	.team-name {
		font-size: 20px;
		font-weight: 700;
		color: #f0ece4;
	}
	.team-role {
		margin-top: 4px;
		font-family: 'Space Mono', monospace;
		font-size: 13px;
		color: #c4a96b;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.team-bio {
		margin-top: 14px;
		font-family: 'Space Mono', monospace;
		font-size: 13px;
		color: #6b6560;
		line-height: 1.65;
	}

	.timeline {
		margin-top: 56px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.timeline-row {
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 24px;
		padding: 28px 32px;
		background: #0f0f0f;
		border: 1px solid #1e1e1e;
		align-items: start;
	}

	.timeline-period {
		font-family: 'Space Mono', monospace;
		font-size: 12px;
		color: #c4a96b;
		letter-spacing: 0.1em;
		padding-top: 3px;
	}

	.timeline-val {
		font-size: 28px;
		font-weight: 800;
		color: #e8d5a3;
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.timeline-desc {
		margin-top: 6px;
		font-family: 'Space Mono', monospace;
		font-size: 12px;
		color: #6b6560;
		line-height: 1.5;
	}

	#s9 {
		background:
			radial-gradient(ellipse 50% 70% at 80% 50%, rgba(196, 169, 107, 0.06) 0%, transparent 60%),
			#080808;
	}

	.ask-amount {
		font-size: clamp(60px, 12vw, 140px);
		font-weight: 800;
		letter-spacing: -0.04em;
		color: #e8d5a3;
		line-height: 0.9;
		margin-top: 24px;
	}

	.ask-details {
		display: flex;
		gap: 48px;
		margin-top: 48px;
	}

	.ask-detail-item {
		min-width: 180px;
	}

	.ask-detail-val {
		font-family: 'Space Mono', monospace;
		font-size: 22px;
		font-weight: 700;
		color: #f0ece4;
		letter-spacing: 0.04em;
		line-height: 1.2;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.ask-detail-label {
		margin-top: 4px;
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		color: #6b6560;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.hr {
		width: 48px;
		height: 1px;
		background: #c4a96b;
		margin: 32px 0;
	}

	::-webkit-scrollbar {
		width: 4px;
	}
	::-webkit-scrollbar-track {
		background: #080808;
	}
	::-webkit-scrollbar-thumb {
		background: #3a3530;
		border-radius: 2px;
	}

	@media (max-width: 768px) {
		nav {
			padding: 16px 24px;
		}
		.slide {
			padding: 100px 28px 60px;
		}
		.slide-num {
			right: 28px;
		}
	}
</style>
