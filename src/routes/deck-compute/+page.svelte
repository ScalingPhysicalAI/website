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
	<title>Starforge Robotics - Compute Pitch Deck</title>
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
				<a
					href="https://starforgerobotics.com"
					class="cover-url anim-in anim-d3"
					target="_blank"
					rel="noopener noreferrer">starforgerobotics.com</a
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
			<div class="unitree-layout">
				<div class="unitree-copy">
					<div class="section-label anim-in anim-d1">Market Signal</div>
					<h2 class="headline anim-in anim-d2">
						Unitree: a great candidate for<br />
						<span class="hl-gold">general purpose humanoid</span>
					</h2>
					<div class="bullet-list anim-in anim-d3">
						<div class="bullet-item">
							<span class="bullet-icon">▸</span>
							<p>
								<strong>70–80%</strong> of Unitree's humanoid sales were for research use cases; 20–30%
								for education and entertainment.
							</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon">▸</span>
							<p>
								Unitree opened near <strong>$66B</strong> - 5× its last VC round of $1.9B and ~7× its
								IPO price.
							</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon">▸</span>
							<p>
								Market Signal: developers and researchers are actively choosing open humanoid
								platforms at <strong>massive scale.</strong>
							</p>
						</div>
					</div>
				</div>
				<figure class="unitree-figure anim-in anim-d3">
					<img src="/assets/unitree-humanoid.webp" alt="Unitree general purpose humanoid" />
				</figure>
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
			<div class="product-pair anim-in anim-d3">
				<div class="why-card product-card-1">
					<div class="why-card-line"></div>
					<div class="why-card-num">01</div>
					<p class="why-card-body">
						<strong>Buildo</strong> robot is designed for majority of
						<strong>real-world use cases</strong>.
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

		<!-- SLIDE 7 - CRITICAL PATH -->
		<section class="slide" id="s7">
			<div class="critical-layout">
				<div class="critical-copy">
					<div class="section-label anim-in anim-d1">Product</div>
					<h2 class="headline anim-in anim-d2">
						Solving the <span class="hl-gold">critical path</span><br />
						in humanoid hardware
					</h2>
					<p class="critical-body anim-in anim-d3">
						Humanoid product development follows a <strong>Pareto distribution</strong> - a few
						components drive a significant proportion of a system's performance and cost. In a
						humanoid, the <strong>actuator and dextrous hand</strong> are the critical path.
					</p>
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

		<!-- SLIDE 8 - COMPUTE LAYER -->
		<section class="slide" id="s8">
			<div class="infra-layout">
				<div class="infra-copy">
					<div class="section-label anim-in anim-d1">Platform</div>
					<h2 class="headline anim-in anim-d2">
						Starforge<br />
						<span class="hl-gold">compute layer</span>
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
								<strong>Train and host robot models</strong> for inference - from any size model to
								production deployment.
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

		<!-- SLIDE 9 - DEVELOPER REWARDS -->
		<section class="slide" id="s9">
			<div class="infra-layout">
				<div class="infra-copy">
					<div class="section-label anim-in anim-d1">Ecosystem</div>
					<h2 class="headline anim-in anim-d2">
						Developers earn rewards for<br />
						<span class="hl-gold">building and hosting models</span>
					</h2>
				</div>
				<div class="eco-body anim-in anim-d3">
					<div class="eco-bullets">
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
								Hosting models on the Starforge compute layer generates ongoing revenue for
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
					<figure class="infra-figure">
						<img
							src="/assets/dev-portal-skills.png"
							alt="Starforge /dev skills marketplace"
						/>
					</figure>
				</div>
			</div>
		</section>

		<!-- SLIDE 10 - REVENUE -->
		<section class="slide" id="s10">
			<div class="infra-layout">
				<div class="infra-copy">
					<div class="section-label anim-in anim-d1">Business Model</div>
					<h2 class="headline anim-in anim-d2">
						Revenue <span class="hl-gold">projection</span>
					</h2>
				</div>
				<div class="infra-body anim-in anim-d3">
					<div class="infra-cards">
						<div class="solution-card">
							<div class="solution-card-num">Hardware Sales Revenue</div>
							<p>
								Humanoid robot and training kit sales to researchers, developers, and enterprises
								deploying physical AI in the real world. <strong
									>Recurring hardware upgrade cycles</strong
								> as models improve.<a
									class="citation"
									href="https://x.com/RoboStrategy/status/2087561451468681234"
									target="_blank"
									rel="noopener noreferrer">[2]</a
								>
							</p>
						</div>
						<div class="solution-card">
							<div class="solution-card-num">Compute Revenue</div>
							<p>
								Training and inference hosting on the Starforge compute layer. Compute demand for
								physical intelligence will increase <strong>100× with increasing adoption</strong> - far
								exceeding digital AI today.<a
									class="citation"
									href="https://x.com/a16z/status/2091200032162857328/photo/1"
									target="_blank"
									rel="noopener noreferrer">[3]</a
								>
							</p>
						</div>
					</div>
					<figure class="rev-visuals">
						<figcaption>
							<span class="hl-gold">Robot Unit Sales, Mobility Mix & Token Usage</span>
						</figcaption>
						<img
							src="/assets/robot-sales-token-forecast.png"
							alt="Forecast of robot unit sales by mobility mix and token usage, 2025 to 2028"
						/>
					</figure>
				</div>
			</div>
		</section>

		<!-- SLIDE 11 - COMPETITION -->
		<section class="slide" id="s11">
			<div class="comp-layout">
				<div class="comp-copy">
					<div class="section-label anim-in anim-d1">Competitive Position</div>
					<h2 class="headline anim-in anim-d2">
						How we stand <span class="hl-gold">better</span> than competition
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
									<strong>Costly and open platform</strong> - high barrier to entry for most researchers
									and developers, limiting community growth and data collection scale.
								</p>
							</div>
						</div>
						<div class="comp-item">
							<div class="comp-num">02</div>
							<div class="comp-content">
								<div class="comp-title">
									<a
										href="https://www.figure.ai/"
										target="_blank"
										rel="noopener noreferrer">Figure O3</a
									>
								</div>
								<p class="comp-body">
									<strong>Costly and closed platform</strong> - vertically integrated approach restricts
									the developer ecosystem needed to rapidly advance physical AI models.
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
									Companies using Chinese robots as a wrapper are <strong>sinking ships</strong>.
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
								rel="noopener noreferrer">[4]</a
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

		<!-- SLIDE 12 - WHY STARFORGE -->
		<section class="slide" id="s12">
			<div class="section-label anim-in anim-d1">Competitive Advantage</div>
			<h2 class="headline anim-in anim-d2">Why <span class="hl-gold">Starforge</span></h2>
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

		<!-- SLIDE 13 - TEAM -->
		<section class="slide" id="s13">
			<div class="section-label anim-in anim-d1">Founding Team</div>
			<h2 class="headline anim-in anim-d2">Built by <span class="hl-gold">builders</span></h2>
			<div class="team-grid anim-in anim-d3">
				<div class="team-card">
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
						Ambitious founder with a degree in electronics and communication engineering from Delhi
						Technological University. Aiming for Kardashev Type 2 by 2040, he built Lockheed
						Martin UAVs in college and food robotics at Posha (SF, $8M Accel). Founded Cypherock in 2019,
						the safest crypto hardware wallet, leading it to $600M AUM.
					</div>
				</div>
				<div class="team-card">
					<div class="team-initials">RJ</div>
					<div class="team-name">
						<LinkedInName
							name="Rakshit Jain"
							linkedin="https://www.linkedin.com/in/rakshitjain003/"
						/>
					</div>
					<div class="team-role">Senior Robotics Engineer</div>
					<div class="team-bio">
						With a background of automobile engineering and 5+ years of hands-on product development
						experience across intelligent robotics, aerospace, electric mobility, and multiple patents in
						his name, Rakshit has a strong foundation in turning ideas into mass-manufactured products
						that are sold commercially today.
					</div>
				</div>
				<div class="team-card">
					<div class="team-initials">SS</div>
					<div class="team-name">
						<LinkedInName
							name="Sarthak Mishra"
							linkedin="https://www.linkedin.com/in/sarthak-mishra-ba32501bb/"
						/>
					</div>
					<div class="team-role">Senior Software Engineer</div>
					<div class="team-bio">
						Sarthak is a full-stack software engineer who handles backend architecture, mobile
						applications, and the real-time communication layers that tie hardware to software. He
						previously built software-defined electric vehicles at Mazout Electric, working across
						low-latency teleoperation, embedded systems, and cloud infrastructure. He designs and
						drives the software flow, from device to operator.
					</div>
				</div>
				<div class="team-card">
					<div class="team-initials">AN</div>
					<div class="team-name">
						<LinkedInName
							name="Anay Shiledar"
							linkedin="https://www.linkedin.com/in/anay-shiledar-629036209/"
						/>
					</div>
					<div class="team-role">Electrical Engineer</div>
					<div class="team-bio">
						Anay is a driven electrical engineer from UC Irvine with great skill in embedded
						software and hardware integration. He builds implantable-electronics pipelines at the
						Neuroelectronics Research Lab, codes F1-style race-car firmware for FSAE Electric Racing, and
						designed embedded software and PCBs for a Level 1 rocket.
					</div>
				</div>
				<div class="team-card">
					<div class="team-initials">CE</div>
					<div class="team-name">
						<LinkedInName
							name="Celia Sherman"
							linkedin="https://www.linkedin.com/in/celia-sherman-a85967325/"
						/>
					</div>
					<div class="team-role">Aerospace Engineer</div>
					<div class="team-bio">
						A maths prodigy and an aerospace engineer from the University of Miami. Celia's experience
						varies across composite material manufacturing, thermodynamics, and space robotics. Celia
						also holds NAR Level 1 certification for high powered rocket development.
					</div>
				</div>
				<div class="team-card">
					<div class="team-initials">CS</div>
					<div class="team-name">
						<LinkedInName
							name="Chirag Singla"
							linkedin="https://www.linkedin.com/in/chirag-droid/"
						/>
					</div>
					<div class="team-role">Software Engineer</div>
					<div class="team-bio">
						With a background in electronics and communication engineering, Chirag has experience
						solving the hardest engineering problems in the world, from complex cryptography to writing
						transformer models since the past 5 years. Previously at Cypherock, the safest crypto
						hardware wallet company.
					</div>
				</div>
			</div>
		</section>

		<!-- SLIDE 14 - TRACTION -->
		<section class="slide" id="s14">
			<div class="section-label anim-in anim-d1">Traction</div>
			<h2 class="headline anim-in anim-d2">
				Businesses and developers<br />
				<span class="hl-gold">love our robots</span>
			</h2>
			<div class="comp-list anim-in anim-d3">
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
							Building <strong>lithium ion batteries using robots</strong> - deploying Starforge humanoids
							for real industrial manufacturing tasks.
						</p>
					</div>
				</div>
				<div class="comp-item">
					<div class="comp-num">02</div>
					<div class="comp-content">
						<div class="comp-title">
							<a
								href="https://x.com/aryanmadhaverma"
								target="_blank"
								rel="noopener noreferrer">Aryan Madhav Verma</a
							>
						</div>
						<p class="comp-body">
							Building <strong>industrial warehouses</strong> on the Starforge platform - validating demand
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

		<!-- SLIDE 15 - VISION / ASK -->
		<section class="slide" id="s15">
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
					<strong>Compute demand for physical intelligence will increase 100× with adoption</strong
					>, far exceeding digital AI today.<a
						class="citation"
						href="https://www.prnewswire.com/news-releases/the-space-economy-is-heading-for-1-8-trillion-the-bottleneck-nobody-talks-about-is-getting-there-302830042.html"
						target="_blank"
						rel="noopener noreferrer">[5]</a
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
	/* Used by slides 8 (stacked) and 10 (side by side). */
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
	   .solution-card used on slides 8 and 10. */
	.solution-layout .solution-card p {
		font-size: clamp(13px, 2.4vmin, 17px);
		line-height: 1.65;
	}

	/* Slide 8–10: title sits above centre, stacked copy left, visuals right. */
	#s8,
	#s9,
	#s10,
	#s11,
	#s13 {
		justify-content: flex-start;
		padding-top: clamp(76px, 14vh, 108px);
		padding-bottom: clamp(16px, 3vh, 28px);
	}

	#s8 .section-label,
	#s9 .section-label,
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

	/* Slide 9: bullets wrap in a narrower left column; the skills shot is
	   pinned to the vertical centre of the second bullet. */
	.eco-body {
		display: grid;
		grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
		column-gap: clamp(16px, 3vw, 36px);
		width: 100%;
		min-width: 0;
		align-items: center;
	}

	.eco-bullets {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	.eco-body .bullet-item p {
		max-width: 44ch;
	}

	.rev-visuals {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 0;
		min-height: 0;
		margin: 0;
	}

	.rev-visuals figcaption {
		font-family: 'Bebas Neue', sans-serif;
		font-weight: 500;
		font-size: clamp(16px, 2.6vmin, 24px);
		letter-spacing: 0.04em;
		text-align: center;
		line-height: 1.15;
		margin: 0 0 clamp(8px, 1.4vh, 12px);
		width: 100%;
	}

	.rev-visuals img {
		display: block;
		width: 100%;
		height: auto;
		max-height: min(56vh, 460px);
		object-fit: contain;
		object-position: center;
		background: #ffffff;
	}

	#s10 .infra-body {
		grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr);
		align-items: center;
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

	.critical-copy {
		padding-top: clamp(8px, 2.4vh, 22px);
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
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		padding: clamp(10px, 2.2vh, 20px) clamp(12px, 1.8vw, 22px);
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
	/* ══ MOBILE ══
	   Mirrors /deck: below 900px the 16:9 stage would be a ~220px letterbox, so
	   the carousel gives way to a vertical scroll of full-width slide cards. */
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
		.why-card-body {
			font-size: 15px;
		}

		/* ── Every multi-column layout becomes one column ── */
		.unitree-layout,
		.solution-layout,
		.infra-body,
		#s8 .infra-body,
		#s10 .infra-body,
		.eco-body,
		.critical-layout,
		.why-grid,
		.comp-body-row,
		.product-pair {
			display: flex;
			flex-direction: column;
			gap: clamp(14px, 4vw, 24px);
		}

		.team-grid {
			display: flex;
			flex-direction: column;
			gap: 3px;
		}

		.critical-photos {
			margin-left: 0;
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
