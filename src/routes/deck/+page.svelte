<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import LinkedInName from '$lib/components/LinkedInName.svelte';

	let currentSlide = 0;
	const SLIDE_SELECTOR = '.slide:not(.slide-hidden)';

	// Below this width a 16:9 stage is only a couple of hundred pixels tall, so
	// the deck drops the carousel and becomes a plain vertical scroll of cards.
	const STACKED_QUERY = '(max-width: 900px)';
	let stacked = false;

	function stackSlides() {
		document.querySelectorAll<HTMLElement>(SLIDE_SELECTOR).forEach((slide) => {
			slide.classList.remove('active');
			slide.style.transform = '';
			slide.style.opacity = '';
		});
		document.body.style.overflow = '';
	}

	function renderSlides() {
		if (stacked) {
			stackSlides();
			return;
		}

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
		if (stacked) return;
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
		if (stacked) return;
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

	function preparePrintLayout() {
		const slides = Array.from(document.querySelectorAll<HTMLElement>(SLIDE_SELECTOR));
		slides.forEach((slide) => {
			slide.classList.add('active');
			slide.style.transition = 'none';
			slide.style.opacity = '1';
			slide.style.transform = 'none';
			slide.querySelectorAll<HTMLElement>('.anim-in').forEach((node) => {
				node.style.opacity = '1';
				node.style.transform = 'none';
				node.style.animation = 'none';
			});
		});
		document.body.classList.add('deck-printing');
		document.body.style.overflow = 'visible';
	}

	function restorePrintLayout() {
		document.body.classList.remove('deck-printing');
		document.body.style.overflow = stacked ? '' : 'hidden';
		renderSlides();
	}

	function printDeck(event?: Event) {
		event?.preventDefault();
		event?.stopPropagation();
		preparePrintLayout();

		const restore = () => {
			window.removeEventListener('afterprint', restore);
			restorePrintLayout();
		};
		window.addEventListener('afterprint', restore);

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				window.focus();
				window.print();
			});
		});
	}

	onMount(() => {
		const dotsContainer = document.getElementById('navDots');
		const nodes = Array.from(document.querySelectorAll<HTMLElement>(SLIDE_SELECTOR));
		if (!dotsContainer || nodes.length === 0) return;

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

		const stackedQuery = window.matchMedia(STACKED_QUERY);
		const syncMode = () => {
			stacked = stackedQuery.matches;
			if (stacked) {
				stackSlides();
			} else {
				document.body.style.overflow = 'hidden';
				goToSlide(currentSlide);
			}
		};
		stackedQuery.addEventListener('change', syncMode);
		syncMode();

		return () => {
			document.removeEventListener('keydown', handleKey);
			stackedQuery.removeEventListener('change', syncMode);
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:head>
	<title>Starforge Robotics - Pitch Deck</title>
	<meta name="robots" content="noindex" />
	<!-- Unscoped so print engines honour page size and unstacked slides. -->
	<style>
		@page {
			size: 13.333in 7.5in;
			margin: 0;
		}
		@media print {
			html,
			body,
			#main {
				height: auto !important;
				overflow: visible !important;
				background: #ffffff !important;
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
			}
			body::before {
				display: none !important;
			}
			.deck-viewport,
			.deck-stage {
				position: static !important;
				display: block !important;
				width: 100% !important;
				height: auto !important;
				aspect-ratio: unset !important;
				overflow: visible !important;
				box-shadow: none !important;
			}
			.deck-stage nav,
			.arrow,
			.print-btn {
				display: none !important;
			}
			.slide {
				position: relative !important;
				inset: auto !important;
				opacity: 1 !important;
				transform: none !important;
				transition: none !important;
				width: 100% !important;
				height: 7.5in !important;
				min-height: 0 !important;
				overflow: hidden !important;
				page-break-after: always !important;
				break-after: page !important;
				display: flex !important;
			}
			.slide:last-of-type {
				page-break-after: auto !important;
				break-after: auto !important;
			}
			.slide .anim-in {
				opacity: 1 !important;
				transform: none !important;
				animation: none !important;
			}
		}
	</style>
</svelte:head>

<div class="deck-viewport">
	<main class="deck-stage" id="deckStage">
		<!-- NAV -->
		<nav>
			<a
				href={resolve('/')}
				class="nav-logo-link"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Starforge home"
			>
				<img src="/assets/logo-wordmark-dark.png" alt="Starforge" class="nav-logo-img" />
			</a>
			<div class="nav-center">
				<div class="nav-slides" id="navDots"></div>
				<span class="slide-counter" id="slideCounter">01 / 15</span>
			</div>
			<button class="print-btn" type="button" onclick={printDeck}>
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
			<figure class="cover-figure anim-in anim-d2">
				<img src="/assets/buildo-head.webp" alt="Buildo humanoid robot" />
			</figure>
			<div class="cover-content">
				<div class="cover-tag anim-in anim-d1">Seed Round · 2026</div>
				<h1 class="cover-title anim-in anim-d2">
					Meet <span class="hl-gold">Buildo</span>, our<br />
					$10k open source<br />
					humanoid robot
				</h1>
				<p class="cover-sub anim-in anim-d3">
					Buildo is a uniquely capable and affordable robot made possible by our AI intelligence
					layer.
				</p>
				<div class="cover-divider anim-in anim-d3"></div>
				<a
					href="https://starforgerobotics.com"
					class="cover-url anim-in anim-d3"
					target="_blank"
					rel="noopener noreferrer">starforgerobotics.com</a
				>
			</div>
		</section>

		<!-- SLIDE 2 - THE PROBLEM -->
		<section class="slide" id="s4">
			<div class="section-label anim-in anim-d1">The Problem</div>
			<h2 class="headline anim-in anim-d2">
				500 billion parameters make human-level<br />
				intelligence <span class="hl-gold">too expensive</span><br />
				for current robots
			</h2>
			<div class="bullet-list anim-in anim-d3">
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						A robot foundation model approaching human-level generality could exceed <strong
							>500 billion parameters</strong
						> - making it extremely difficult and expensive to run on general purpose robots.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						<strong>Open source affordable robots are absent in the market</strong>. Developers and
						researchers are frustrated that it isn't possible to build real-world use cases.
					</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 3 - BREAKTHROUGH -->
		<section class="slide" id="s5">
			<div class="section-label anim-in anim-d1">Our Solution</div>
			<h2 class="headline anim-in anim-d2">
				Our breakthrough allows running<br />
				<span class="hl-gold">any sized model</span> on humanoid robots
			</h2>
			<div class="solution-layout anim-in anim-d3">
				<div class="solution-col">
					<div class="solution-card">
						<p>
							Ran an <strong>8.3B parameter model</strong> on a cloud server with a 76M parameter edge
							adapter on an STM32 MP2, producing valid action chunks at
							<strong>~400ms latency</strong>.
						</p>
					</div>
					<p class="solution-source">
						Our breakthrough is derived from a heavily optimized implementation of <a
							class="solution-source-link"
							href="https://arxiv.org/abs/2602.13476"
							target="_blank"
							rel="noopener noreferrer">arXiv 2602.13476</a
						>
					</p>
				</div>
				<div class="approach-table-wrap">
					<table class="approach-table">
						<thead>
							<tr>
								<th scope="col">Approach</th>
								<th scope="col">Robot cost</th>
								<th scope="col">Latency</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th scope="row">Large VLA on Server</th>
								<td>Low</td>
								<td>High (&gt;2s)</td>
							</tr>
							<tr>
								<th scope="row">Large VLA on Robot</th>
								<td>High</td>
								<td>Low</td>
							</tr>
							<tr class="approach-row-ours">
								<th scope="row">Buildo's AI Model</th>
								<td>Low</td>
								<td>Low (~400ms)</td>
							</tr>
						</tbody>
					</table>
					<div class="demo-row">
						<a
							class="demo-btn"
							href="https://www.youtube.com/watch?v=37OvBLDqzmw"
							target="_blank"
							rel="noopener noreferrer"
						>
							Demo <span class="demo-btn-arrow" aria-hidden="true">↗</span>
						</a>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 4 - BUILDO KIT -->
		<section class="slide" id="s6">
			<div class="section-label anim-in anim-d1">Product</div>
			<h2 class="headline anim-in anim-d2">
				Buildo <span class="hl-gold">robot</span> and <span class="hl-gold">training kit</span>
			</h2>
			<div class="product-pair anim-in anim-d3">
				<div class="why-card product-card-1">
					<div class="why-card-line"></div>
					<p class="why-card-body">
						<strong>Buildo</strong> is designed for most
						<strong>real-world use cases</strong> today.
					</p>
				</div>
				<div class="why-card product-card-2">
					<div class="why-card-line"></div>
					<p class="why-card-body">
						Training kit enables <strong>teleoperation and real-world data collection</strong>.
					</p>
				</div>
				<figure class="product-shot product-shot-1">
					<img src="/assets/buildo-product.webp" alt="Buildo robot" />
				</figure>
				<div class="product-price">
					<span class="product-price-label">Retail price</span>
					<span class="product-price-val">$10K</span>
				</div>
				<figure class="product-shot product-shot-2">
					<img src="/assets/buildo-kit.webp" alt="Buildo training kit" />
				</figure>
			</div>
			<div class="product-specs anim-in anim-d3">
				<div class="product-spec">
					<span class="product-spec-label">Payload</span>
					<span class="product-spec-val">18 <em>lb</em></span>
				</div>
				<div class="product-spec">
					<span class="product-spec-label">Height</span>
					<span class="product-spec-val">4-5 <em>ft</em></span>
				</div>
				<div class="product-spec">
					<span class="product-spec-label">Speed</span>
					<span class="product-spec-val">1.4 <em>mph</em></span>
				</div>
				<div class="product-spec">
					<span class="product-spec-label">Joint torque</span>
					<span class="product-spec-val">15 <em>N·m</em></span>
				</div>
			</div>
		</section>

		<!-- SLIDE 5 - CRITICAL PATH -->
		<section class="slide" id="s7">
			<div class="critical-layout">
				<div class="critical-copy">
					<div class="section-label anim-in anim-d1">Advantage</div>
					<h2 class="headline anim-in anim-d2">
						More than <span class="hl-gold">80% BOM control</span><br />
						through in-house vertical integration
					</h2>
					<p class="critical-body anim-in anim-d3">
						Buildo's actuators and 5 fingered hands are
						<strong>made in the United States</strong>. This gives Starforge a clear advantage after
						the <strong class="hl-gold">latest FCC ban on mobile robots</strong>.
					</p>
					<table class="bom-table anim-in anim-d3">
						<tbody>
							<tr class="bom-row-key">
								<th scope="row">Actuators + hands</th>
								<td>80%</td>
							</tr>
							<tr>
								<th scope="row">On board compute</th>
								<td>8%</td>
							</tr>
							<tr>
								<th scope="row">Structure</th>
								<td>6%</td>
							</tr>
							<tr>
								<th scope="row">Sensors</th>
								<td>3%</td>
							</tr>
							<tr>
								<th scope="row">Others</th>
								<td>3%</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="critical-photos anim-in anim-d3">
					<figure class="critical-shot">
						<img
							src="/assets/critical-path-hands.webp"
							alt="Five-fingered dexterous hands"
						/>
						<figcaption>5 fingered dexterous hands</figcaption>
					</figure>
					<figure class="critical-shot">
						<img src="/assets/critical-path-actuators.webp" alt="Actuators" />
						<figcaption>15 N·m Actuators</figcaption>
					</figure>
				</div>
			</div>
		</section>

		<!-- SLIDE 6 - COMPUTE LAYER -->
		<section class="slide" id="s8">
			<div class="infra-layout">
				<div class="infra-copy">
					<div class="section-label anim-in anim-d1">Platform</div>
					<h2 class="headline anim-in anim-d2">
						Providing the<br />
						<span class="hl-gold">API for Intelligence</span>
					</h2>
				</div>
				<div class="infra-body">
					<div class="solution-card infra-card-1 anim-in anim-d3">
						<div class="solution-card-num">Humanoid Platform</div>
						<p>
							Enable researchers and developers to <strong>collect real-world data</strong> and build
							better physical AI models on an open, accessible platform.
						</p>
					</div>
					<div class="solution-card infra-card-2 anim-in anim-d3">
						<div class="solution-card-num">Intelligence Layer</div>
						<p>
							<strong>Host robot models</strong> for inference - from any size model to production
							deployment.
						</p>
					</div>
					<div class="infra-figure-col anim-in anim-d3">
						<div class="infra-figure-anchor">
							<figure class="infra-figure">
								<img
									src="/assets/dev-portal-skills.png"
									alt="Starforge /dev robot skills marketplace"
								/>
								<figcaption>
									Skills hosted on our server run directly on the robot
								</figcaption>
							</figure>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 7 - DEMOS -->
		<section class="slide" id="s16">
			<div class="section-label anim-in anim-d1">Demos</div>
			<h2 class="headline anim-in anim-d2">
				Buildo is designed to do<br />
				<span class="hl-gold">most real-world tasks</span>
			</h2>
			<div class="demo-grid anim-in anim-d3">
				<figure class="demo-video">
					<div class="demo-frame">
						<!-- svelte-ignore a11y_media_has_caption -->
						<video src="/assets/robot-demo.mp4" autoplay loop muted playsinline preload="auto"></video>
					</div>
					<figcaption>Buildo is wheel based and can adjust its height</figcaption>
				</figure>
				<figure class="demo-video">
					<div class="demo-frame">
						<!-- svelte-ignore a11y_media_has_caption -->
						<video src="/assets/robot-hand-demo.mp4" autoplay loop muted playsinline preload="auto"></video>
					</div>
					<figcaption>Buildo has 5 fingered dexterous hands with tactile sensors</figcaption>
				</figure>
			</div>
		</section>

		<!-- SLIDE 8 - COMPETITION -->
		<section class="slide" id="s11">
			<div class="comp-layout">
				<div class="comp-copy">
					<div class="section-label anim-in anim-d1">Competitive Position</div>
					<h2 class="headline anim-in anim-d2">
						Why <span class="hl-gold">Buildo wins</span>
					</h2>
				</div>
				<div class="comp-body-row anim-in anim-d3">
					<div class="comp-col">
						<div class="comp-col-head">Competitors</div>
						<div class="comp-list">
							<div class="comp-item">
								<div class="comp-num">01</div>
								<div class="comp-content">
									<div class="comp-title">
										<a href="https://www.1x.tech/neo" target="_blank" rel="noopener noreferrer"
											>1X Neo</a
										>
									</div>
									<p class="comp-body">
										Their robots cost <strong>$20K</strong> which prices out many researchers and
										developers. Bipedal robots are still considered
										<strong>unsafe for home deployment</strong>.
									</p>
								</div>
							</div>
							<div class="comp-item">
								<div class="comp-num">02</div>
								<div class="comp-content">
									<div class="comp-title">
										<a href="https://faunarobotics.com/" target="_blank" rel="noopener noreferrer"
											>Fauna</a
										>
									</div>
									<p class="comp-body">
										<strong>Costly ($50K)</strong> - high barrier to entry for most researchers and
										developers, limiting community growth and data collection scale.
									</p>
								</div>
							</div>
							<div class="comp-item">
								<div class="comp-num">03</div>
								<div class="comp-content">
									<div class="comp-title">
										<a href="https://lightberry.com/" target="_blank" rel="noopener noreferrer"
											>Lumi</a
										> and similar
									</div>
									<p class="comp-body">
										Lumi robots cost <strong>$40K</strong>. Additionally, companies using Chinese
										robots as a wrapper will face
										<strong>high costs and scalability issues</strong> due to FCC regulation.
									</p>
								</div>
							</div>
						</div>
					</div>
					<div class="comp-col">
						<div class="comp-col-head comp-col-head-sf">Starforge</div>
						<aside class="comp-claim">
							<p class="comp-claim-body">
								<strong>80% lower hardware cost</strong> enables mass deployment and gives a clear
								advantage to Buildo robots.
							</p>
						</aside>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 9 - TRACTION -->
		<section class="slide" id="s14">
			<div class="section-label anim-in anim-d1">Traction</div>
			<h2 class="headline anim-in anim-d2">
				Developers and startups<br />
				<span class="hl-gold">love our robots</span>
			</h2>
			<div class="traction-layout anim-in anim-d3">
				<div class="comp-list">
					<div class="comp-item">
						<div class="comp-content">
							<div class="comp-title">
								<a
									href="https://zooty.mazoutelectric.com/"
									target="_blank"
									rel="noopener noreferrer">Mazout Electric</a
								>
							</div>
							<p class="comp-body">
								Building <strong>lithium ion batteries using robots</strong> - deploying Starforge
								humanoids for real industrial manufacturing tasks.
							</p>
						</div>
					</div>
					<div class="comp-item">
						<div class="comp-content">
							<div class="comp-title">Developer Ecosystem</div>
							<p class="comp-body">
								<strong>50+ developers</strong> are already using Buildo's physics simulator.
								Researchers and developers from <strong>UC Berkeley, NYU</strong> and more.
							</p>
						</div>
					</div>
					<div class="comp-unis">
						<div class="comp-uni-row">
							<img src="/assets/uni/berkeley.png" alt="University of California, Berkeley" />
							<img class="uni-nyu" src="/assets/uni/nyu.png" alt="New York University" />
							<img src="/assets/uni/ucsd.png" alt="University of California, San Diego" />
							<img src="/assets/uni/uci.png" alt="University of California, Irvine" />
						</div>
						<div class="comp-uni-row">
							<img class="uni-purdue" src="/assets/uni/purdue.png" alt="Purdue University" />
							<img class="uni-ucsc" src="/assets/uni/ucsc.png" alt="University of California, Santa Cruz" />
							<img class="uni-umd" src="/assets/uni/umd.png" alt="University of Maryland" />
						</div>
					</div>
				</div>
				<figure class="traction-figure">
					<img src="/assets/traction-bench.jpg" alt="Starforge arm on the bench beside test boards" />
				</figure>
			</div>
		</section>

		<!-- SLIDE 10 - REVENUE -->
		<section class="slide" id="s10">
			<div class="infra-layout">
				<div class="infra-copy">
					<div class="section-label anim-in anim-d1">Business Model</div>
					<h2 class="headline anim-in anim-d2">
						Hardware as a trojan horse for<br />
						<span class="hl-gold">high-margin API</span> Intelligence
					</h2>
				</div>
				<div class="rev-model anim-in anim-d3">
					<div class="rev-stack">
						<div class="rev-step rev-step-key">
							<div class="rev-step-head">
								<span class="rev-step-num">01</span>
								<span class="rev-step-name">Sell the robot</span>
								<span class="rev-step-val">($10K)</span>
							</div>
							<p>
								One-time hardware revenue and a growing installed base.<a
									class="citation"
									href="https://x.com/RoboStrategy/status/2087561451468681234"
									target="_blank"
									rel="noopener noreferrer">[1]</a
								>
							</p>
						</div>
						<div class="rev-arrow" aria-hidden="true">→</div>
						<div class="rev-step">
							<div class="rev-step-head">
								<span class="rev-step-num">02</span>
								<span class="rev-step-name">Sell Intelligence API</span>
								<span class="rev-step-val">($0.20 in / $4 out per M)</span>
							</div>
							<p>
								Training, inference and hosting at <strong>$0.20 per million input</strong> and
								<strong>$4 per million output</strong>. Demand runs from 2.5T tokens in 2026 to 2
								quadrillion in 2028.<a
									class="citation"
									href="https://x.com/a16z/status/2091200032162857328"
									target="_blank"
									rel="noopener noreferrer">[2]</a
								>
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 11 - MILESTONES -->
		<section class="slide" id="s18">
			<div class="section-label anim-in anim-d1">Milestones</div>
			<h2 class="headline anim-in anim-d2">
				<span class="hl-gold">$1.16B ARR by 2028</span> driven by<br />
				2 quadrillion token API demand
			</h2>
			<div class="ms-track anim-in anim-d3">
				<div class="ms-step">
					<div class="ms-period">Q4 2026</div>
					<div class="ms-title">Hardware ready</div>
					<p class="ms-body">Production line ready and production scaling to 500 units.</p>
					<dl class="ms-stats">
						<div class="ms-stat">
							<dt>Units sold</dt>
							<dd>100</dd>
						</div>
						<div class="ms-stat">
							<dt>Token spend</dt>
							<dd>2.5T</dd>
						</div>
					</dl>
				</div>
				<div class="ms-step">
					<div class="ms-period">Q1 - Q2 2027</div>
					<div class="ms-title">The research standard</div>
					<p class="ms-body">
						Go-to platform for university labs and physical AI startups, with production scaling to
						5,000 units.
					</p>
					<dl class="ms-stats">
						<div class="ms-stat">
							<dt>Units sold</dt>
							<dd>2,500</dd>
						</div>
						<div class="ms-stat">
							<dt>Token spend</dt>
							<dd>200T</dd>
						</div>
					</dl>
				</div>
				<div class="ms-step">
					<div class="ms-period">Q3 - Q4 2027</div>
					<div class="ms-title">Out of the lab</div>
					<p class="ms-body">
						Factory and home deployment, with production scaled to 10,000 units.
					</p>
					<dl class="ms-stats">
						<div class="ms-stat">
							<dt>Units sold</dt>
							<dd>5,000</dd>
						</div>
						<div class="ms-stat">
							<dt>Token spend</dt>
							<dd>300T</dd>
						</div>
					</dl>
				</div>
				<div class="ms-step ms-step-key">
					<div class="ms-period">2028</div>
					<div class="ms-title">Scale</div>
					<p class="ms-body">
						Production scaled to 50,000 units. Total revenue <strong>$1.46B</strong>: $1.16B from
						token spend and $300M from hardware.
					</p>
					<dl class="ms-stats">
						<div class="ms-stat">
							<dt>Units sold</dt>
							<dd>20,000</dd>
						</div>
						<div class="ms-stat">
							<dt>Token spend</dt>
							<dd>2Q</dd>
						</div>
					</dl>
				</div>
			</div>
			<p class="ms-note anim-in anim-d3">
				Token volumes are the inference curve from the forecast, split 90% input to 10% output for a
				blended <strong>$0.58 per million</strong>. Hardware is one-time; recurring ARR compounds on
				the installed base.
			</p>
		</section>

		<!-- SLIDE 12 - TEAM -->
		<section class="slide" id="s13">
			<div class="section-label anim-in anim-d1">Founding Team</div>
			<h2 class="headline anim-in anim-d2">
				Builders who have scaled<br /><span class="hl-gold">hardware to mass production</span> before
			</h2>
			<div class="team-grid anim-in anim-d3">
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/vipul.png" alt="Delhi Technological University" />
					<img class="team-photo" src="/assets/team/vipul.jpg" alt="" />
					<div class="team-name">
						<LinkedInName
							name="Vipul Saini"
							linkedin="https://www.linkedin.com/in/vipul-saini-59a24156/"
							x="https://x.com/vipulsaini594"
						/>
					</div>
					<div class="team-role">Founder · Chief Engineer</div>
					<div class="team-bio">
						Founded Cypherock and scaled the safest crypto hardware wallet to $600M AUM -
						<strong>hardware shipped at scale</strong>. The Delhi Technological University engineer has
						already taken hardware from prototype to global production once.
					</div>
				</div>
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/chiragm.png" alt="Vellore Institute of Technology" />
					<img class="team-photo" src="/assets/team/chiragm.jpg" alt="" />
					<div class="team-name">
						<LinkedInName
							name="Chirag Madaan"
							linkedin="https://www.linkedin.com/in/appleswiggy/"
						/>
					</div>
					<div class="team-role">Senior Machine Learning Engineer</div>
					<div class="team-bio">
						Shipped <strong>production grade machine learning</strong> at PayPal and built the
						cryptography securing 10,000+ Cypherock devices. He turns
						<strong>AI research into models</strong> that run in the real world, a craft he started at
						Vellore Institute of Technology.
					</div>
				</div>
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/rakshit.png" alt="Manipal Institute of Technology" />
					<img class="team-photo" src="/assets/team/rakshit.jpg" alt="" />
					<div class="team-name">
						<LinkedInName
							name="Rakshit Jain"
							linkedin="https://www.linkedin.com/in/rakshitjain003/"
						/>
					</div>
					<div class="team-role">Senior Robotics Engineer</div>
					<div class="team-bio">
						Holds multiple patents and has put <strong>robotics and aerospace products into mass
							manufacturing</strong> that sell commercially today. A Manipal Institute of Technology
						engineer, he turns a design into something a factory can actually build.
					</div>
				</div>
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/sarthak.png" alt="Amity University" />
					<img class="team-photo" src="/assets/team/sarthak.jpg" alt="" />
					<div class="team-name">
						<LinkedInName
							name="Sarthak Mishra"
							linkedin="https://www.linkedin.com/in/sarthak-mishra-ba32501bb/"
						/>
					</div>
					<div class="team-role">Senior Software Engineer</div>
					<div class="team-bio">
						Built software-defined electric vehicles at Mazout Electric across low-latency
						teleoperation, <strong>embedded systems</strong> and cloud. The Amity University graduate
						owns the real-time link that ties the robot to its operator.
					</div>
				</div>
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/anay.png" alt="University of California, Irvine" />
					<img class="team-photo" src="/assets/team/anay.jpg" alt="" />
					<div class="team-name">
						<LinkedInName
							name="Anay Shiledar"
							linkedin="https://www.linkedin.com/in/anay-shiledar-629036209/"
						/>
					</div>
					<div class="team-role">Electrical Engineer</div>
					<div class="team-bio">
						Designs neural-interface electronics and firmware in the Neuroelectronics
						Research Lab at the University of California, Irvine. On Buildo, he handles
						<strong>embedded&nbsp;software</strong>, board bring-up, and hardware integration.
					</div>
				</div>
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/chirag.png" alt="Bharati Vidyapeeth" />
					<img class="team-photo" src="/assets/team/chirag.jpg" alt="" />
					<div class="team-name">
						<LinkedInName
							name="Chirag Singla"
							linkedin="https://www.linkedin.com/in/chirag-droid/"
						/>
					</div>
					<div class="team-role">Software Engineer</div>
					<div class="team-bio">
						A Bharati Vidyapeeth engineer who has been writing <strong>transformer models</strong> for
						five years and shipped the cryptography behind Cypherock's hardware wallet. He builds the
						AI that has to run inside the robot.
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 13 - VISION / ASK -->
		<section class="slide" id="s15">
			<div class="section-label anim-in anim-d1">The Vision</div>
			<h2 class="headline anim-in anim-d2">
				Largest <span class="hl-gold">open intelligence</span> infrastructure<br />
				for humanoid robots
			</h2>
			<div class="vision-body anim-in anim-d3">
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						Ecosystem-driven acceleration will bring the industry substantially closer to <strong
							>general purpose robotics intelligence</strong
						> - creating transformational productivity gains across multiple industries.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">▸</span>
					<p>
						<strong>Demand for API as intelligence will increase 100× with adoption</strong>, far
						exceeding digital AI today.<a
							class="citation"
							href="https://x.com/a16z/status/2091200032162857328"
							target="_blank"
							rel="noopener noreferrer">[3]</a
						>
					</p>
				</div>
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
						<div class="ask-val">Intelligence</div>
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
				<a href="https://starforgerobotics.com" target="_blank" rel="noopener noreferrer"
					>starforgerobotics.com</a
				>
				&nbsp;·&nbsp;
				<a href="mailto:contact@starforgerobotics.com" target="_blank" rel="noopener noreferrer"
					>contact@starforgerobotics.com</a
				>
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
		position: relative;
		z-index: 300;
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

	/* Nudges the centred block up so the three-line headline is not sitting low. */
	#s4 {
		padding-bottom: clamp(80px, 16vh, 150px);
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
	   maps it edge to edge with nothing cropped. The white ramp is held heavy
	   throughout: the graphic is now only a faint texture behind the headline and
	   the Buildo render, both of which have to read cleanly over it. */
	.cover-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(
				90deg,
				rgb(255, 255, 255) 0%,
				rgb(255, 255, 255) 32%,
				rgba(255, 255, 255, 0.95) 44%,
				rgba(255, 255, 255, 0.9) 60%,
				rgba(255, 255, 255, 0.88) 100%
			),
			radial-gradient(ellipse 70% 60% at 80% 50%, rgba(20, 18, 16, 0.03) 0%, transparent 70%),
			radial-gradient(ellipse 40% 70% at 10% 80%, rgba(20, 18, 16, 0.015) 0%, transparent 60%),
			url('/assets/network-graph.webp');
		background-size: auto, auto, auto, cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	/* Sits between the backdrop and the copy, pinned to the right so the headline
	   column is untouched. */
	.cover-figure {
		position: absolute;
		top: 0;
		bottom: 0;
		right: clamp(56px, 11vw, 200px);
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin: 0;
		pointer-events: none;
	}

	.cover-figure img {
		display: block;
		width: auto;
		max-width: 42vw;
		height: clamp(200px, 62vh, 500px);
		object-fit: contain;
		object-position: center;
		/* The render is a crop that ends mid-torso, so it is faded out at the
		   bottom rather than stopping on a hard edge. */
		mask-image: linear-gradient(180deg, #000 0%, #000 82%, transparent 100%);
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
	/* Used by slides 8 (stacked) and 10 (side by side). */
	.solution-cards {
		margin-top: clamp(16px, 5vh, 40px);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3px;
		max-width: 900px;
	}

	/* Extra bottom padding against the centred block, which lifts the whole
	   slide slightly rather than moving any one element. */
	#s5 {
		padding-top: clamp(48px, 10.6vh, 82px);
		padding-bottom: clamp(40px, 7vh, 68px);
	}

	#s5 .section-label {
		margin-bottom: clamp(6px, 1.4vh, 10px);
	}

	/* Shifted visually rather than through the flow: the card and table stay on
	   the centred position the block resolves to, and only the header rises. */
	#s5 .section-label,
	#s5 .headline {
		position: relative;
		top: clamp(-56px, -6.4vh, -26px);
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

	/* ── APPROACH COMPARISON TABLE ── */
	.approach-table-wrap {
		min-width: 0;
		position: relative;
		/* Both columns start at the row's top edge, so the card and the table
		   line up whichever of the two happens to be taller. */
		align-self: start;
	}

	/* Hung below the wrapper rather than placed in it, so adding the row leaves
	   the table centred exactly where it was. */
	.demo-row {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: clamp(12px, 1.6vw, 20px);
		margin-top: clamp(18px, 3.6vh, 34px);
	}

	/* Sized off viewport height so a 16:9 embed always clears the slide chrome.
	   Nudged up so the captions now hanging below it stay clear of the edge. */
	.demo-grid {
		position: relative;
		top: clamp(16px, 3.8vh, 42px);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: clamp(52px, 11vw, 165px);
		width: 100%;
		flex: 1;
		min-height: 0;
	}

	.demo-video {
		display: flex;
		flex-direction: column;
		gap: clamp(6px, 1.2vh, 10px);
		margin: 0;
		min-width: 0;
	}

	/* The caption is wider than the clip, so the frame stretches past it; the
	   video is centred inside so it lines up with the title above. */
	.demo-frame {
		display: flex;
		justify-content: center;
		max-width: 100%;
	}

	.demo-frame video {
		display: block;
		height: min(58vh, 620px);
		max-width: 100%;
		object-fit: contain;
	}

	.demo-video figcaption {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.5vmin, 11px);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #7a5e0f;
		text-align: center;
	}

	.demo-btn {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: clamp(7px, 1.4vh, 11px) clamp(16px, 2.2vw, 26px);
		border: 2px solid #7a5e0f;
		font-family: 'Space Mono', monospace;
		font-size: clamp(9px, 1.6vmin, 12px);
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #7a5e0f;
		text-decoration: none;
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}

	.demo-btn:hover {
		background: #7a5e0f;
		color: #ffffff;
	}

	.demo-btn-arrow {
		transition: transform 0.2s ease;
	}

	.demo-btn:hover .demo-btn-arrow {
		transform: translate(2px, -2px);
	}

	.approach-table {
		width: 100%;
		border-collapse: collapse;
		font-family: 'Barlow', sans-serif;
		background: #ffffff;
		border: 2px solid rgba(20, 18, 16, 0.14);
	}

	.approach-table th,
	.approach-table td {
		padding: clamp(8px, 1.9vh, 18px) clamp(10px, 1.4vw, 22px);
		border-bottom: 1px solid rgba(20, 18, 16, 0.1);
		text-align: center;
		font-size: clamp(11px, 1.95vmin, 16px);
		font-weight: 500;
		line-height: 1.35;
		color: #3a3630;
	}

	.approach-table tbody tr:last-child th,
	.approach-table tbody tr:last-child td {
		border-bottom: 0;
	}

	/* Row labels read as the axis of the comparison, so they are left aligned
	   while the values stay centred under their headings. */
	.approach-table tbody th {
		text-align: left;
		color: #141210;
		font-weight: 600;
	}

	.approach-table thead th {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.5vmin, 11px);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #7a5e0f;
		background: rgba(20, 18, 16, 0.044);
		border-bottom: 2px solid rgba(20, 18, 16, 0.14);
	}

	.approach-table thead th:first-child {
		text-align: left;
	}

	.approach-row-ours th,
	.approach-row-ours td {
		background: rgba(122, 94, 15, 0.09);
		color: #141210;
		font-weight: 700;
	}

	.approach-row-ours th {
		position: relative;
		color: #7a5e0f;
	}

	/* Gold edge marker, matching the accent rule used on the solution cards. */
	.approach-row-ours th::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 3px;
		background: #7a5e0f;
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

	/* Pinned to the top of the row so the card's top edge lines up with the
	   table's, with the source note hanging below it. */
	.solution-col {
		align-self: start;
	}

	.solution-source {
		margin-top: clamp(8px, 1.6vh, 14px);
		font-family: 'Barlow', sans-serif;
		font-size: clamp(10px, 1.7vmin, 13px);
		font-weight: 500;
		color: #5f584e;
	}

	.solution-source-link {
		color: #7a5e0f;
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}

	.solution-source-link:hover {
		color: #141210;
	}

	.solution-card {
		padding: clamp(12px, 2.8vh, 26px) clamp(16px, 3vw, 32px);
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
	   .solution-card used on slides 8 and 10. */
	.solution-layout .solution-card p {
		font-size: clamp(13px, 2.4vmin, 17px);
		line-height: 1.65;
	}

	/* Slides 7–9 and 11: title sits above centre, stacked copy left, visuals right. */
	#s8,
	#s10,
	#s11,
	#s13 {
		justify-content: flex-start;
		padding-top: clamp(76px, 14vh, 108px);
		padding-bottom: clamp(16px, 3vh, 28px);
	}

	#s8 .section-label,
	#s10 .section-label,
	#s11 .section-label,
	#s13 .section-label {
		margin-bottom: clamp(6px, 1.6vh, 12px);
	}

	.infra-layout {
		display: flex;
		flex-direction: column;
		gap: clamp(12px, 2.8vh, 22px);
		width: 100%;
		flex: 1;
		min-height: 0;
	}

	.infra-copy {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.infra-copy .headline {
		max-width: none;
	}

	.infra-body {
		display: grid;
		grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
		gap: clamp(16px, 3vw, 36px);
		align-items: center;
		width: 100%;
		min-width: 0;
		min-height: 0;
	}

	/* The cards are laid out as two rows of the body grid so the figure column
	   can borrow those rows and hang the screenshot off the seam between them. */
	#s8 .infra-body {
		grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
		grid-template-rows: auto auto;
		row-gap: 3px;
		align-items: start;
	}

	.infra-card-1 {
		grid-column: 1;
		grid-row: 1;
	}

	.infra-card-2 {
		grid-column: 1;
		grid-row: 2;
	}

	.infra-figure-col {
		grid-column: 2;
		grid-row: 1 / 3;
		display: grid;
		grid-template-rows: subgrid;
		min-width: 0;
	}

	/* Zero height so it cannot stretch the rows. Centring the figure in a
	   zero-height flex box overflows it evenly above and below, which puts its
	   midpoint on the seam - the same result a transform would give, but
	   without one: Chrome loses text inside transformed boxes when it paginates
	   for print. The 3px cancels the row gap, since the centre line we want is
	   the bottom edge of the first card. */
	.infra-figure-anchor {
		grid-row: 2;
		position: relative;
		top: -3px;
		height: 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/* The caption's height is cancelled out so the centring above measures the
	   image alone. */
	.infra-figure-anchor figcaption {
		margin-bottom: calc(-1 * (1lh + clamp(6px, 1.2vh, 10px)));
	}

	#s8 .infra-figure img {
		display: block;
		width: 100%;
		height: auto;
		max-height: min(58vh, 480px);
		object-fit: contain;
		object-position: center;
	}

	.infra-figure {
		display: block;
		margin: 0;
		min-width: 0;
		background: none;
		border: 0;
	}

	.infra-figure img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: contain;
		background: none;
	}

	.infra-figure figcaption {
		margin-top: clamp(6px, 1.2vh, 10px);
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.5vmin, 11px);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #7a5e0f;
		text-align: center;
	}

	/* Shifted visually rather than through the flow, so the stack and the ladder
	   below stay where the centred block puts them. */

	#s10 .section-label,
	#s10 .headline {
		position: relative;
		top: clamp(70px, 14.2vh, 128px);
	}

	/* Slide 8: the revenue stack reads top-down on the left, and the ARR ladder
	   it resolves to sits on the right. */
	.rev-model {
		display: grid;
		align-content: center;
		width: 100%;
		flex: 1;
		min-height: 0;
	}

	/* Two steps of one model, so they run side by side across the stage with the
	   arrow carrying the reader from the hardware sale to the recurring API. */
	.rev-stack {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		gap: clamp(12px, 2.2vw, 32px);
		align-items: stretch;
		height: 100%;
		min-width: 0;
	}

	.rev-step {
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-left: 3px solid rgba(20, 18, 16, 0.16);
		padding: clamp(18px, 4vh, 44px) clamp(16px, 2.4vw, 36px);
		min-width: 0;
	}

	.rev-step-key {
		border-left-color: #7a5e0f;
		background: rgba(122, 94, 15, 0.07);
	}

	.rev-step-head {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0 clamp(6px, 0.8vw, 12px);
		margin-bottom: clamp(4px, 1vh, 10px);
	}

	.rev-step-num {
		font-family: 'Space Mono', monospace;
		font-size: clamp(9px, 1.5vmin, 12px);
		font-weight: 700;
		letter-spacing: 0.16em;
		color: #7a5e0f;
	}

	.rev-step-name {
		font-family: 'Bebas Neue', sans-serif;
		font-weight: 500;
		font-size: clamp(18px, 3.2vmin, 34px);
		letter-spacing: 0.03em;
		color: #141210;
	}

	.rev-step-val {
		font-family: 'Bebas Neue', sans-serif;
		font-weight: 500;
		font-size: clamp(18px, 3.2vmin, 34px);
		letter-spacing: 0.03em;
		color: #7a5e0f;
		white-space: nowrap;
	}

	.rev-step p {
		margin: 2px 0 0;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.2vmin, 18px);
		font-weight: 400;
		line-height: 1.55;
		color: #3a3630;
		max-width: 46ch;
	}

	.rev-step p strong {
		font-weight: 600;
		color: #141210;
	}

	.rev-arrow {
		align-self: center;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(18px, 4vmin, 40px);
		line-height: 1;
		color: rgba(20, 18, 16, 0.32);
	}

	/* Slide 6 carries two product columns. Content starts a little above
	   vertical centre so the photos under the cards still clear the stage. */
	#s6 {
		justify-content: flex-start;
		padding-top: clamp(52px, 11vh, 80px);
	}

	.product-pair {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		grid-template-areas:
			'card1 . card2'
			'shot1 price shot2';
		grid-template-rows: auto minmax(0, 1fr);
		column-gap: clamp(8px, 1.4vw, 16px);
		row-gap: clamp(6px, 1.2vh, 12px);
		margin-top: clamp(10px, 2.2vh, 22px);
		width: 100%;
		flex: 1;
		min-height: 0;
	}

	.product-card-1 {
		grid-area: card1;
	}

	.product-card-2 {
		grid-area: card2;
	}

	/* These two carry one line of copy each, so the generic card padding just
	   costs the photos below them height. Scoped through the grid so it beats
	   the later .why-card rule. */
	.product-pair .product-card-1,
	.product-pair .product-card-2 {
		padding-top: clamp(9px, 1.7vh, 15px);
		padding-bottom: clamp(9px, 1.7vh, 15px);
	}

	.product-shot-1 {
		grid-area: shot1;
	}

	/* The robot is the hero of the slide, so it gets the taller cap. */
	.product-pair .product-shot-1 img {
		max-height: min(72vh, 640px, 100%);
	}

	.product-shot-2 {
		grid-area: shot2;
	}

	/* The kit is a supporting shot, so it reads smaller than the robot. Scoped
	   through the grid to beat the shared .product-shot img rule below. */
	.product-pair .product-shot-2 img {
		max-height: min(37vh, 320px, 100%);
	}

	.product-price {
		grid-area: price;
		align-self: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 0 clamp(8px, 1.2vw, 16px);
		text-align: center;
	}

	.product-price-label {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.4vmin, 10px);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #7a5e0f;
	}

	.product-price-val {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(28px, 5.5vmin, 42px);
		line-height: 1;
		color: #7a5e0f;
	}

	.product-shot {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		min-height: 0;
		margin: 0;
		background: #ffffff;
	}

	/* Headline specs sit under the pair as a single strip. */
	.product-specs {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: clamp(8px, 1.6vw, 24px);
		flex-shrink: 0;
		margin-top: clamp(12px, 2.6vh, 28px);
		padding-top: clamp(10px, 2vh, 18px);
		border-top: 2px solid rgba(20, 18, 16, 0.12);
	}

	.product-spec {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		min-width: 0;
		text-align: center;
	}

	.product-spec-label {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.3vmin, 10px);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #7a5e0f;
	}

	.product-spec-val {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(18px, 3.6vmin, 32px);
		line-height: 1;
		letter-spacing: 0.02em;
		color: #141210;
	}

	.product-spec-val em {
		font-family: 'Space Mono', monospace;
		font-style: normal;
		font-weight: 700;
		font-size: clamp(9px, 1.5vmin, 12px);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #5f584e;
	}

	.product-shot img {
		display: block;
		width: auto;
		max-width: 100%;
		height: auto;
		/* The 100% keeps the photo inside its grid row so it cannot run over
		   the spec strip below. */
		max-height: min(62vh, 540px, 100%);
		object-fit: contain;
	}

	/* Slide 7: copy left, two labelled photos stacked on the right. The
	   inner grid fills the stage so the title block sits at mid-height. */
	#s7 {
		justify-content: center;
	}

	.critical-layout {
		display: grid;
		grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
		gap: clamp(4px, 1vw, 12px);
		align-items: center;
		width: 100%;
		flex: 1;
		min-height: 0;
	}

	/* Pinned to the top of the row so the BOM table can grow downwards without
	   pushing the headline off centre. The photos stay centred. */
	.critical-copy {
		align-self: start;
		padding-top: clamp(4px, 1.2vh, 12px);
	}

	.critical-copy .headline {
		max-width: none;
	}

	.critical-body {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(13px, 2.4vmin, 17px);
		font-weight: 500;
		line-height: 1.65;
		color: #3a3630;
		max-width: 46ch;
		margin-top: clamp(16px, 3.6vh, 28px);
		margin-left: 0;
	}

	.critical-body strong {
		color: #141210;
		font-weight: 500;
	}

	.critical-body strong.hl-gold {
		color: #7a5e0f;
		font-weight: 700;
	}

	.bom-table {
		margin-top: clamp(14px, 3vh, 26px);
		width: min(100%, 46ch);
		border-collapse: collapse;
		font-family: 'Barlow', sans-serif;
		background: #ffffff;
		border: 2px solid rgba(20, 18, 16, 0.14);
	}

	.bom-table th,
	.bom-table td {
		padding: clamp(5px, 1.2vh, 10px) clamp(10px, 1.4vw, 18px);
		border-bottom: 1px solid rgba(20, 18, 16, 0.1);
		font-size: clamp(11px, 1.9vmin, 14px);
	}

	.bom-table tr:last-child th,
	.bom-table tr:last-child td {
		border-bottom: none;
	}

	.bom-table th {
		text-align: left;
		font-weight: 500;
		color: #3a3630;
	}

	.bom-table td {
		text-align: right;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		color: #141210;
	}

	.bom-table .bom-row-key {
		background: rgba(122, 94, 15, 0.07);
	}

	.bom-table .bom-row-key th,
	.bom-table .bom-row-key td {
		color: #7a5e0f;
		font-weight: 700;
	}

	.critical-photos {
		display: flex;
		gap: clamp(10px, 1.6vw, 22px);
		width: 100%;
		max-width: 100%;
		min-width: 0;
		max-height: 100%;
		margin-left: clamp(-24px, -1.2vw, -8px);
		align-self: center;
		position: relative;
		top: clamp(10px, 2.4vh, 24px);
	}

	/* The two photos are different shapes, so each column centres its own
	   contents and the images meet on a shared midline. */
	.critical-shot {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0;
		flex: 1;
		min-width: 0;
	}

	/* Both photos fill an identical box and are cropped to fit, so the pair
	   reads as a matched set despite their different aspect ratios. */
	.critical-shot img {
		display: block;
		width: 100%;
		height: clamp(150px, min(34vh, 21vw), 300px);
		object-fit: cover;
		object-position: center;
		background: #ffffff;
	}

	.critical-shot figcaption {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.5vmin, 10px);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #7a5e0f;
		margin-top: 8px;
		flex-shrink: 0;
		text-align: center;
		width: 100%;
	}

	/* ── WHY US ── */
	.why-card {
		padding: clamp(16px, 4vh, 40px) clamp(14px, 2.5vw, 28px);
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
		grid-template-columns: repeat(3, minmax(0, 1fr));
		grid-template-rows: repeat(2, minmax(0, 1fr));
		gap: 3px;
		margin-top: clamp(8px, 2vh, 16px);
		flex: 1;
		min-height: 0;
	}

	.team-card {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		padding: clamp(10px, 2.2vh, 20px) clamp(12px, 1.8vw, 22px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-top: 2px solid rgba(20, 18, 16, 0.15);
	}

	/* Logos vary between wordmarks and tall crests, so they are boxed to a
	   common height and left to find their own width inside it. */
	.team-uni {
		position: absolute;
		top: clamp(10px, 2.2vh, 20px);
		right: clamp(12px, 1.8vw, 22px);
		height: clamp(34px, 6.4vmin, 54px);
		width: auto;
		max-width: clamp(72px, 10vw, 120px);
		object-fit: contain;
		object-position: right top;
	}

	.team-photo {
		width: clamp(34px, 6vmin, 52px);
		height: clamp(34px, 6vmin, 52px);
		flex-shrink: 0;
		border: 2px solid rgba(20, 18, 16, 0.175);
		border-radius: 50%;
		object-fit: cover;
		margin-bottom: clamp(8px, 2vh, 16px);
	}

	.team-name {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(13px, 2.2vmin, 17px);
		font-weight: 600;
		color: #141210;
	}

	.team-role {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.4vmin, 10px);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #7a5e0f;
		margin-top: 3px;
		margin-bottom: clamp(6px, 1.5vh, 12px);
	}

	/* Long compound words (Neuroelectronics, neural-interface) leave big ragged
	   gaps in a narrow card, so hyphenation fills the lines out. */
	.team-bio {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(11px, 1.75vmin, 14px);
		font-weight: 500;
		color: #5f584e;
		line-height: 1.5;
		hyphens: auto;
		-webkit-hyphens: auto;
		text-wrap: pretty;
	}

	.team-bio strong {
		font-weight: 700;
		color: #141210;
	}

	/* ── COMPETITION ── */
	.comp-layout {
		display: flex;
		flex-direction: column;
		gap: clamp(12px, 2.8vh, 22px);
		width: 100%;
		flex: 1;
		min-height: 0;
	}

	.comp-copy .headline {
		max-width: none;
	}

	.comp-body-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: clamp(16px, 3vw, 36px);
		align-items: stretch;
		width: 100%;
		min-width: 0;
		min-height: 0;
	}

	/* Equal fr rows in both columns so all six cards share the height of the
	   longest one. */
	.comp-col {
		display: grid;
		grid-template-rows: auto 1fr;
		gap: clamp(6px, 1.4vh, 12px);
		min-width: 0;
	}

	#s11 .comp-list {
		display: grid;
		grid-template-rows: repeat(3, minmax(0, 1fr));
	}

	.comp-col-head-sf {
		color: #7a5e0f;
	}

	/* Sits opposite the competitor list as the single claim that answers it, and
	   fills the same rows so its edges meet the first and last cards. */
	.comp-claim {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: clamp(20px, 4.5vh, 48px) clamp(18px, 2.6vw, 40px);
		background: rgba(122, 94, 15, 0.07);
		border: 2px solid rgba(122, 94, 15, 0.16);
		border-left: 3px solid #7a5e0f;
		min-width: 0;
	}

	.comp-claim-body {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(17px, 3.6vmin, 30px);
		font-weight: 500;
		line-height: 1.5;
		color: #3a3630;
	}

	.comp-claim-body strong {
		font-weight: 700;
		color: #7a5e0f;
	}

	.comp-col-head {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(9px, 1.6vmin, 12px);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #8a8177;
	}

	.comp-list {
		margin-top: clamp(16px, 5vh, 48px);
		display: flex;
		flex-direction: column;
		gap: 3px;
		max-width: 820px;
		min-width: 0;
	}

	#s11 .comp-list {
		margin-top: 0;
		max-width: none;
	}

	/* Traction runs the copy against a bench photo, so the list gives up the
	   right half of the stage and the whole block rides higher to make room. */
	#s14 .section-label,
	#s14 .headline {
		position: relative;
		top: clamp(-4px, -0.5vh, 0px);
	}

	.traction-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		column-gap: clamp(20px, 3.6vw, 44px);
		/* The row is content-sized and centred as a whole, so the photo keeps the
		   position it had and the card top-aligns to it. */
		align-items: start;
		align-content: center;
		width: 100%;
		flex: 1;
		min-height: 0;
		position: relative;
		top: clamp(-4px, -0.5vh, 0px);
	}

	.traction-layout .comp-list {
		position: relative;
		align-self: start;
		margin-top: 0;
		max-width: none;
	}

	/* Hung under the card rather than sitting in flow, so the card alone centres
	   against the photo. */
	.comp-unis {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		gap: clamp(10px, 2vh, 20px);
		margin-top: clamp(12px, 2.4vh, 24px);
	}

	.comp-uni-row {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: nowrap;
		gap: clamp(10px, 1.6vw, 22px);
	}

	/* The marks share a row inside the copy column, so each is capped on width
	   as well as height and allowed to shrink rather than push out. */
	.comp-unis img {
		height: clamp(19px, 3.4vmin, 29px);
		width: auto;
		max-width: 23%;
		min-width: 0;
		object-fit: contain;
	}

	.comp-unis .uni-ucsc {
		height: clamp(17px, 3vmin, 26px);
	}

	.comp-unis .uni-umd {
		height: clamp(24px, 4.4vmin, 38px);
		max-width: 34%;
	}

	.comp-unis .uni-purdue {
		height: clamp(29px, 5.4vmin, 45px);
	}

	/* The torch block is narrow, so it needs extra height to carry the same
	   weight as the marks beside it. */
	.comp-unis .uni-nyu {
		height: clamp(40px, 7.7vmin, 65px);
	}

	.traction-figure {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		min-width: 0;
	}

	.traction-figure img {
		display: block;
		width: 100%;
		max-width: 100%;
		height: clamp(200px, min(50vh, 30vw), 420px);
		object-fit: cover;
		border: 2px solid rgba(20, 18, 16, 0.12);
	}

	.comp-figure {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0;
		min-width: 0;
	}

	.comp-figure figcaption {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.5vmin, 11px);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #7a5e0f;
		text-align: center;
		line-height: 1.35;
		margin: 0 0 8px;
		width: 100%;
	}

	.comp-year {
		color: #7a5e0f;
		font-size: 1.35em;
		letter-spacing: 0.18em;
		border-bottom: 2px solid #7a5e0f;
		padding-bottom: 1px;
	}

	.comp-figure img {
		display: block;
		width: 100%;
		height: auto;
		max-height: min(48vh, 420px);
		object-fit: contain;
		object-position: center;
		background: #ffffff;
	}

	.comp-item {
		display: flex;
		gap: clamp(16px, 3vw, 32px);
		padding: clamp(16px, 4vh, 32px) clamp(18px, 3.5vw, 36px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-left: 3px solid #7a5e0f;
	}

	/* Without a number beside it the content would sit in from the gold rule. */
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

	#s11 .comp-title a,
	#s14 .comp-title a {
		color: inherit;
		font-weight: inherit;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}

	#s11 .comp-title a:hover,
	#s14 .comp-title a:hover {
		color: #7a5e0f;
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

	/* ── MILESTONES ── */
	/* Shifted visually rather than through the flow, so the timeline below keeps
	   the position the centred block gives it. */
	#s18 .section-label,
	#s18 .headline {
		position: relative;
		top: clamp(16px, 3.6vh, 36px);
	}

	/* Four columns reading left to right along a shared rail, with a marker on
	   the rail above each step. */
	.ms-track {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: clamp(10px, 1.6vw, 24px);
		align-content: center;
		width: 100%;
		flex: 1;
		min-height: 0;
		margin-top: clamp(14px, 3.2vh, 32px);
	}

	.ms-step {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		padding: clamp(14px, 2.6vh, 24px) clamp(12px, 1.5vw, 20px) clamp(10px, 2vh, 18px);
		background: rgba(20, 18, 16, 0.035);
		border-top: 2px solid rgba(20, 18, 16, 0.16);
	}

	.ms-step::before {
		content: '';
		position: absolute;
		top: -6px;
		left: clamp(12px, 1.5vw, 20px);
		width: 10px;
		height: 10px;
		background: #f1efeb;
		border: 2px solid rgba(20, 18, 16, 0.28);
		border-radius: 50%;
	}

	.ms-step-key {
		background: rgba(122, 94, 15, 0.08);
		border-top-color: #7a5e0f;
	}

	.ms-step-key::before {
		background: #7a5e0f;
		border-color: #7a5e0f;
	}

	.ms-period {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.5vmin, 11px);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #7a5e0f;
	}

	.ms-title {
		font-family: 'Bebas Neue', sans-serif;
		font-weight: 500;
		font-size: clamp(15px, 2.7vmin, 26px);
		letter-spacing: 0.03em;
		line-height: 1.05;
		color: #141210;
		margin-top: clamp(4px, 1vh, 8px);
	}

	.ms-body {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(10px, 1.75vmin, 14px);
		font-weight: 500;
		line-height: 1.5;
		color: #3a3630;
		margin-top: clamp(5px, 1.2vh, 10px);
	}

	.ms-body strong {
		font-weight: 700;
		color: #7a5e0f;
	}

	/* Pushed to the foot of the card so the figures line up across the row even
	   when the copy above runs to different lengths. */
	.ms-stats {
		margin: clamp(10px, 2vh, 18px) 0 0;
		padding-top: clamp(8px, 1.6vh, 14px);
		border-top: 1px solid rgba(20, 18, 16, 0.12);
		display: flex;
		flex-direction: column;
		gap: clamp(3px, 0.8vh, 7px);
		margin-top: auto;
	}

	.ms-stat {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}

	.ms-stat dt {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(7px, 1.3vmin, 10px);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #6b665e;
	}

	.ms-stat dd {
		margin: 0;
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(15px, 2.5vmin, 24px);
		letter-spacing: 0.03em;
		line-height: 1;
		color: #141210;
	}

	.ms-step-key .ms-stat dd {
		color: #7a5e0f;
	}

	.ms-note {
		margin: clamp(10px, 2vh, 18px) 0 0;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(9px, 1.55vmin, 13px);
		font-weight: 400;
		line-height: 1.45;
		color: #6b665e;
		max-width: 96ch;
	}

	.ms-note strong {
		font-weight: 600;
		color: #7a5e0f;
	}

	/* ── VISION / ASK ── */
	#s15 {
		background:
			radial-gradient(ellipse 60% 80% at 90% 50%, rgba(20, 18, 16, 0.025) 0%, transparent 60%),
			#f1efeb;
	}

	.vision-body {
		margin-top: clamp(10px, 3vh, 28px);
		display: flex;
		flex-direction: column;
		gap: clamp(6px, 1.5vh, 12px);
		max-width: 760px;
	}

	/* Same marker as the problem slide, but the copy runs plain here. */
	.vision-body .bullet-item {
		padding: 0;
		background: none;
		border: 0;
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

	.vision-body strong {
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
		font-size: clamp(28px, 8vmin, 64px);
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

	:global(body.deck-printing) nav,
	:global(body.deck-printing) .arrow,
	:global(body.deck-printing) .print-btn {
		display: none !important;
	}

	:global(body.deck-printing .slide .anim-in),
	:global(body.deck-printing .slide.active .anim-in) {
		opacity: 1 !important;
		transform: none !important;
		animation: none !important;
	}

	:global(html:has(body.deck-printing)),
	:global(body.deck-printing),
	:global(body.deck-printing #main) {
		height: auto !important;
		overflow: visible !important;
		background: #ffffff !important;
	}

	:global(body.deck-printing) .deck-viewport {
		display: block !important;
		width: 100% !important;
		height: auto !important;
		overflow: visible !important;
	}

	:global(body.deck-printing) .deck-stage {
		position: static !important;
		width: 100% !important;
		height: auto !important;
		aspect-ratio: unset !important;
		box-shadow: none !important;
		overflow: visible !important;
	}

	:global(body.deck-printing) .slide,
	:global(body.deck-printing .slide.active) {
		position: relative !important;
		inset: auto !important;
		opacity: 1 !important;
		transform: none !important;
		transition: none !important;
		width: 100% !important;
		height: 7.5in !important;
		min-height: 0 !important;
		overflow: hidden !important;
		page-break-after: always;
		break-after: page;
	}

	/* ── PRINT / PDF EXPORT ── */
	/* ══ MOBILE ══
	   A 16:9 stage inside a portrait phone is a ~220px tall letterbox, so below
	   900px the deck stops being a carousel: the stage becomes a normal block,
	   every slide is a full-width card of its own height, and the page scrolls.
	   The carousel's inline transform/opacity are cleared by the script, but the
	   !important here also covers the moment before it runs. */
	@media (max-width: 900px) {
		.deck-viewport {
			display: block;
			width: 100%;
			height: auto;
			overflow: visible;
			background: #ffffff;
		}

		.deck-stage {
			width: 100%;
			height: auto;
			aspect-ratio: auto;
			overflow: visible;
			box-shadow: none;
		}

		/* Sticky would sit on top of every headline as you scroll past it. */
		nav {
			position: static;
			padding: 12px 20px;
		}

		/* Dots and the slide counter only mean something in the carousel. */
		.nav-center,
		.arrow {
			display: none;
		}

		.slide {
			position: relative !important;
			inset: auto !important;
			height: auto;
			min-height: 0;
			opacity: 1 !important;
			transform: none !important;
			transition: none !important;
			pointer-events: auto !important;
			padding: 40px 20px 44px !important;
			border-bottom: 1px solid rgba(20, 18, 16, 0.09);
		}

		:global(.slide .anim-in) {
			opacity: 1 !important;
			transform: none !important;
			animation: none !important;
		}

		/* Every desktop nudge is measured against a 16:9 stage, so they all read
		   as arbitrary offsets once the slides are stacked. */
		#s5 .headline,
		#s10 .headline,
		#s10 .section-label,
		#s14 .headline,
		#s14 .section-label,
		#s18 .headline,
		#s18 .section-label,
		.demo-grid,
		.critical-photos,
		.traction-layout {
			top: 0;
		}

		/* ── Type scales off the card width instead of the short side of a phone ── */
		.section-label {
			font-size: 10px;
		}

		.headline {
			font-size: clamp(26px, 7.4vw, 38px);
		}

		.cover-title {
			font-size: clamp(30px, 9vw, 46px);
		}

		/* The line breaks are balanced for a wide stage and only make the column
		   ragged at this width, so headlines wrap on their own. */
		.headline br,
		.cover-title br {
			display: none;
		}

		.cover-sub {
			font-size: 15px;
		}

		.bullet-item p,
		.comp-body,
		.solution-card p,
		.why-card-body,
		.comp-claim-body {
			font-size: 15px;
		}

		/* ── Every two- and three-column layout becomes one column ── */
		.solution-layout,
		.infra-body,
		#s8 .infra-body,
		.critical-layout,
		.comp-body-row,
		.traction-layout,
		.rev-stack,
		.ms-track,
		.team-grid {
			display: flex;
			flex-direction: column;
			gap: clamp(14px, 4vw, 24px);
		}

		.team-grid {
			gap: 3px;
		}

		.product-pair {
			display: flex;
			flex-direction: column;
			gap: 18px;
		}

		.product-specs {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 14px;
		}

		.demo-grid {
			flex-direction: column;
			gap: 28px;
			margin-top: 24px;
		}

		/* Full-width would make these portrait clips taller than the screen. */
		.demo-frame video {
			height: min(64vh, 520px);
			width: auto;
			max-width: 100%;
		}

		/* Blocks that hang off a zero-height anchor or the bottom of a column all
		   rejoin the flow, since there is nothing to align them against now. */
		.demo-row,
		.comp-unis {
			position: static;
			margin-top: 16px;
		}

		.infra-figure-anchor {
			height: auto;
			top: 0;
			display: block;
		}

		.infra-figure-anchor figcaption {
			margin-bottom: 0;
		}

		/* The render is pinned beside the copy on a wide stage; stacked, it reads
		   better as a header image above it. */
		.cover-figure {
			position: static;
			justify-content: center;
			margin: 0 0 20px;
		}

		.cover-figure img {
			max-width: 78%;
			height: auto;
		}

		.critical-photos {
			margin-left: 0;
		}

		/* The step arrow pointed across the two revenue columns. */
		.rev-arrow {
			transform: rotate(90deg);
		}

		.ask-row {
			flex-wrap: wrap;
			gap: 16px 24px;
		}

		.ask-details {
			gap: 20px;
		}
	}

	@media print {
		@page {
			size: 13.333in 7.5in;
			margin: 0;
		}

		:global(html),
		:global(body),
		:global(body.deck-printing),
		:global(#main),
		:global(body::before) {
			height: auto !important;
			overflow: visible !important;
			background: #ffffff !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		:global(body::before) {
			display: none !important;
		}

		.deck-viewport {
			display: block !important;
			width: 100% !important;
			height: auto !important;
			overflow: visible !important;
		}

		.arrow,
		.print-btn,
		nav {
			display: none !important;
		}

		.deck-stage {
			position: static !important;
			width: 100% !important;
			height: auto !important;
			aspect-ratio: unset !important;
			box-shadow: none !important;
			overflow: visible !important;
		}

		.slide,
		:global(.slide.active) {
			position: relative !important;
			inset: auto !important;
			opacity: 1 !important;
			transform: none !important;
			transition: none !important;
			pointer-events: auto !important;
			page-break-after: always;
			break-after: page;
			width: 100% !important;
			height: 7.5in !important;
			min-height: 0 !important;
			padding: 56px 48px 32px !important;
			display: flex !important;
			overflow: hidden !important;
		}

		.slide:last-of-type {
			page-break-after: auto;
			break-after: auto;
		}

		:global(.slide .anim-in),
		:global(.slide.active .anim-in) {
			opacity: 1 !important;
			transform: none !important;
			animation: none !important;
		}
	}
</style>
