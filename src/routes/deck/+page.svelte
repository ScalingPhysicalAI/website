<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import LinkedInName from '$lib/components/LinkedInName.svelte';

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
		document.body.style.overflow = 'hidden';
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
				<img src="/assets/logo-wordmark-dark.png" alt="StarForge" class="nav-logo-img" />
			</a>
			<div class="nav-center">
				<div class="nav-slides" id="navDots"></div>
				<span class="slide-counter" id="slideCounter">01 / 12</span>
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
					<a
						class="cover-sub-link"
						href="https://starforgerobotics.com/buildo"
						target="_blank"
						rel="noopener noreferrer"
						>Buildo<span class="cover-sub-arrow" aria-hidden="true">↗</span></a
					> is a uniquely capable and affordable robot made possible by our AI compute layer.
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

		<!-- SLIDE 2 - TRACTION -->
		<section class="slide" id="s14">
			<div class="section-label anim-in anim-d1">Traction</div>
			<h2 class="headline anim-in anim-d2">
				Businesses and developers<br />
				<span class="hl-gold">love our robots</span>
			</h2>
			<div class="traction-layout anim-in anim-d3">
				<div class="comp-list">
					<div class="comp-item">
						<div class="comp-num">01</div>
						<div class="comp-content">
							<div class="comp-title">
								<a
									href="https://zooty.mazoutelectric.com/"
									target="_blank"
									rel="noopener noreferrer">Mazout Electric</a
								>
							</div>
							<p class="comp-body">
								Building <strong>lithium ion batteries using robots</strong> - deploying StarForge humanoids
								for real industrial manufacturing tasks.
							</p>
						</div>
					</div>
					<div class="comp-item">
						<div class="comp-num">02</div>
						<div class="comp-content">
							<div class="comp-title">Developer Ecosystem</div>
							<p class="comp-body">
								<strong>50+ developers</strong> are already using our compute platform - early signal of
								the community-driven flywheel taking hold. Researchers and developers from
								<strong>NYU, UC San Diego</strong> and more.
							</p>
						</div>
					</div>
				</div>
				<figure class="traction-figure">
					<img src="/assets/traction-bench.jpg" alt="Starforge arm on the bench beside test boards" />
				</figure>
				<div class="comp-unis">
					<img class="uni-nyu" src="/assets/uni/nyu.png" alt="New York University" />
					<img src="/assets/uni/ucsd.png" alt="University of California, San Diego" />
					<img src="/assets/uni/uci.png" alt="University of California, Irvine" />
					<img class="uni-purdue" src="/assets/uni/purdue.png" alt="Purdue University" />
				</div>
			</div>
		</section>

		<!-- SLIDE 3 - UNITREE LACKED BRAIN -->
		<section class="slide" id="s4">
			<div class="unitree-layout">
				<div class="unitree-copy">
					<div class="section-label anim-in anim-d1">The Problem</div>
					<h2 class="headline anim-in anim-d2">
						Unitree solved the <span class="hl-gold">body</span> -<br />
						the brain remains unsolved
					</h2>
					<div class="bullet-list anim-in anim-d3">
						<div class="bullet-item">
							<span class="bullet-icon">▸</span>
							<p>
								<strong>Unitree G1</strong> - an open, community-driven platform that lets researchers
								and developers experiment, build and contribute, with <strong
									>over 11,000 G1 units</strong
								> sold. However, we saw Unitree robots dancing and running with
								<strong>no real-world deployment</strong> at scale.
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
				</div>
				<figure class="unitree-figure anim-in anim-d3">
					<img src="/assets/unitree-humanoid.webp" alt="Unitree general purpose humanoid" />
				</figure>
			</div>
		</section>

		<!-- SLIDE 4 - BREAKTHROUGH -->
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
							This <strong>fundamentally changes the architecture and economics</strong> of intelligent
							humanoid robots - models of any size can now run efficiently inside the robot.
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
								<th scope="col">Cost</th>
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
						<p class="demo-note">
							Ran an <strong>8.3B parameter model</strong> on a cloud server with a 76M parameter edge
							adapter on an STM32 MP2, producing valid action chunks at
							<strong>~400ms latency</strong>.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 5 - BUILDO KIT -->
		<section class="slide" id="s6">
			<div class="section-label anim-in anim-d1">Product</div>
			<h2 class="headline anim-in anim-d2">
				Buildo robot and<br />
				<span class="hl-gold">training kit</span> - v1
			</h2>
			<div class="product-pair anim-in anim-d3">
				<div class="why-card product-card-1">
					<div class="why-card-line"></div>
					<div class="why-card-num">01</div>
					<p class="why-card-body">
						<strong>Buildo</strong> is designed for most
						<strong>real-world use cases</strong> today.
					</p>

				</div>
				<div class="why-card product-card-2">
					<div class="why-card-line"></div>
					<div class="why-card-num">02</div>
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
		</section>

		<!-- SLIDE 6 - CRITICAL PATH -->
		<section class="slide" id="s7">
			<div class="critical-layout">
				<div class="critical-copy">
					<div class="section-label anim-in anim-d1">Advantage</div>
					<h2 class="headline anim-in anim-d2">
						Solving the <span class="hl-gold">critical path</span><br />
						in humanoid hardware
					</h2>
					<p class="critical-body anim-in anim-d3">
						<strong>Vertically integrated</strong> major components which are responsible for
						<strong>80% of the humanoid BOM</strong>. Buildo's actuators and 5 fingered hands are
						<strong>made in the United States</strong>. This gives Starforge a clear advantage after
						the latest FCC ban on mobile robots.
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
						<figcaption>actuators</figcaption>
					</figure>
				</div>
			</div>
		</section>

		<!-- SLIDE 7 - COMPUTE LAYER -->
		<section class="slide" id="s8">
			<div class="infra-layout">
				<div class="infra-copy">
					<div class="section-label anim-in anim-d1">Platform</div>
					<h2 class="headline anim-in anim-d2">
						Compute Layer provides the<br />
						<span class="hl-gold">API for Intelligence</span>
					</h2>
				</div>
				<div class="infra-body">
					<div class="infra-cards anim-in anim-d3">
						<div class="solution-card">
							<div class="solution-card-num">Humanoid Platform</div>
							<p>
								Enable researchers and developers to <strong>collect real-world data</strong> and
								build better physical AI models on an open, accessible platform.
							</p>
						</div>
						<div class="solution-card">
							<div class="solution-card-num">Compute Layer</div>
							<p>
								<strong>Host robot models</strong> for inference - from any size model to production
								deployment.
							</p>
						</div>
					</div>
					<figure class="infra-figure anim-in anim-d3">
						<img
							src="/assets/dev-portal-gpu.png"
							alt="Starforge /dev GPU compute rental: RTX 4090, A100, and H100"
						/>
					</figure>
				</div>
			</div>
		</section>

		<!-- SLIDE 8 - REVENUE -->
		<section class="slide" id="s10">
			<div class="infra-layout">
				<div class="infra-copy">
					<div class="section-label anim-in anim-d1">Business Model</div>
					<h2 class="headline anim-in anim-d2">
						Revenue <span class="hl-gold">projection</span>
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
						<div class="rev-arrow" aria-hidden="true">↓</div>
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
					<div class="rev-ladder">
						<table class="approach-table rev-table">
							<thead>
								<tr>
									<th scope="col">Year</th>
									<th scope="col">Robots</th>
									<th scope="col">Tokens</th>
									<th scope="col">Hardware</th>
									<th scope="col">Recurring ARR</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">2026</th>
									<td>100</td>
									<td>2.5T</td>
									<td>$1M</td>
									<td>$1.45M</td>
								</tr>
								<tr>
									<th scope="row">2027</th>
									<td>10,000</td>
									<td>500T</td>
									<td>$100M</td>
									<td>$290M</td>
								</tr>
								<tr class="approach-row-ours">
									<th scope="row">2028</th>
									<td>20,000</td>
									<td>2Q</td>
									<td>$200M</td>
									<td>$1.16B</td>
								</tr>
							</tbody>
						</table>
						<p class="rev-assumption">
							Token volumes are the inference curve from the forecast, split 90% input to 10%
							output for a blended <strong>$0.58 per million</strong>. Hardware is one-time;
							recurring ARR compounds on the installed base.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 9 - COMPETITION -->
		<section class="slide" id="s11">
			<div class="comp-layout">
				<div class="comp-copy">
					<div class="section-label anim-in anim-d1">Competitive Position</div>
					<h2 class="headline anim-in anim-d2">
						How we stand <span class="hl-gold">better</span> than the competition
					</h2>
				</div>
				<div class="comp-body-row anim-in anim-d3">
					<div class="comp-list">
						<div class="comp-item">
							<div class="comp-num">01</div>
							<div class="comp-content">
								<div class="comp-title">
									<a
										href="https://www.1x.tech/neo"
										target="_blank"
										rel="noopener noreferrer">1X Neo</a
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
									<a href="https://lightberry.com/" target="_blank" rel="noopener noreferrer">Lumi</a>
									and similar
								</div>
								<p class="comp-body">
									Lumi robots cost <strong>$40K</strong>. Additionally, companies using Chinese robots
									as a wrapper will face <strong>high costs and scalability issues</strong> due to FCC
									regulation.
								</p>
							</div>
						</div>
					</div>
					<figure class="comp-figure">
						<figcaption>
							robots are a security product<a
								class="citation"
								href="https://arxiv.org/abs/2509.14139"
								target="_blank"
								rel="noopener noreferrer">[3]</a
							>
						</figcaption>
						<img
							src="/assets/g1-security-architecture.png"
							alt="Unitree G1 architecture: onboard stack, Unitree cloud, and telemetry to servers in China"
						/>
					</figure>
				</div>
			</div>
		</section>

		<!-- SLIDE 10 - WHY STARFORGE -->
		<section class="slide" id="s12">
			<div class="section-label anim-in anim-d1">Key Takeaways</div>
			<h2 class="headline anim-in anim-d2">Why <span class="hl-gold">StarForge</span></h2>
			<div class="why-grid anim-in anim-d3">
				<div class="why-card">
					<div class="why-card-line"></div>
					<div class="why-card-num">01</div>
					<p class="why-card-body">
						<strong class="hl-gold">We made a breakthrough that allows robots to run any sized model</strong>
						- making real-world deployments possible for the first time.
					</p>
				</div>
				<div class="why-card">
					<div class="why-card-line"></div>
					<div class="why-card-num">02</div>
					<p class="why-card-body">
						<strong class="hl-gold">Strong developer base already.</strong> Community-driven data collection at scale
						that closed competitors cannot replicate.
					</p>
				</div>
				<div class="why-card">
					<div class="why-card-line"></div>
					<div class="why-card-num">03</div>
					<p class="why-card-body">
						<strong class="hl-gold">Built the entire humanoid robot hardware and supply chain</strong>
						- especially the <strong
							>actuator and dextrous hand</strong
						>, the critical-path components.
					</p>
				</div>
			</div>
		</section>

		<!-- SLIDE 11 - TEAM -->
		<section class="slide" id="s13">
			<div class="section-label anim-in anim-d1">Founding Team</div>
			<h2 class="headline anim-in anim-d2">Built by <span class="hl-gold">builders</span></h2>
			<div class="team-grid anim-in anim-d3">
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/vipul.png" alt="Delhi Technological University" />
					<div class="team-initials">VS</div>
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
						<strong>hardware shipped at scale</strong>. He has already taken a hardware product from
						prototype to global production once.
					</div>
				</div>
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/chiragm.png" alt="Vellore Institute of Technology" />
					<div class="team-initials">CM</div>
					<div class="team-name">
						<LinkedInName
							name="Chirag Madaan"
							linkedin="https://www.linkedin.com/in/appleswiggy/"
						/>
					</div>
					<div class="team-role">Senior Machine Learning Engineer</div>
					<div class="team-bio">
						Shipped <strong>production grade machine learning</strong> capabilities at PayPal and
						built the cryptography securing 10,000+ Cypherock devices. He turns
						<strong>AI research into models</strong> that run in the real world.
					</div>
				</div>
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/rakshit.png" alt="Manipal Institute of Technology" />
					<div class="team-initials">RJ</div>
					<div class="team-name">
						<LinkedInName
							name="Rakshit Jain"
							linkedin="https://www.linkedin.com/in/rakshitjain003/"
						/>
					</div>
					<div class="team-role">Senior Robotics Engineer</div>
					<div class="team-bio">
						Holds multiple patents and has put <strong>robotics and aerospace products into mass
							manufacturing</strong> that sell commercially today. He turns a design into something a
						factory can actually build.
					</div>
				</div>
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/sarthak.png" alt="Amity University" />
					<div class="team-initials">SS</div>
					<div class="team-name">
						<LinkedInName
							name="Sarthak Mishra"
							linkedin="https://www.linkedin.com/in/sarthak-mishra-ba32501bb/"
						/>
					</div>
					<div class="team-role">Senior Software Engineer</div>
					<div class="team-bio">
						Built software-defined electric vehicles at Mazout Electric across low-latency
						teleoperation, <strong>embedded systems</strong> and cloud. He owns the real-time link that
						ties the robot to its operator.
					</div>
				</div>
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/anay.png" alt="University of California, Irvine" />
					<div class="team-initials">AN</div>
					<div class="team-name">
						<LinkedInName
							name="Anay Shiledar"
							linkedin="https://www.linkedin.com/in/anay-shiledar-629036209/"
						/>
					</div>
					<div class="team-role">Electrical Engineer</div>
					<div class="team-bio">
						Designs implantable neural-interface electronics and firmware at the Neuroelectronics
						Research Lab. On Buildo he handles <strong>embedded software</strong>, board bring-up and hardware
						integration.
					</div>
				</div>
				<div class="team-card">
					<img class="team-uni" src="/assets/uni/chirag.png" alt="Bharati Vidyapeeth" />
					<div class="team-initials">CS</div>
					<div class="team-name">
						<LinkedInName
							name="Chirag Singla"
							linkedin="https://www.linkedin.com/in/chirag-droid/"
						/>
					</div>
					<div class="team-role">Software Engineer</div>
					<div class="team-bio">
						Has been writing <strong>transformer models</strong> for five years and shipped the
						cryptography behind Cypherock's hardware wallet. He builds the AI that has to run inside
						the robot.
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 12 - VISION / ASK -->
		<section class="slide" id="s15">
			<div class="section-label anim-in anim-d1">The Vision</div>
			<h2 class="headline anim-in anim-d2">
				Largest <span class="hl-gold">open compute</span> infrastructure<br />
				for physical intelligence
			</h2>
			<div class="vision-body anim-in anim-d3">
				<p class="vision-text">
					Our thesis: ecosystem-driven acceleration could bring the industry substantially closer to <strong
						>general purpose robotics intelligence within the next year</strong
						> - creating transformational productivity gains across multiple industries.
				</p>
				<p class="vision-text">
					<strong>Demand for API as intelligence will increase 100× with adoption</strong
					>, far exceeding digital AI today.<a
						class="citation"
						href="https://x.com/a16z/status/2091200032162857328"
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

	/* Slide 3: copy left, standing Unitree on the right in the open field. */
	.unitree-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
		gap: clamp(20px, 4vw, 48px);
		align-items: center;
		width: 100%;
		flex: 1;
		min-height: 0;
	}

	.unitree-copy .headline {
		max-width: none;
	}

	.unitree-figure {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		min-width: 0;
		height: 100%;
	}

	.unitree-figure img {
		display: block;
		width: auto;
		max-width: 100%;
		height: clamp(240px, min(62vh, 38vw), 520px);
		object-fit: contain;
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

	.demo-note {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(10px, 1.7vmin, 13px);
		font-weight: 500;
		line-height: 1.5;
		color: #5f584e;
		min-width: 0;
	}

	.demo-note strong {
		font-weight: 700;
		color: #141210;
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

	#s8 .infra-body {
		grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
	}

	#s8 .infra-figure img {
		display: block;
		width: 100%;
		height: auto;
		max-height: min(58vh, 480px);
		object-fit: contain;
		object-position: center;
	}

	.infra-cards {
		display: flex;
		flex-direction: column;
		gap: 3px;
		margin-top: 0;
		min-width: 0;
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

	/* Shifted visually rather than through the flow, so the stack and the ladder
	   below stay where the centred block puts them. */
	#s10 .section-label,
	#s10 .headline {
		position: relative;
		top: clamp(88px, 17.6vh, 158px);
	}

	/* Slide 8: the revenue stack reads top-down on the left, and the ARR ladder
	   it resolves to sits on the right. */
	.rev-model {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		column-gap: clamp(20px, 3.6vw, 52px);
		align-items: center;
		width: 100%;
		flex: 1;
		min-height: 0;
	}

	.rev-stack {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.rev-step {
		border-left: 3px solid rgba(20, 18, 16, 0.16);
		padding: clamp(6px, 1.1vh, 10px) 0 clamp(6px, 1.1vh, 10px) clamp(10px, 1.1vw, 16px);
		min-width: 0;
	}

	.rev-step-key {
		border-left-color: #7a5e0f;
	}

	.rev-step-head {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0 clamp(6px, 0.8vw, 12px);
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
		font-size: clamp(16px, 2.7vmin, 26px);
		letter-spacing: 0.03em;
		color: #141210;
	}

	.rev-step-val {
		font-family: 'Bebas Neue', sans-serif;
		font-weight: 500;
		font-size: clamp(16px, 2.7vmin, 26px);
		letter-spacing: 0.03em;
		color: #7a5e0f;
		white-space: nowrap;
	}

	.rev-step p {
		margin: 2px 0 0;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(11px, 1.95vmin, 16px);
		font-weight: 400;
		line-height: 1.5;
		color: #3a3630;
		max-width: 46ch;
	}

	.rev-step p strong {
		font-weight: 600;
		color: #141210;
	}

	.rev-arrow {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2vmin, 17px);
		line-height: 1;
		color: rgba(20, 18, 16, 0.32);
		padding: clamp(3px, 0.7vh, 7px) 0 clamp(3px, 0.7vh, 7px) clamp(4px, 0.4vw, 7px);
	}

	.rev-ladder {
		position: relative;
		left: clamp(-40px, -2.2vw, -14px);
		min-width: 0;
	}

	.rev-table td {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(15px, 2.5vmin, 24px);
		letter-spacing: 0.03em;
	}

	.rev-assumption {
		margin: clamp(8px, 1.4vh, 14px) 0 0;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(9px, 1.55vmin, 13px);
		font-weight: 400;
		line-height: 1.45;
		color: #6b665e;
	}

	.rev-assumption strong {
		font-weight: 600;
		color: #7a5e0f;
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
		row-gap: clamp(10px, 2vh, 18px);
		margin-top: clamp(12px, 3vh, 28px);
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

	.product-shot-1 {
		grid-area: shot1;
	}

	.product-shot-2 {
		grid-area: shot2;
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

	.product-shot img {
		display: block;
		width: auto;
		max-width: 100%;
		height: auto;
		max-height: min(42vh, 320px);
		object-fit: contain;
	}

	/* Slide 7: copy left, two labelled photos stacked on the right. The
	   inner grid fills the stage so the title block sits at mid-height. */
	#s7 {
		justify-content: center;
	}

	.critical-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
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
		flex-direction: column;
		gap: clamp(10px, 1.8vh, 16px);
		width: min(24vw, 270px);
		max-width: 100%;
		min-width: 0;
		max-height: 100%;
		margin-left: clamp(16px, 2.4vw, 36px);
		justify-self: start;
		align-self: center;
	}

	.critical-shot {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0;
		width: 100%;
		min-width: 0;
	}

	.critical-shot img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: contain;
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
	.why-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3px;
		margin-top: clamp(16px, 5vh, 48px);
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

	#s12 .why-card-body strong.hl-gold {
		color: #7a5e0f;
		font-weight: 700;
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

	.team-bio {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(11px, 1.75vmin, 14px);
		font-weight: 500;
		color: #5f584e;
		line-height: 1.5;
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
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		gap: clamp(16px, 3vw, 36px);
		align-items: center;
		width: 100%;
		min-width: 0;
		min-height: 0;
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
		top: clamp(12px, 2.8vh, 28px);
	}

	/* The logo strip is its own row under the copy, so the photo centres against
	   the two cards rather than against the cards plus the logos. */
	.traction-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		grid-template-rows: auto auto;
		column-gap: clamp(20px, 3.6vw, 44px);
		align-items: center;
		/* Rows stay content-sized and the block centres as a whole, so the gap
		   under the cards is the logo margin and nothing else. */
		align-content: center;
		width: 100%;
		flex: 1;
		min-height: 0;
		position: relative;
		top: clamp(12px, 2.8vh, 28px);
	}

	.traction-layout .comp-list {
		margin-top: 0;
		max-width: none;
	}

	/* Wide wordmarks sit at one height; the stacked NYU torch and the Purdue
	   monogram are much taller than they are wide, so they get their own. */
	.comp-unis {
		grid-column: 1;
		grid-row: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(12px, 1.8vw, 22px);
		margin-top: clamp(12px, 2.4vh, 24px);
	}

	.comp-unis img {
		height: clamp(15px, 2.7vmin, 22px);
		width: auto;
		object-fit: contain;
	}

	.comp-unis .uni-purdue {
		height: clamp(24px, 4.4vmin, 36px);
	}

	/* The torch block is narrow, so it needs extra height to carry the same
	   weight as the marks beside it. */
	.comp-unis .uni-nyu {
		height: clamp(34px, 6.4vmin, 54px);
	}

	.traction-figure {
		grid-column: 2;
		grid-row: 1;
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
