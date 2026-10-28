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
	let videoFrame: HTMLIFrameElement | undefined;

	function pauseVideo() {
		videoFrame?.contentWindow?.postMessage(
			JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
			'*'
		);
	}

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
			if (offset !== 0 && slide.contains(videoFrame ?? null)) pauseVideo();
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
	<title>Starforge Robotics - Seed Round</title>
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
				<span class="slide-counter" id="slideCounter">01 / 14</span>
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

		<!-- 1 · COVER -->
		<section class="slide" id="p1">
			<div class="cover-bg"></div>
			<div class="cover-grid"></div>
			<figure class="cover-figure anim-in anim-d2">
				<img src="/assets/buildo-head.webp" alt="Buildo humanoid robot" />
			</figure>
			<div class="cover-content">
				<div class="cover-tag anim-in anim-d1">Seed Round · 2026</div>
				<h1 class="cover-title anim-in anim-d2">
					Building <span class="hl-gold">Humanoid Robots</span><br />
					for <span class="hl-gold">Autonomous Factories</span>
				</h1>
				<p class="cover-sub anim-in anim-d3">StarForge Robotics</p>
				<div class="cover-divider anim-in anim-d3"></div>
				<a
					href="https://starforgerobotics.com"
					class="cover-url anim-in anim-d3"
					target="_blank"
					rel="noopener noreferrer">starforgerobotics.com</a
				>
			</div>
		</section>

		<!-- 2 · ABOUT FOUNDER -->
		<section class="slide" id="p2">
			<h2 class="headline anim-in anim-d2">About <span class="hl-gold">Founder</span></h2>
			<div class="split anim-in anim-d3">
				<div class="bullet-list plain-list">
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>
							Vipul started building <strong class="hl-gold">Cypherock</strong>, straight out from university (DTU)
						</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>Raised <strong class="hl-gold">$1.5 Million</strong> back in 2021</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>Highest rated hardware wallet in the industry today</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>Currently secure <strong class="hl-gold">$2.2 Billion</strong> in crypto assets</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>Multiple Patents</p>
					</div>
				</div>
				<figure class="split-figure">
					<img src="/assets/pitch/cypherock-wallet.webp" alt="Cypherock hardware wallet" />
				</figure>
			</div>
		</section>

		<!-- 3 · NEXT FRONTIER -->
		<section class="slide" id="p3">
			<h2 class="headline anim-in anim-d2">
				AI changed the digital world <span class="hl-gold">Intelligent Robots</span> will change the physical world
			</h2>
			<div class="frontier-grid anim-in anim-d3">
				<div class="frontier-card">
					<span class="card-num">01</span>
					<span class="card-title">Autonomous Factories</span>
				</div>
				<div class="frontier-card">
					<span class="card-num">02</span>
					<span class="card-title">Build new Cities</span>
				</div>
				<div class="frontier-card">
					<span class="card-num">03</span>
					<span class="card-title">Labour meaning redefined</span>
				</div>
			</div>
			<p class="statement anim-in anim-d3">
				Moving atoms is the <span class="hl-gold">biggest constraint</span> for civilisation level
				progress,<br />
				Humanoids solve it
			</p>
		</section>

		<!-- 4 · MISSING PIECE -->
		<section class="slide" id="p4">
			<h2 class="headline anim-in anim-d2">
				But what's the <span class="hl-gold">missing piece</span>?
			</h2>
			<div class="split anim-in anim-d3">
				<div class="bullet-list plain-list">
                    <div class="bullet-item">
                        <span class="bullet-icon">&#9656;</span>
						<p>We have seen robots dancing and sprinting but not doing any useful work.</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>Algorithms are solved, hardware is solved but robots are still not intelligent</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>
							To build intelligent robot, <strong class="hl-gold">tactile data is missing</strong>
						</p>
					</div>
				</div>
				<figure class="split-figure split-figure-wide">
					<img
						src="/assets/pitch/tactile-latent-space.webp"
						alt="Embedding space with sparse points, showing where tactile data is missing"
					/>
				</figure>
			</div>
		</section>

		<!-- 5 · HOW OTHERS SOLVE IT -->
		<section class="slide" id="p5">
			<h2 class="headline anim-in anim-d2">
				How are frontier labs <span class="hl-gold">solving it</span>?
			</h2>
			<div class="split anim-in anim-d3">
				<div>
					<p class="lead">
						Person wearing <strong>full teleoperation kit</strong> and teleoperating
						<strong>one full robot</strong>
					</p>
					<div class="bullet-list plain-list">
						<div class="bullet-item">
							<span class="bullet-icon mark-no">&#10007;</span>
							<p>Not scalable</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-no">&#10007;</span>
							<p>Very costly</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-no">&#10007;</span>
							<p>Cannot collect data for more than <strong>4 hours straight</strong></p>
						</div>
					</div>
				</div>
				<div class="stat-card">
					<span class="stat-val">$30k</span>
					<span class="stat-label">Training data cost for a single robot skill</span>
				</div>
			</div>
		</section>

		<!-- 6 · HOW WE SOLVE IT -->
		<section class="slide" id="p6">
			<h2 class="headline anim-in anim-d2">
				How we are <span class="hl-gold">solving it</span>?
			</h2>
			<div class="split anim-in anim-d3">
				<div>
					<p class="lead">
                    We replaced the robot with
						<span class="hl-gold">stereo vision glasses</span> and
						<span class="hl-gold">tactile gloves</span>
					</p>
					<div class="bullet-list plain-list compact-list">
						<div class="bullet-item">
							<span class="bullet-icon mark-yes">&#10003;</span>
							<p>Full robot synchronized data collection</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-yes">&#10003;</span>
							<p>Cheap</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-yes">&#10003;</span>
							<p>Person can collect data straight 8+ hours</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-yes">&#10003;</span>
							<p>Highly scalable in India</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-yes">&#10003;</span>
							<p>Patent pending technology</p>
						</div>
					</div>
				</div>
				<figure class="kit-pair">
					<img
						class="kit-glove"
						src="/assets/pitch/tactile-glove.webp"
						alt="Tactile data collection glove"
					/>
					<img
						class="kit-glasses"
						src="/assets/pitch/stereo-glasses.webp"
						alt="Stereo vision glasses"
					/>
				</figure>
			</div>
			<div class="partners anim-in anim-d3">
				<p>
					In partnership with <strong class="hl-gold">20+ data collection companies</strong> across
					India
				</p>
				<div class="partner-logos">
					<img src="/assets/pitch/partner-humyn-labs.webp" alt="humyn labs" />
					<img src="/assets/pitch/partner-m.webp" alt="Data collection partner" />
					<img src="/assets/pitch/partner-wiingy.webp" alt="Wiingy" />
				</div>
			</div>
		</section>

		<section class="slide" id="p7">
			<h2 class="headline anim-in anim-d2">
            Industry is spending billions to build the <span class="hl-gold">GPT equivalent robotic intelligence<span>.
            <br/>
			Starforge will do it in $4 million
			</h2>
			<div class="split anim-in anim-d3">
				<div class="bullet-list compact-list plain-list">
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>
                        Cloud hosted intelligence enables robots to operate across both
							<strong class="hl-gold">digital and physical worlds</strong>
						</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>Consumes less power</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>
							Smaller edge model handles action chunking and real-time feedback
						</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>
							Patent pending technology
						</p>
					</div>
				</div>
				<div class="brain-stack">
					<div class="brain-item brain-item-key">
						<svg class="brain-icon" viewBox="0 0 48 48" aria-hidden="true">
							<path
								d="M14 36h22a9 9 0 0 0 1.2-17.9A12 12 0 0 0 14.4 15 10.5 10.5 0 0 0 14 36Z"
								fill="none"
								stroke="currentColor"
								stroke-width="2.4"
								stroke-linejoin="round"
							/>
						</svg>
						<div class="brain-text">
							<span class="card-num">Cloud</span>
							<span class="card-title">Large model</span>
							<p>Digital and physical work</p>
						</div>
					</div>
					<div class="brain-link" aria-hidden="true"></div>
					<div class="brain-item">
						<svg class="brain-icon" viewBox="0 0 48 48" aria-hidden="true">
							<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round">
								<rect x="13" y="13" width="22" height="22" rx="2" />
								<rect x="19" y="19" width="10" height="10" />
								<path
									d="M19 13V7M29 13V7M19 41v-6M29 41v-6M13 19H7M13 29H7M41 19h-6M41 29h-6"
									stroke-linecap="round"
								/>
							</g>
						</svg>
						<div class="brain-text">
							<span class="card-num">Edge</span>
							<span class="card-title">Smaller model</span>
							<p>Action chunking and real time feedback</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 7 · IN-HOUSE ROBOT -->
		<section class="slide" id="p8">
			<h2 class="headline anim-in anim-d2">
				We have developed the <span class="hl-gold">lowest BOM cost</span> humanoid in the industry
			</h2>
			<div class="split anim-in anim-d3">
				<div class="bullet-list plain-list compact-list">
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p><strong class="hl-gold">No Chinese supplier dependency</strong></p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>In house actuators</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>In house 5 fingered dexterous hands</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>Moved high end GPUs to cloud</p>
					</div>
				</div>
				<figure class="split-figure robot-figure">
					<img src="/assets/pitch/buildo-no-base.webp" alt="Buildo humanoid robot" />
				</figure>
			</div>
		</section>

		<!-- 8 · CLOUD MODELS -->

		<!-- 9 · VIDEO (to come) -->
		<section class="slide" id="p9">
			<h2 class="headline anim-in anim-d2">
            The industry's first <span class="hl-gold">cloud-hosted VTLA model</span> controlling a full humanoid robot
			</h2>
			<div class="video-frame anim-in anim-d2">
				<iframe
					bind:this={videoFrame}
					src="https://www.youtube-nocookie.com/embed/o9j_a-makyA?enablejsapi=1&rel=0&modestbranding=1"
					title="Starforge Robotics video"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
				></iframe>
			</div>
			<div class="video-link anim-in anim-d3">
				<a
					href="https://www.youtube.com/watch?v=o9j_a-makyA"
					target="_blank"
					rel="noopener noreferrer">Watch the demo on YouTube</a
				>
			</div>
		</section>

		<!-- 10 · TEAM -->
		<section class="slide" id="p10">
			<h2 class="headline headline-nowrap anim-in anim-d2">
				Builders who have scaled hardware
				<span class="hl-gold">to $2.2B AUM and mass production</span> before
			</h2>
			<div class="team-groups anim-in anim-d3">
				<div class="team-group team-group-us">
					<div class="advisor-label">US team</div>
					<div class="team-grid">
						<div class="team-card">
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
								Founded Cypherock and scaled the safest crypto hardware wallet to
								<strong>$2.2B AUM</strong>. Leads Buildo from prototype to mass production.
							</div>
						</div>
						<div class="team-card">
							<img class="team-photo" src="/assets/team/chiragm.jpg" alt="" />
							<div class="team-name">
								<LinkedInName
									name="Chirag Madaan"
									linkedin="https://www.linkedin.com/in/appleswiggy/"
								/>
							</div>
							<div class="team-role">Senior Machine Learning Engineer</div>
							<div class="team-bio">
								Pursuing a <strong>master's in robotics at UC San Diego</strong>. Shipped production
								grade machine learning at PayPal and the cryptography securing 10,000+ Cypherock
								devices.
							</div>
						</div>
						<div class="team-card">
							<img class="team-photo" src="/assets/team/anay.jpg" alt="" />
							<div class="team-name">
								<LinkedInName
									name="Anay Shiledar"
									linkedin="https://www.linkedin.com/in/anay-shiledar-629036209/"
								/>
							</div>
							<div class="team-role">Electrical Engineer</div>
							<div class="team-bio">
								Designs neural-interface electronics and firmware at UC Irvine's Neuroelectronics
								Research Lab. Handles Buildo's <strong>embedded&nbsp;software</strong>, board
								bring-up, and hardware integration.
							</div>
						</div>
					</div>
				</div>
				<div class="team-group team-group-in">
					<div class="advisor-label">India team</div>
					<div class="team-grid">
						<div class="team-card">
							<img class="team-photo" src="/assets/team/rakshit.jpg" alt="" />
							<div class="team-name">
								<LinkedInName
									name="Rakshit Jain"
									linkedin="https://www.linkedin.com/in/rakshitjain003/"
								/>
							</div>
							<div class="team-role">Senior Robotics Engineer</div>
							<div class="team-bio">
								Holds multiple patents and has put <strong
									>robotics and aerospace products into mass manufacturing</strong
								>. Owns Buildo's mechanical design and manufacturability.
							</div>
						</div>
						<div class="team-card">
							<img class="team-photo" src="/assets/team/chirag-v4.jpg" alt="" />
							<div class="team-name">
								<LinkedInName
									name="Chirag Singla"
									linkedin="https://www.linkedin.com/in/chirag-droid/"
								/>
							</div>
							<div class="team-role">Software Engineer</div>
							<div class="team-bio">
								Has been writing <strong>transformer models</strong> for five years and shipped the
								cryptography behind Cypherock's hardware wallet. Builds the AI that runs inside the
								robot.
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="advisor-label advisor-label-center anim-in anim-d3">Research advisor</div>
			<div class="advisor-grid advisor-grid-center anim-in anim-d3">
				<div class="team-card">
					<img class="team-photo" src="/assets/team/rohan.jpg" alt="" />
					<div class="team-name">
						<LinkedInName name="Rohan P. Singh" linkedin="https://www.linkedin.com/in/rohanpsingh/" />
					</div>
					<div class="team-role">Research Scientist</div>
					<div class="team-bio">
						Research scientist at Fauna Robotics and co-author of the Fauna Sprout humanoid. Earned
						his <strong>PhD from the University of Tsukuba</strong> and spent over seven years at the
						<strong>CNRS-AIST Joint Robotics Lab</strong> in Japan, building reinforcement learning
						controllers that walk the full-size HRP-5P humanoid over compliant and uneven terrain.
						Published at IEEE Humanoids, ICRA and IEEE Access. Advises on
						<strong>sim-to-real reinforcement learning</strong> for real hardware.
					</div>
				</div>
			</div>
		</section>

		<!-- 11 · UNIT ECONOMICS -->
		<section class="slide" id="p11">
			<h2 class="headline anim-in anim-d2">
				24 hours of <span class="hl-gold">Physical &amp; Digital intelligence</span> = 10x Output
			</h2>
			<div class="price-row anim-in anim-d3">
				<div class="price-card">
					<span class="card-num">Robot rental cost</span>
					<span class="price-val">$600</span>
					<span class="price-unit">per month</span>
				</div>
				<span class="price-op" aria-hidden="true">+</span>
				<div class="price-card">
					<span class="card-num">Cloud model inference cost</span>
					<span class="price-val">$1,900</span>
					<span class="price-unit">per month</span>
				</div>
				<span class="price-op" aria-hidden="true">=</span>
				<div class="price-card price-card-key">
					<span class="card-num">Total robot as service cost</span>
					<span class="price-val">$2,500</span>
					<span class="price-unit">per month</span>
				</div>
			</div>
			<div class="bullet-list plain-list econ-notes anim-in anim-d3">
				<div class="bullet-item">
					<span class="bullet-icon">&#9656;</span>
					<p>
						Inference revenue goes <strong class="hl-gold">70% to Data Collection Partners</strong> and
						<strong class="hl-gold">30% to Model Store</strong>
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">&#9656;</span>
					<p>Manufacturing cost of robot = <strong>$8,000</strong></p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">&#9656;</span>
					<p>Full rental profits starts from <strong>14th month</strong></p>
				</div>
			</div>
		</section>

		<!-- 12 · 2028 PROFITS -->
		<section class="slide" id="p12">
			<h2 class="headline anim-in anim-d2">
				<span class="hl-gold">$150 million</span> annual recurring revenue in 2028
			</h2>
			<dl class="ledger anim-in anim-d3">
				<div class="ledger-row">
					<dt>Data collection phase</dt>
					<dd>12 - 14 months</dd>
				</div>
				<div class="ledger-row">
					<dt>Total revenue per robot per month from 14th Month</dt>
					<dd>$2,500</dd>
				</div>
				<div class="ledger-row">
					<dt>Server cost for A100 80 GB per robot</dt>
					<dd>~ $1,000</dd>
				</div>
				<div class="ledger-row">
					<dt>Cost of 5000 robots to company</dt>
					<dd>$8,000 x 5000 = $40 M</dd>
				</div>
				<div class="ledger-row">
					<dt>Monthly revenue for 5000 robots</dt>
					<dd>$12.5 M</dd>
				</div>
			</dl>
		</section>

		<!-- 13 · ASK -->
		<section class="slide" id="p13">
			<div class="raise-grid anim-in anim-d2">
				<div class="raise-card raise-card-key">
					<span class="raise-val">$4 million <span class="hl-gold">seed</span></span>
					<p>Scaling team, Build intelligence and Initial deployments</p>
				</div>
				<div class="raise-card">
					<span class="raise-val">$50 million <span class="hl-gold">series A</span></span>
					<span class="raise-when">Q1 2027</span>
					<p>Scale deployments to <strong>5000 robots</strong> at least</p>
				</div>
			</div>
			<h2 class="headline thanks anim-in anim-d3">Thank you</h2>
			<div class="ask-footer anim-in anim-d3">
				<a href="https://starforgerobotics.com" target="_blank" rel="noopener noreferrer"
					>starforgerobotics.com</a
				>
			</div>
		</section>

		<!-- APPENDIX -->
		<section class="slide" id="p14">
			<h2 class="headline anim-in anim-d2">Appendix</h2>
			<div class="appendix-head anim-in anim-d3">Revenue math</div>
			<div class="bullet-list appendix-points anim-in anim-d3">
				<div class="bullet-item">
					<span class="bullet-icon">&#9656;</span>
					<p>
						Each robot is offered as a service at <strong>$3,000 per month</strong>: $600 robot rental
						plus $2,400 cloud model usage. Inference revenue is split
						<strong>70% to Data Collection Partners</strong> and <strong>30% to Model Store</strong>.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">&#9656;</span>
					<p>
						The first <strong>12 to 14 months</strong> are the data collection phase. Full rental
						profits start from the 14th month.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">&#9656;</span>
					<p>
						Server cost for an A100 80 GB is <strong>~$1,000 per robot per month</strong>, leaving
						<strong>$2,000 per robot per month</strong> ($3,000 − $1,000).
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">&#9656;</span>
					<p>
						Across <strong>5,000 robots</strong> that is $2,000 × 5,000 = <strong>$10M per month</strong>,
						and $10M × 12 = <strong class="hl-gold">$120M annual recurring profits in 2028</strong>.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">&#9656;</span>
					<p>
						Building the fleet costs $8,000 × 5,000 = <strong>$40M</strong>. The $50M Series A in Q1
						2027 scales deployments to at least 5,000 robots.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">&#9656;</span>
					<p>
						We have <strong>more than 80% BOM control through in-house vertical integration</strong
						>. For mass production, Buildo's actuators and hands will be manufactured in the United
						States.
					</p>
				</div>
				<div class="bullet-item">
					<span class="bullet-icon">&#9656;</span>
					<p>
						We have a <strong>distributed team in New York City and New Delhi</strong>. Our team in
						New Delhi handles data collection and firmware development.
					</p>
				</div>
			</div>
		</section>
	</main>

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

	/* ── SLIDES ──
	   Every content slide is top-anchored so its headline sits at the same
	   position regardless of how much body content follows it. The cover
	   (#p1) and closing/ask (#p13) slides are bookend designs and opt back
	   into vertical centering below. */
	.slide {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding: clamp(72px, 17vh, 118px) clamp(36px, 5vw, 72px) clamp(24px, 6vh, 56px);
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
	.headline {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(22px, 5vmin, 56px);
		font-weight: 500;
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: #141210;
		max-width: none;
		margin-bottom: clamp(10px, 2.6vh, 26px);
	}

	.headline-nowrap {
		white-space: nowrap;
	}

	.hl-gold {
		color: #7a5e0f;
	}

	/* Small Space Mono kicker shared by every card on the deck. */
	.card-num {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.5vmin, 11px);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #7a5e0f;
	}

	.card-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(20px, 4.2vmin, 40px);
		letter-spacing: 0.03em;
		line-height: 1.02;
		color: #141210;
	}

	/* ── COVER ── */
	#p1 {
		justify-content: center;
		background: #f1efeb;
	}

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

	.cover-figure {
		position: absolute;
		top: 0;
		bottom: 0;
		right: clamp(28px, 6.5vw, 118px);
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
		top: clamp(-46px, -4.4vh, -20px);
	}

	.cover-tag {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(10px, 2vmin, 14px);
		letter-spacing: 0.3em;
		color: #7a5e0f;
		text-transform: uppercase;
		margin-bottom: clamp(12px, 3vh, 24px);
	}

	.cover-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(30px, 7.4vmin, 82px);
		font-weight: 500;
		line-height: 1.08;
		letter-spacing: 0.04em;
		color: #141210;
	}

	.cover-sub {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(14px, 2.8vmin, 28px);
		font-weight: 600;
		line-height: 1.55;
		color: rgba(20, 18, 16, 0.82);
		margin-top: clamp(14px, 2.4vmin, 26px);
	}

	.cover-divider {
		width: 40px;
		height: 1px;
		background: #7a5e0f;
		margin: clamp(12px, 3vh, 28px) 0 clamp(8px, 2vh, 16px);
	}

	a.cover-url {
		display: inline-block;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(11px, 2vmin, 15px);
		color: #5f584e;
		letter-spacing: 0.08em;
		text-decoration: none;
	}
	a.cover-url:hover {
		color: #7a5e0f;
	}

	/* ── BULLETS ── */
	.bullet-list {
		margin-top: clamp(16px, 5vh, 36px);
		display: flex;
		flex-direction: column;
		gap: 3px;
		max-width: 820px;
	}

	.bullet-item {
		display: flex;
		align-items: baseline;
		gap: 16px;
		padding: clamp(14px, 3.2vh, 26px) clamp(14px, 2.5vw, 24px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-left: 2px solid rgba(20, 18, 16, 0.2);
	}

	.bullet-icon {
		color: #7a5e0f;
		font-size: 12px;
		flex-shrink: 0;
	}

	.bullet-item p {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(13px, 2.6vmin, 20px);
		font-weight: 500;
		color: #3a3630;
		line-height: 1.6;
	}

	.bullet-item p strong {
		color: #141210;
		font-weight: 700;
	}

	.bullet-item p strong.hl-gold {
		color: #7a5e0f;
	}

	/* Short single-line points read better as plain statements than as boxed
	   cards, the same treatment as the problem slide on the old deck. */
	.plain-list {
		gap: clamp(8px, 2vh, 20px);
	}

	.plain-list .bullet-item {
		padding: clamp(4px, 1vh, 10px) 0;
		background: none;
		border: 0;
	}

	.plain-list .bullet-item p {
		font-size: clamp(14px, 2.7vmin, 22px);
		line-height: 1.45;
	}

	.plain-list .bullet-icon {
		font-size: clamp(13px, 2.2vmin, 18px);
		width: 1.1em;
	}

	.compact-list {
		gap: clamp(2px, 0.8vh, 8px);
		margin-top: clamp(8px, 2vh, 18px);
	}

	.compact-list .bullet-item p {
		font-size: clamp(15px, 3vmin, 25px);
	}

	.mark-yes {
		color: #7a5e0f;
	}

	.mark-no {
		color: rgba(20, 18, 16, 0.38);
	}

	.lead {
		margin-top: clamp(12px, 3vh, 28px);
		font-family: 'Barlow', sans-serif;
		font-size: clamp(15px, 3vmin, 25px);
		font-weight: 500;
		line-height: 1.45;
		color: #3a3630;
		max-width: 34ch;
	}

	.lead strong {
		font-weight: 700;
		color: #141210;
	}

	.lead strong.hl-gold {
		color: #7a5e0f;
	}

	.lead + .bullet-list {
		margin-top: clamp(10px, 2.4vh, 24px);
	}

	/* ── COPY BESIDE A FIGURE ── */
	.split {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: clamp(20px, 4vw, 64px);
		align-items: center;
		width: 100%;
	}

	.split > .bullet-list {
		margin-top: 0;
	}

	.headline + .split {
		margin-top: auto;
	}

	/* Centers a lone .split block (no element after it) in the space below
	   the headline; when another block follows (e.g. #p6), that block picks
	   up its own margin-bottom: auto instead. */
	.split:last-child {
		margin-bottom: auto;
	}

	/* These two are lighter on content, so instead of centering, keep them
	   anchored just under the headline (like #p6) and let the leftover
	   space collect below. */
	#p4 .split,
	#p5 .split {
		margin-top: clamp(16px, 4vh, 40px);
	}

	.split-figure {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		min-width: 0;
	}

	.split-figure img {
		display: block;
		width: auto;
		max-width: 100%;
		max-height: min(58vh, 460px);
		object-fit: contain;
	}

	.split-figure-wide img {
		max-height: min(56vh, 460px);
	}

	.robot-figure img {
		max-height: min(72vh, 740px);
	}

	/* ── FRONTIER ── */
	.frontier-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 3px;
		margin-top: auto;
	}

	.frontier-card {
		display: flex;
		flex-direction: column;
		gap: clamp(8px, 2vh, 18px);
		padding: clamp(18px, 4.4vh, 40px) clamp(16px, 2.2vw, 30px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-top: 2px solid #7a5e0f;
	}

	.statement {
		margin-top: clamp(22px, 5.4vh, 54px);
		margin-bottom: auto;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(15px, 3vmin, 25px);
		font-weight: 500;
		line-height: 1.5;
		color: #3a3630;
	}

	.statement strong {
		font-weight: 700;
		color: #141210;
	}

	/* ── STAT CARD ── */
	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: clamp(6px, 1.4vh, 12px);
		padding: clamp(20px, 5vh, 48px) clamp(18px, 2.6vw, 36px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-top: 2px solid rgba(20, 18, 16, 0.2);
	}

	.stat-val {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(54px, 15vmin, 150px);
		line-height: 0.9;
		color: #141210;
	}

	.stat-label {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8.5px, 1.6vmin, 12px);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #5f584e;
	}

	/* ── DATA KIT ── */
	#p6 {
		padding-bottom: clamp(10px, 2.4vh, 24px);
	}

	#p6 .lead {
		margin-top: clamp(4px, 1.4vh, 14px);
		font-size: clamp(17px, 3.4vmin, 30px);
	}

	.kit-pair {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: clamp(4px, 1vh, 10px);
		margin: 0;
		min-width: 0;
	}

	.kit-pair img {
		display: block;
		width: auto;
		max-width: 100%;
		object-fit: contain;
	}

	.kit-glove {
		max-height: min(42vh, 370px);
	}

	.kit-glasses {
		max-height: min(26vh, 220px);
	}

	.partners {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: clamp(16px, 3vw, 40px);
		margin-top: clamp(6px, 1.6vh, 16px);
		margin-bottom: auto;
		padding-top: clamp(6px, 1.6vh, 14px);
		border-top: 1px solid rgba(20, 18, 16, 0.1);
	}

	.partners p {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(13px, 2.5vmin, 20px);
		font-weight: 500;
		color: #3a3630;
	}

	.partners strong {
		font-weight: 700;
	}

	.partner-logos {
		display: flex;
		align-items: center;
		gap: clamp(12px, 2vw, 28px);
		flex-shrink: 0;
	}

	.partner-logos img {
		display: block;
		height: clamp(30px, 7vmin, 64px);
		width: auto;
		object-fit: contain;
	}

	/* ── DUAL BRAIN ── */
	.brain-stack {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		min-width: 0;
	}

	#p8 .bullet-item p {
		font-size: clamp(15px, 3vmin, 26px);
	}

	.brain-item {
		display: flex;
		align-items: center;
		gap: clamp(14px, 2vw, 28px);
		color: rgba(20, 18, 16, 0.55);
	}

	.brain-item-key {
		color: #7a5e0f;
	}

	.brain-icon {
		flex-shrink: 0;
		width: clamp(52px, 11vmin, 112px);
		height: clamp(52px, 11vmin, 112px);
	}

	.brain-text {
		display: flex;
		flex-direction: column;
		gap: clamp(4px, 1vh, 10px);
	}

	.brain-text .card-title {
		font-size: clamp(24px, 5.4vmin, 54px);
	}

	.brain-text p {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(14px, 2.7vmin, 22px);
		font-weight: 500;
		color: #5f584e;
	}

	.brain-link {
		margin-left: calc(clamp(52px, 11vmin, 112px) / 2 - 1px);
		width: 2px;
		height: clamp(28px, 8vh, 80px);
		margin-top: clamp(6px, 1.4vh, 14px);
		margin-bottom: clamp(6px, 1.4vh, 14px);
		background: repeating-linear-gradient(
			180deg,
			#7a5e0f 0 5px,
			transparent 5px 10px
		);
	}

	/* ── VIDEO ── */
	.video-frame {
		width: min(100%, calc((min(100vh, 100vw * 9 / 16) - 260px) * 16 / 9));
		aspect-ratio: 16 / 9;
		margin: auto auto 0;
		background: #141210;
	}

	.video-frame iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.video-link {
		margin-top: clamp(10px, 2vh, 20px);
		margin-bottom: auto;
		text-align: center;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(10.5px, 1.95vmin, 14px);
		letter-spacing: 0.08em;
	}

	.video-link a {
		color: #7a5e0f;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: rgba(20, 18, 16, 0.82);
	}

	.video-link a:hover {
		text-decoration-color: #7a5e0f;
	}

	/* ── TEAM ── */
	#p10 {
		padding-bottom: clamp(16px, 3.4vh, 32px);
	}

	.team-groups {
		display: grid;
		grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
		gap: clamp(10px, 1.4vw, 20px);
		margin-top: auto;
	}

	.team-group {
		display: flex;
		flex-direction: column;
	}

	.team-group .team-grid {
		flex: 1;
		margin-top: clamp(5px, 1.1vh, 12px);
	}

	.team-group-us .team-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.team-group-in .team-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.team-grid {
		display: grid;
		gap: 3px;
	}

	.advisor-label {
		margin-top: clamp(8px, 1.7vh, 20px);
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(9px, 1.5vh, 12.5px);
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #7a5e0f;
	}

	.team-group .advisor-label {
		margin-top: 0;
	}

	/* One advisor, held to the width of a single US card pair so the row does
	   not stretch across the whole stage. */
	.advisor-grid {
		display: grid;
		grid-template-columns: minmax(0, 0.5fr);
		gap: 3px;
		margin-top: clamp(5px, 1.1vh, 12px);
	}

	.advisor-label-center {
		width: 100%;
		text-align: center;
	}

	.advisor-grid-center {
		width: 100%;
		justify-content: center;
		margin-bottom: auto;
	}

	.advisor-grid .team-card {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		grid-template-areas:
			'photo name'
			'photo role'
			'photo bio';
		column-gap: clamp(9px, 1vw, 14px);
	}

	.advisor-grid .team-photo {
		grid-area: photo;
		align-self: start;
		margin-bottom: 0;
	}

	.advisor-grid .team-name {
		grid-area: name;
	}

	.advisor-grid .team-role {
		grid-area: role;
	}

	.advisor-grid .team-bio {
		grid-area: bio;
	}

	.team-card {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		padding: clamp(10px, 1.7vh, 22px) clamp(12px, 1.3vw, 20px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-top: 2px solid rgba(20, 18, 16, 0.15);
	}

	.team-photo {
		width: clamp(36px, 6vh, 64px);
		height: clamp(36px, 6vh, 64px);
		flex-shrink: 0;
		border: 2px solid rgba(20, 18, 16, 0.175);
		border-radius: 50%;
		object-fit: cover;
		margin-bottom: clamp(6px, 1.2vh, 14px);
	}

	.team-name {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(14px, 2.2vh, 22px);
		font-weight: 600;
		color: #141210;
	}

	.team-role {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8.5px, 1.35vh, 13px);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #7a5e0f;
		margin-top: 4px;
		margin-bottom: clamp(5px, 1.1vh, 12px);
	}

	.team-bio {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(10.5px, 1.72vh, 17px);
		font-weight: 500;
		color: #5f584e;
		line-height: 1.45;
		hyphens: auto;
		-webkit-hyphens: auto;
		text-wrap: pretty;
	}

	.team-bio strong {
		font-weight: 700;
		color: #141210;
	}

	/* ── UNIT ECONOMICS ── */
	.price-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: center;
		gap: clamp(8px, 1.4vw, 20px);
		margin-top: auto;
	}

	.price-card {
		display: flex;
		flex-direction: column;
		gap: clamp(2px, 0.6vh, 6px);
		padding: clamp(8px, 1.8vh, 18px) clamp(14px, 2vw, 28px);
		background: rgba(20, 18, 16, 0.044);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-top: 2px solid rgba(20, 18, 16, 0.2);
	}

	.price-card-key {
		border-top-color: #7a5e0f;
		background: rgba(122, 94, 15, 0.07);
	}

	.price-val {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(34px, 9vmin, 92px);
		line-height: 0.95;
		color: #141210;
	}

	.price-card-key .price-val {
		color: #7a5e0f;
	}

	.price-unit {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.1vmin, 16px);
		font-weight: 500;
		color: #5f584e;
	}

	.price-op {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(28px, 6vmin, 60px);
		color: rgba(20, 18, 16, 0.4);
	}

	.econ-notes {
		max-width: none;
		margin-top: clamp(14px, 3.4vh, 34px);
		margin-bottom: auto;
		gap: clamp(2px, 0.8vh, 8px);
	}

	.econ-notes .bullet-item p {
		font-size: clamp(15px, 3vmin, 26px);
	}

	/* ── 2028 PROFITS ── */
	.ledger {
		margin: auto 0;
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 1320px;
		border-top: 2px solid rgba(20, 18, 16, 0.2);
	}

	.ledger-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: clamp(16px, 3vw, 48px);
		padding: clamp(12px, 2.8vh, 26px) 0;
		border-bottom: 1px solid rgba(20, 18, 16, 0.1);
	}

	.ledger-row dt {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(16px, 3.2vmin, 28px);
		font-weight: 500;
		color: #3a3630;
	}

	.ledger-row dd {
		margin: 0;
		font-family: 'Space Mono', monospace;
		font-weight: 400;
		font-size: clamp(15px, 3vmin, 26px);
		letter-spacing: 0.02em;
		color: #141210;
		white-space: nowrap;
	}

	/* ── ASK ── */
	#p13 {
		justify-content: center;
		background:
			radial-gradient(ellipse 60% 80% at 90% 50%, rgba(20, 18, 16, 0.025) 0%, transparent 60%),
			#f1efeb;
	}

	.raise-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 3px;
		width: 100%;
		max-width: 1320px;
	}

	.raise-card {
		display: flex;
		flex-direction: column;
		gap: clamp(6px, 1.4vh, 14px);
		padding: clamp(18px, 4.4vh, 42px) clamp(18px, 2.4vw, 34px);
		background: rgba(255, 255, 255, 0.7);
		border: 2px solid rgba(20, 18, 16, 0.05);
		border-top: 2px solid rgba(20, 18, 16, 0.2);
	}

	.raise-card-key {
		border-top-color: #7a5e0f;
	}

	.raise-val {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(30px, 7.4vmin, 76px);
		line-height: 1;
		letter-spacing: 0.02em;
		color: #141210;
	}

	.raise-when {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(9px, 1.7vmin, 13px);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #7a5e0f;
	}

	.raise-card p {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(14px, 2.7vmin, 22px);
		font-weight: 500;
		line-height: 1.45;
		color: #3a3630;
	}

	.raise-card p strong {
		font-weight: 700;
		color: #141210;
	}

	.thanks {
		margin-top: clamp(26px, 6.4vh, 64px);
		font-size: clamp(30px, 7vmin, 72px);
	}

	.ask-footer {
		margin-top: clamp(6px, 1.4vh, 14px);
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(10.5px, 1.95vmin, 13px);
		color: #5f584e;
		letter-spacing: 0.08em;
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

	/* ── APPENDIX ── */
	.appendix-head {
		margin-top: auto;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.5vmin, 11px);
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #7a5e0f;
	}

	.appendix-points {
		margin-top: clamp(8px, 1.8vh, 18px);
		margin-bottom: auto;
		max-width: none;
		gap: clamp(6px, 1.4vh, 14px);
	}

	#p14 .bullet-item {
		padding: clamp(4px, 1vh, 9px) 0;
		background: none;
		border: 0;
	}

	#p14 .bullet-item p {
		max-width: 1320px;
		font-size: clamp(13px, 2.6vmin, 20px);
		line-height: 1.5;
	}

	#p14 .bullet-icon {
		font-size: 15px;
	}

	/* ── EXPORT ── */
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

	/* ══ MOBILE ══
	   Below 900px the deck stops being a carousel and every slide becomes a
	   full-width card of its own height, the same as the old deck. */
	@media screen and (max-width: 900px) {
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

		.video-frame {
			width: 100%;
		}

		:global(.slide .anim-in) {
			opacity: 1 !important;
			transform: none !important;
			animation: none !important;
		}

		.cover-content {
			top: 0;
		}

		.headline {
			font-size: clamp(26px, 7.4vw, 38px);
		}

		.cover-title {
			font-size: clamp(30px, 9vw, 46px);
		}

		.cover-title br,
		.statement br {
			display: none;
		}

		.bullet-item p,
		.plain-list .bullet-item p,
		.compact-list .bullet-item p,
		.econ-notes .bullet-item p,
		#p8 .bullet-item p,
		.lead,
		#p6 .lead,
		.statement,
		.partners p,
		.raise-card p,
		.ledger-row dt {
			font-size: 16px;
		}

		.split,
		.frontier-grid,
		.team-groups,
		.raise-grid {
			display: flex;
			flex-direction: column;
			align-items: stretch;
			gap: 20px;
		}

		.split-figure img,
		.robot-figure img {
			max-height: 42vh;
		}

		.cover-figure {
			position: static;
			justify-content: center;
			margin: 0 0 20px;
		}

		.cover-figure img {
			max-width: 78%;
			height: auto;
		}

		.partners {
			flex-direction: column;
			align-items: flex-start;
		}

		.team-group-us .team-grid,
		.team-group-in .team-grid,
		.advisor-grid {
			grid-template-columns: minmax(0, 1fr);
		}

		.price-row {
			display: flex;
			flex-direction: column;
			align-items: stretch;
			gap: 6px;
		}

		.price-op {
			align-self: center;
		}

		.ledger-row {
			flex-direction: column;
			gap: 4px;
		}

		.ledger-row dd {
			white-space: normal;
		}
	}

	@media print {
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
