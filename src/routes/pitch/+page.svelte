<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import LinkedInName from '$lib/components/LinkedInName.svelte';
	import { hideZohoChat } from '$lib/utils/zohoChat';

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

	// The demo cue points at the video slide, which is the next slide on the
	// carousel but a scroll away once the deck is stacked.
	function goToDemo() {
		if (stacked) {
			document.getElementById('p9')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			return;
		}
		nextSlide();
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

		const restoreChat = hideZohoChat();

		return () => {
			document.removeEventListener('keydown', handleKey);
			stackedQuery.removeEventListener('change', syncMode);
			document.body.style.overflow = '';
			restoreChat();
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
				background: var(--deck-bg) !important;
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
			/* Zoho SalesIQ's float button and GDPR consent banner are both
			   position: fixed, so a print engine repeats them on every
			   page unless they're force-hidden here. */
			#zsiqwidget,
			#consent_container {
				display: none !important;
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
				<img src="/assets/logo-wordmark.png" alt="Starforge" class="nav-logo-img" />
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
				<!-- <img src="/assets/buildo-head.webp" alt="Buildo humanoid robot" /> -->
			</figure>
			<div class="cover-content">
				<div class="cover-tag anim-in anim-d1">Seed Round · 2026</div>
				<h1 class="cover-title anim-in anim-d2">
					Building <span class="hl-gold">Autonomous Rockets</span>
                    <br/>for orbital data centers
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
							Vipul started building <strong class="hl-gold">Cypherock</strong>, straight out from
							university (DTU)
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
            Robots and AI are the biggest drivers for <span class="hl-gold">data centers</span>
			</h2>
			<div class="split split-chart anim-in anim-d3">
				<div class="frontier-grid frontier-stack">
					<div class="frontier-card">
						<span class="card-num">01</span>
						<span class="card-title">Agents already out-consume people</span>
					</div>
					<div class="frontier-card">
						<span class="card-num">02</span>
						<span class="card-title">Robots are agents with bodies</span>
					</div>
					<div class="frontier-card">
						<span class="card-num">03</span>
						<span class="card-title">All of it runs in the cloud</span>
					</div>
				</div>
				<figure class="split-figure chart-figure">
					<img
						src="/assets/pitch/agentic-token-growth.webp"
						alt="7-day average token usage on OpenRouter by type: agentic tokens overtake human tokens in February 2026 and reach 7.3 trillion, a 14x increase in a year"
					/>
				</figure>
			</div>
			<p class="statement anim-in anim-d3">
				Compute demand has decoupled from population &mdash; it now scales with the number of
				<span class="hl-gold">machines</span>, and that curve has no ceiling.
			</p>
		</section>
		<!-- 4 · MISSING PIECE -->
		<section class="slide" id="p4">
			<h2 class="headline anim-in anim-d2">
				But there is a <span class="hl-gold">bottleneck</span>
			</h2>
			<div class="split anim-in anim-d3">
				<div class="bullet-list plain-list">
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>AI data centers are facing environmental and power supply issues.</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>GPU chips face stringent export controls, limiting their deployment outside the US for offshore data centers.</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>
							<span class="hl-gold">Data centers in sun synchronous orbit</span> solve it but industry does not have launch systems that can bring down the cost of payload to orbit.
						</p>
					</div>
				</div>
				<figure class="split-figure split-figure-wide">
					<!--
					<img
						src="/assets/pitch/tactile-latent-space.webp"
						alt="Embedding space with sparse points, showing where tactile data is missing"
					/> -->
				</figure>
			</div>
		</section>

		<!-- 5 · HOW OTHERS SOLVE IT -->
		<section class="slide" id="p5">
			<h2 class="headline anim-in anim-d2">
				How frontier space tech companies are <span class="hl-gold">solving it</span>?
			</h2>
			<div class="split anim-in anim-d3">
				<div>
					<p class="lead">
						Building large reusable rockets that carry most compute payload in a single launch
					</p>
					<div class="bullet-list plain-list">
						<div class="bullet-item">
							<span class="bullet-icon mark-no">&#10007;</span>
							<p>Can not be automated</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-no">&#10007;</span>
							<p>Very costly</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-no">&#10007;</span>
							<p>Large development time</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 6 · HOW WE SOLVE IT -->
		<section class="slide" id="p5">
			<h2 class="headline anim-in anim-d2">
				How are we <span class="hl-gold">solving it</span>?
			</h2>
			<div class="split anim-in anim-d3">
				<div>
					<p class="lead">
						Producing medium lift rockets where the <span class="hl-gold"
							>upper stage stack together</span> in orbit to become data center itself
					</p>
					<div class="bullet-list plain-list compact-list">
						<div class="bullet-item">
							<span class="bullet-icon mark-yes">&#10003;</span>
							<p>Full autonomous production</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-yes">&#10003;</span>
							<p>No re-entry heat shield required</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-yes">&#10003;</span>
							<p>Brings the payload cost to orbit under $100/kg</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-yes">&#10003;</span>
							<p>Patent pending technology</p>
						</div>
					</div>
				</div>
				<figure class="stack-pair">
					<img
						class="stack-rocket"
						src="/assets/pitch/starforge-orbital-cut.webp"
						alt="Starforge medium lift rocket with deployed solar arrays"
					/>
				</figure>
				<!--
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
			</div> -->
			</div>
		</section>

		<!-- 7 · ROCKETS ARE ROBOTS -->
		<section class="slide" id="p1">
			<h2 class="headline anim-in anim-d2">
				rapid reusable <span class="hl-gold">autonomous rockets</span>
			</h2>

			<div class="split anim-in anim-d3">
				<div>
					<div class="bullet-list plain-list compact-list">
						<div class="bullet-item">
							<span class="bullet-icon mark-no">&#10007;</span>
							<p>
								Starship's arm-based catch systems carry higher landing-site risk — they require
								extreme precision when targeting a fixed catch point on the tower
							</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-yes">&#10003;</span>
							<p>
								StarForge rockets land on legs atop our <span class="hl-gold"
									>patent-pending mobile platform</span> with movable top surface
							</p>
						</div>
						<div class="bullet-item">
							<span class="bullet-icon mark-yes">&#10003;</span>
							<p>
								The platform transports the vehicle by road to a refueling launch tower for rapid
								turnaround and refueling
							</p>
						</div>
					</div>
				</div>
				<figure class="pad-figure">
					<img
						src="/assets/pitch/starforge-launch-pad-cut.webp"
						alt="Starforge rocket on its autonomous launch pad alongside the integration tower"
					/>
				</figure>
			</div>
		</section>

<!--
		<section class="slide" id="p1">
			<h2 class="headline anim-in anim-d2">
				We developed our <span class="hl-gold">FFSC engine in-house</span> - holy grail for reusability
			</h2>

			<div class="split anim-in anim-d3">
            </div>
		</section>
        -->



		<!-- 8 · PAYLOAD COST -->
		<section class="slide" id="p9b">
			<h2 class="headline anim-in anim-d2">
				With autonomous manufacturing at scale, fuel cost becomes the
				<span class="hl-gold">payload cost to orbit</span>
			</h2>
			<div class="cost-table-wrap anim-in anim-d3">
				<table class="cost-table">
					<thead>
						<tr>
							<th>Company</th>
							<th>Rocket</th>
							<th>LEO Payload</th>
							<th>Payload Cost to LEO</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>SpaceX</td>
							<td>Starship V3</td>
							<td>~100 t</td>
							<td>&lt; $185/kg target</td>
						</tr>
						<tr>
							<td>SpaceX</td>
							<td>Falcon Heavy</td>
							<td>Up to 63.8 t*</td>
							<td>~$1,400/kg</td>
						</tr>
						<tr>
							<td>Blue Origin</td>
							<td>New Glenn</td>
							<td>45 t</td>
							<td>~$1,500–2,450/kg</td>
						</tr>
						<tr>
							<td>SpaceX</td>
							<td>Falcon 9</td>
							<td>Up to 22.8 t*</td>
							<td>~$2,700/kg</td>
						</tr>
						<tr>
							<td>Rocket Lab</td>
							<td>Neutron</td>
							<td>13 t</td>
							<td>~$5,385/kg</td>
						</tr>
						<tr>
							<td>Rocket Lab</td>
							<td>Electron</td>
							<td>300 kg</td>
							<td>~$29,000/kg</td>
						</tr>
						<tr class="cost-row-ours">
							<td>StarForge</td>
							<td>Forge 1</td>
							<td>600 kg</td>
							<td>&lt; $100/kg</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<section class="slide" id="p1">
			<h2 class="headline anim-in anim-d2">
                We already have the best workforce that <span class="hl-gold">weld, assemble and operate machines</span> 24x7
			</h2>
			<button class="demo-cue anim-in anim-d3" type="button" onclick={goToDemo}>
				Watch demo
				<svg
					class="demo-cue-arrow"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					><line x1="4" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg
				>
			</button>
		</section>

		<!-- 8 · CLOUD MODELS -->

		<!-- 9 · VIDEO (to come) -->
		<section class="slide" id="p9">
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
				<span class="hl-gold">to mass production and $2.2B AUM</span>
			</h2>
			<div class="team-rows anim-in anim-d3">
				<div class="team-grid team-row-lead">
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
							Founded Cypherock and scaled his crypto hardware wallet to
							<strong>$2.2B AUM</strong>. Led robot development from prototype to mass
							production.
						</div>
					</div>
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
							Holds multiple patents and has put robotics and aerospace products into mass
							manufacturing. Owns mechanical design and manufacturability of robots and launch vehicle.
						</div>
					</div>
					<div class="team-card">
						<img class="team-photo" src="/assets/team/muskan.jpg" alt="" />
						<div class="team-name">
							<LinkedInName
								name="Muskan Kalra"
								linkedin="https://www.linkedin.com/in/muskan-kalra/"
							/>
						</div>
						<div class="team-role">Ecosystem &amp; Growth</div>
						<div class="team-bio">
							Ex-operator at Vana, scaled builder ecosystems <strong>from 0 to 1</strong> across AI and
							crypto. Writes a widely followed physical AI thesis mapping the robotics market.
						</div>
					</div>
					<div class="team-card">
						<img class="team-photo" src="/assets/team/austin.jpg" alt="" />
						<div class="team-name">
							<LinkedInName
								name="Austin Sennott"
								linkedin="https://www.linkedin.com/in/austinsennott/"
							/>
						</div>
						<div class="team-role">Propulsion Engineer</div>
						<div class="team-bio">
							Propulsion engineer at <strong>Relativity Space</strong>. Co-founded Half Cat Rocketry
							and open-sourced Mojave Sphinx, now built by teams worldwide.
						</div>
					</div>
				</div>
                <!--
				<div class="team-grid team-row-rest">
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
							Designed neural-interfaces at UC Irvine's Neuroelectronics Research Lab. Developing
							the robot's edge model and stress-testing it in real environments.
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
						<div class="team-role">Machine Learning Engineer</div>
						<div class="team-bio">
							Pursuing <strong>Master's in robotics at UC San Diego</strong>. Shipped machine
							learning models at PayPal and architected security protocols protecting 60,000+
							Cypherock devices.
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
							Established server infrastructure behind Cypherock's hardware wallet. Building the
							cloud intelligence behind Starforge robots.
						</div>
					</div>
				</div>
                -->
			</div>
			<!--
			<div class="partners team-partners anim-in anim-d3">
				<div class="partner-logos">
					<img class="logo-prominent" src="/assets/pitch/cypherock-logo.svg" alt="Cypherock" />
					<img
						class="logo-prominent"
						src="/assets/pitch/lockheed-martin-logo.svg"
						alt="Lockheed Martin"
					/>
					<img
						class="logo-dtu"
						src="/assets/pitch/dtu-logo.png"
						alt="Delhi Technological University"
					/>
					<img class="logo-posha" src="/assets/pitch/posha-logo.png" alt="POSHA" />
					<img src="/assets/pitch/paypal-logo.svg" alt="PayPal" />
					<img class="logo-compact" src="/assets/uni/ucsd.png" alt="UC San Diego" />
					<img class="logo-compact" src="/assets/uni/uci.png" alt="UC Irvine" />
					<img src="/assets/pitch/iiit-delhi-logo.svg" alt="IIIT Delhi" />
					<img src="/assets/pitch/amazon-logo.svg" alt="Amazon" />
				</div>
			</div>
            -->
		</section>

		<!-- 12 · 2028 PROFITS -->
		<section class="slide" id="p12">
			<h2 class="headline anim-in anim-d2">
				<span class="hl-gold">$18 million</span> monthly recurring revenue in 2028
			</h2>
			<dl class="ledger anim-in anim-d3">
				<div class="ledger-row">
					<dt>Payload capacity per launch</dt>
					<dd>500 kg</dd>
				</div>
				<div class="ledger-row">
					<dt>Payload to SSO per month-long campaign</dt>
					<dd>~ 90,000 kg</dd>
				</div>
				<div class="ledger-row">
					<dt>Propellant cost per launch</dt>
					<dd>~ $20,000</dd>
				</div>
				<div class="ledger-row">
					<dt>Propellant cost per kg to SSO, excluding electricity and site operations</dt>
					<dd>~ $40 / kg</dd>
				</div>
				<div class="ledger-row">
					<dt>Contribution profit per kg</dt>
					<dd>~ $100 / kg</dd>
				</div>
			</dl>
		</section>

		<!-- 12b · PATENTS & PARTNERSHIPS -->
		<section class="slide" id="p15">
			<h2 class="headline anim-in anim-d2">
				<span class="hl-gold">Patents and partnerships</span> already in place
			</h2>
			<div class=" anim-in anim-d3">
				<div class="bullet-list plain-list">
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>Multiple patents on our core technology</p>
					</div>
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>
							Partnerships cracked with <strong class="hl-gold">Starcloud</strong> and other satellite
							companies building orbital data centers (ODCs)
						</p>
					</div>
				</div>
			</div>
			<div class="partners partners-center anim-in anim-d3">
				<div class="partner-logos">
					<img class="logo-starcloud" src="/assets/pitch/starcloud-logo.svg" alt="Starcloud" />
					<img class="logo-axiom" src="/assets/pitch/axiom-logo.svg" alt="Axiom Space" />
					<img class="logo-planet" src="/assets/pitch/planet-logo.svg" alt="Planet Labs" />
				</div>
			</div>
		</section>

		<!-- 13 · ASK -->
		<section class="slide" id="p13">
			<div class="ask-card anim-in anim-d2">
				<span class="ask-tag">Seed round · 2026</span>
				<p class="ask-why">
					To scale team and build <strong class="hl-gold">autonomous rockets</strong> for orbital data centers
				</p>
			</div>
			<h2 class="ask-thanks anim-in anim-d3">Thank you</h2>
			<div class="ask-footer anim-in anim-d3">
				<a href="https://starforgerobotics.com" target="_blank" rel="noopener noreferrer"
					>starforgerobotics.com</a
				>
			</div>
		</section>

		<section class="slide" id="p14">
			<h2 class="headline anim-in anim-d2">
				Appendix 1: Our humanoid is designed to automate both physical and digital work across
				factory environments
			</h2>
			<div class="anim-in anim-d3">
				<div class="bullet-list plain-list compact-list">
					<div class="bullet-item">
						<span class="bullet-icon">&#9656;</span>
						<p>No Chinese supplier dependency</p>
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
	/* Theme tokens: warm near-black ground, off-white ink, amber accent —
	   matching the seed-deck artifact. */
	:global(:root) {
		--deck-bg: #0d0c0a;
		--deck-ink: #f0ece1;
		--deck-ink-2: #c5c2ba;
		--deck-muted: #948e83;
		--deck-micro: #6f6b62;
		--deck-accent: #ffb000;
		--deck-rule: rgba(240, 236, 225, 0.12);
		--deck-rule-strong: rgba(240, 236, 225, 0.22);
		--deck-fill: rgba(240, 236, 225, 0.045);
	}

	:global(html),
	:global(body) {
		height: 100%;
	}

	:global(body) {
		background: var(--deck-bg);
		color: var(--deck-ink);
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
		background: var(--deck-bg);
	}

	.deck-stage {
		position: relative;
		width: min(100vw, calc(100vh * (16 / 9)));
		height: min(100vh, calc(100vw * (9 / 16)));
		aspect-ratio: 16 / 9;
		background: var(--deck-bg);
		overflow: hidden;
		box-shadow:
			0 0 0 1px rgba(240, 236, 225, 0.06),
			0 40px 120px rgba(0, 0, 0, 0.5);
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
		background: rgba(13, 12, 10, 0.92);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(240, 236, 225, 0.06);
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
		height: 46px;
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
		background: var(--deck-rule-strong);
		cursor: pointer;
		transition:
			background 0.3s,
			transform 0.2s;
	}
	:global(.nav-dot:hover) {
		background: var(--deck-muted);
		transform: scale(1.2);
	}
	:global(.nav-dot.active) {
		background: var(--deck-accent);
		transform: scale(1.3);
	}

	.slide-counter {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		color: var(--deck-micro);
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
		border: 2px solid rgba(240, 236, 225, 0.15);
		color: var(--deck-accent);
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.2s;
	}
	.print-btn:hover {
		background: rgba(240, 236, 225, 0.04);
		border-color: rgba(240, 236, 225, 0.82);
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
		background: rgba(240, 236, 225, 0.07);
		border: 2px solid rgba(240, 236, 225, 0.075);
		color: var(--deck-muted);
		cursor: pointer;
		transition: all 0.2s;
	}
	.arrow:hover {
		color: var(--deck-accent);
		border-color: rgba(240, 236, 225, 0.82);
		background: rgba(240, 236, 225, 0.15);
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
		padding: clamp(76px, 18vh, 126px) clamp(40px, 6.4vw, 108px) clamp(32px, 7vh, 66px);
		opacity: 0;
		transform: translateX(100%);
		pointer-events: none;
		transition:
			opacity 0.5s ease,
			transform 0.5s ease;
		background: var(--deck-bg);
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
		color: var(--deck-ink);
		max-width: none;
		margin-bottom: clamp(16px, 4.2vh, 46px);
	}

	.headline-nowrap {
		white-space: nowrap;
	}

	.hl-gold {
		color: var(--deck-accent);
	}

	/* Small Space Mono kicker shared by every card on the deck. */
	.card-num {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.5vmin, 11px);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--deck-accent);
	}

	.card-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(20px, 4.2vmin, 40px);
		letter-spacing: 0.03em;
		line-height: 1.02;
		color: var(--deck-ink);
	}

	/* ── COVER ── */
	#p1 {
		justify-content: center;
		background: var(--deck-bg);
	}

	.cover-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(
				90deg,
				rgb(13, 12, 10) 0%,
				rgb(13, 12, 10) 32%,
				rgba(13, 12, 10, 0.95) 44%,
				rgba(13, 12, 10, 0.9) 60%,
				rgba(13, 12, 10, 0.88) 100%
			),
			radial-gradient(ellipse 70% 60% at 80% 50%, rgba(240, 236, 225, 0.03) 0%, transparent 70%),
			radial-gradient(ellipse 40% 70% at 10% 80%, rgba(240, 236, 225, 0.015) 0%, transparent 60%),
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
			linear-gradient(rgba(240, 236, 225, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(240, 236, 225, 0.03) 1px, transparent 1px);
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
		color: var(--deck-accent);
		text-transform: uppercase;
		margin-bottom: clamp(12px, 3vh, 24px);
	}

	.cover-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(30px, 7.4vmin, 82px);
		font-weight: 500;
		line-height: 1.08;
		letter-spacing: 0.04em;
		color: var(--deck-ink);
	}

	.cover-sub {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(14px, 2.8vmin, 28px);
		font-weight: 600;
		line-height: 1.55;
		color: rgba(240, 236, 225, 0.82);
		margin-top: clamp(14px, 2.4vmin, 26px);
	}

	.cover-divider {
		width: 40px;
		height: 1px;
		background: var(--deck-accent);
		margin: clamp(12px, 3vh, 28px) 0 clamp(8px, 2vh, 16px);
	}

	a.cover-url {
		display: inline-block;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(11px, 2vmin, 15px);
		color: var(--deck-muted);
		letter-spacing: 0.08em;
		text-decoration: none;
	}
	a.cover-url:hover {
		color: var(--deck-accent);
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
		background: rgba(240, 236, 225, 0.044);
		border: 2px solid rgba(240, 236, 225, 0.05);
		border-left: 2px solid rgba(240, 236, 225, 0.2);
	}

	.bullet-icon {
		color: var(--deck-accent);
		font-size: 12px;
		flex-shrink: 0;
	}

	.bullet-item p {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(13px, 2.6vmin, 20px);
		font-weight: 500;
		color: var(--deck-ink-2);
		line-height: 1.6;
	}

	.bullet-item p strong {
		color: var(--deck-ink);
		font-weight: 700;
	}

	.bullet-item p strong.hl-gold {
		color: var(--deck-accent);
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
		color: var(--deck-accent);
	}

	.mark-no {
		color: var(--deck-accent);
	}

	.lead {
		margin-top: clamp(12px, 3vh, 28px);
		font-family: 'Barlow', sans-serif;
		font-size: clamp(15px, 3vmin, 25px);
		font-weight: 500;
		line-height: 1.45;
		color: var(--deck-ink-2);
		max-width: 34ch;
	}

	.lead strong {
		font-weight: 700;
		color: var(--deck-ink);
	}

	.lead strong.hl-gold {
		color: var(--deck-accent);
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
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
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

	/* Lone portrait render with no text beside it, so it centers in the
	   leftover space under the headline rather than sitting in a split. */
	.pad-figure {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto 0;
		min-width: 0;
		width: 100%;
	}

	.pad-figure img {
		display: block;
		width: auto;
		max-width: 100%;
		max-height: min(72vh, 620px);
		object-fit: contain;
		filter: drop-shadow(0 18px 40px rgba(0, 0, 0, 0.45));
	}

	/* Cited chart: light source artwork, so it gets a hairline frame to sit
	   on the dark slide instead of floating. */
	.split-chart {
		grid-template-columns: minmax(0, 1.26fr) minmax(0, 0.74fr);
	}

	/* 34.9vw is the same 62% measured against a width-bound stage
	   (100vw * 9 / 16), so the chart never outgrows the slide either way. */
	.chart-figure img {
		max-height: min(62vh, 34.9vw, 600px);
		border: 1px solid var(--deck-rule);
	}

	/* The chart is the tallest block on the deck, so this slide buys it room
	   by tightening the gaps above and below the split. */
	#p3 .headline {
		margin-bottom: clamp(12px, 2.6vh, 28px);
	}

	#p3 .statement {
		margin-top: clamp(14px, 3vh, 30px);
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
		background: rgba(240, 236, 225, 0.044);
		border: 2px solid rgba(240, 236, 225, 0.05);
		border-top: 2px solid var(--deck-accent);
	}

	/* Column variant: the same cards stacked beside a figure, so they run
	   tighter than the three-across version. */
	.frontier-stack {
		grid-template-columns: minmax(0, 1fr);
		margin-top: 0;
	}

	.frontier-stack .frontier-card {
		gap: clamp(4px, 1vh, 10px);
		padding: clamp(14px, 3.4vh, 30px) clamp(14px, 1.8vw, 26px);
	}

	.frontier-stack .card-title {
		font-size: clamp(17px, 3.2vmin, 30px);
	}

	.statement {
		margin-top: clamp(22px, 5.4vh, 54px);
		margin-bottom: auto;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(15px, 3vmin, 25px);
		font-weight: 500;
		line-height: 1.5;
		color: var(--deck-ink-2);
	}

	.statement strong {
		font-weight: 700;
		color: var(--deck-ink);
	}

	/* ── STAT CARD ── */
	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: clamp(6px, 1.4vh, 12px);
		padding: clamp(20px, 5vh, 48px) clamp(18px, 2.6vw, 36px);
		background: rgba(240, 236, 225, 0.044);
		border: 2px solid rgba(240, 236, 225, 0.05);
		border-top: 2px solid rgba(240, 236, 225, 0.2);
	}

	.stat-val {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(54px, 15vmin, 150px);
		line-height: 0.9;
		color: var(--deck-ink);
	}

	.stat-label {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8.5px, 1.6vmin, 12px);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--deck-muted);
	}

	/* ── DATA KIT ── */
	#p6 {
		padding-bottom: clamp(10px, 2.4vh, 24px);
	}

	#p6 .lead {
		margin-top: clamp(4px, 1.4vh, 14px);
		font-size: clamp(17px, 3.4vmin, 30px);
	}

	.stack-pair {
		position: relative;
		display: block;
		margin: 0;
		min-width: 0;
		height: min(72vh, 620px);
	}

	.stack-pair img {
		position: absolute;
		display: block;
		width: auto;
		object-fit: contain;
		filter: drop-shadow(0 18px 40px rgba(0, 0, 0, 0.45));
	}

	.stack-orbit {
		top: -5%;
		left: -24%;
		max-width: 112%;
		max-height: min(34vh, 292px);
	}

	.stack-rocket {
		right: -8%;
		top: 50%;
		transform: translateY(-50%);
		max-width: 116%;
		max-height: min(80vh, 700px);
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
		border-top: 1px solid rgba(240, 236, 225, 0.1);
	}

	.partners p {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(13px, 2.5vmin, 20px);
		font-weight: 500;
		color: var(--deck-ink-2);
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

	/* Team slide reuses .partners/.partner-logos but needs to fit five marks
	   instead of three in less vertical space, so it gets a smaller logo
	   height, tighter gap, and no extra top margin beyond .partners' own. */
	/* Sits at the foot of the slide rather than tucked under the bullets:
	   margin-top auto pushes it down, overriding .partners' margin-bottom. */
	.partners-center {
		justify-content: center;
		margin-top: auto;
		margin-bottom: 0;
	}

	.partners-center .partner-logos img.logo-starcloud {
		height: clamp(18px, 3.4vmin, 30px);
	}

	.partners-center .partner-logos img.logo-axiom {
		height: clamp(26px, 5.2vmin, 46px);
	}

	.partners-center .partner-logos img.logo-planet {
		height: clamp(24px, 4.8vmin, 42px);
	}

	.team-partners {
		margin-top: 0;
		padding-top: clamp(4px, 1vh, 10px);
		justify-content: center;
	}

	/* These marks come in every brand colour and several are drawn dark-on-light,
	   so on the dark ground they are flattened to one off-white silhouette —
	   the row then reads as a single credential strip. */
	.team-partners .partner-logos img {
		filter: brightness(0) invert(1);
		opacity: 0.72;
	}

	/* A crest is line art, not a wordmark: flattened it becomes a solid disc,
	   so it keeps its own colour and is only lifted off the ground. */
	.team-partners .partner-logos img.logo-dtu {
		filter: none;
		opacity: 0.9;
	}

	.team-partners .partner-logos {
		gap: clamp(8px, 1.3vw, 16px);
		flex-wrap: nowrap;
		flex-shrink: 1;
		max-width: 100%;
		justify-content: center;
	}

	.team-partners .partner-logos img {
		height: clamp(20px, 3.4vmin, 29px);
	}

	.team-partners .partner-logos img.logo-compact {
		height: clamp(16px, 2.8vmin, 23px);
	}

	.team-partners .partner-logos img.logo-dtu {
		height: clamp(43px, 7.8vmin, 66px);
	}

	.team-partners .partner-logos img.logo-posha {
		height: clamp(14px, 2.5vmin, 21px);
	}

	.team-partners .partner-logos img.logo-prominent {
		height: clamp(24px, 4.1vmin, 34px);
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
		color: rgba(240, 236, 225, 0.55);
	}

	.brain-item-key {
		color: var(--deck-accent);
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
		color: var(--deck-muted);
	}

	.brain-link {
		margin-left: calc(clamp(52px, 11vmin, 112px) / 2 - 1px);
		width: 2px;
		height: clamp(28px, 8vh, 80px);
		margin-top: clamp(6px, 1.4vh, 14px);
		margin-bottom: clamp(6px, 1.4vh, 14px);
		background: repeating-linear-gradient(180deg, var(--deck-accent) 0 5px, transparent 5px 10px);
	}

	/* ── DEMO CUE ── */
	.demo-cue {
		display: inline-flex;
		align-items: center;
		align-self: center;
		gap: clamp(8px, 1.2vw, 14px);
		margin-top: auto;
		margin-bottom: auto;
		padding: clamp(8px, 1.6vh, 14px) clamp(14px, 1.8vw, 24px);
		background: transparent;
		border: 2px solid rgba(240, 236, 225, 0.15);
		color: var(--deck-accent);
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(10px, 1.9vmin, 14px);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.2s;
	}

	.demo-cue:hover {
		background: rgba(240, 236, 225, 0.04);
		border-color: rgba(240, 236, 225, 0.82);
	}

	.demo-cue-arrow {
		flex-shrink: 0;
		transition: transform 0.2s;
	}

	.demo-cue:hover .demo-cue-arrow {
		transform: translateX(3px);
	}

	/* ── PAYLOAD COST TABLE ── */
	.cost-table-wrap {
		width: 100%;
		max-width: 1320px;
		margin: 0 auto;
		overflow-x: auto;
	}

	/* Landscape slides have headroom under the headline; nudge the table down. */
	@media (orientation: landscape) {
		.cost-table-wrap {
			margin-top: clamp(16px, 5vh, 56px);
		}
	}

	.cost-table {
		width: 100%;
		border-collapse: collapse;
		font-size: clamp(13px, 2.6vmin, 25px);
		color: var(--deck-ink);
	}

	.cost-table th,
	.cost-table td {
		padding: clamp(7px, 1.7vh, 18px) clamp(10px, 2vmin, 26px);
		text-align: left;
		white-space: nowrap;
	}

	.cost-table thead th {
		font-family: 'Space Mono', monospace;
		font-size: clamp(9.5px, 1.75vmin, 15px);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--deck-accent);
		border-bottom: 1px solid var(--deck-rule);
	}

	.cost-table tbody tr {
		border-bottom: 1px solid var(--deck-rule);
	}

	.cost-table tbody td:first-child {
		color: var(--deck-ink-2);
	}

	.cost-table tbody td:last-child {
		font-variant-numeric: tabular-nums;
	}

	.cost-row-ours {
		background: rgba(255, 176, 0, 0.1);
	}

	.cost-row-ours td {
		color: var(--deck-accent);
		font-weight: 700;
	}

	/* ── VIDEO ── */
	.video-frame {
		width: min(100%, calc((min(100vh, 100vw * 9 / 16) - 260px) * 16 / 9));
		aspect-ratio: 16 / 9;
		margin: auto auto 0;
		background: var(--deck-bg);
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

	.video-caption {
		text-align: center;
	}

	.video-link a {
		color: var(--deck-accent);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: rgba(240, 236, 225, 0.82);
	}

	.video-link a:hover {
		text-decoration-color: var(--deck-accent);
	}

	/* ── TEAM ── */
	#p10 {
		padding-bottom: clamp(16px, 3.4vh, 32px);
	}

	.team-rows {
		display: flex;
		flex-direction: column;
		gap: 3px;
		margin-top: clamp(20px, 7vh, 84px);
		margin-bottom: auto;
	}

	.team-grid {
		display: grid;
		gap: 3px;
	}

	.team-row-lead {
		grid-template-columns: repeat(4, minmax(0, 2fr));
	}

	/* Three cards under four, held to the lead row's card width so the two
	   rows line up instead of the lower one stretching wider. */
	.team-row-rest {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		width: calc(75% - 0.75px);
		margin: 0 auto;
	}

	.team-card {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		padding: clamp(10px, 1.7vh, 22px) clamp(12px, 1.3vw, 20px);
		background: rgba(240, 236, 225, 0.044);
		border: 2px solid rgba(240, 236, 225, 0.05);
		border-top: 2px solid rgba(240, 236, 225, 0.15);
	}

	.team-photo {
		width: clamp(36px, 6vh, 64px);
		height: clamp(36px, 6vh, 64px);
		flex-shrink: 0;
		border: 2px solid rgba(240, 236, 225, 0.175);
		border-radius: 50%;
		object-fit: cover;
		margin-bottom: clamp(6px, 1.2vh, 14px);
	}

	.team-name {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(14px, 2.2vh, 22px);
		font-weight: 600;
		color: var(--deck-ink);
	}

	.team-role {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8.5px, 1.35vh, 13px);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--deck-accent);
		margin-top: 4px;
		margin-bottom: clamp(5px, 1.1vh, 12px);
	}

	.team-bio {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2vh, 20px);
		font-weight: 500;
		color: var(--deck-muted);
		line-height: 1.45;
		hyphens: auto;
		-webkit-hyphens: auto;
		text-wrap: pretty;
	}

	.team-bio strong {
		font-weight: 700;
		color: var(--deck-ink);
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
		background: rgba(240, 236, 225, 0.044);
		border: 2px solid rgba(240, 236, 225, 0.05);
		border-top: 2px solid rgba(240, 236, 225, 0.2);
	}

	.price-card-key {
		border-top-color: var(--deck-accent);
		background: rgba(255, 176, 0, 0.1);
	}

	.price-val {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(34px, 9vmin, 92px);
		line-height: 0.95;
		color: var(--deck-ink);
	}

	.price-card-key .price-val {
		color: var(--deck-accent);
	}

	.price-unit {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(12px, 2.1vmin, 16px);
		font-weight: 500;
		color: var(--deck-muted);
	}

	.price-op {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(28px, 6vmin, 60px);
		color: rgba(240, 236, 225, 0.4);
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
		border-top: 2px solid rgba(240, 236, 225, 0.2);
	}

	.ledger-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: clamp(16px, 3vw, 48px);
		padding: clamp(12px, 2.8vh, 26px) 0;
		border-bottom: 1px solid rgba(240, 236, 225, 0.1);
	}

	.ledger-row dt {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(16px, 3.2vmin, 28px);
		font-weight: 500;
		color: var(--deck-ink-2);
	}

	.ledger-row dd {
		margin: 0;
		font-family: 'Space Mono', monospace;
		font-weight: 400;
		font-size: clamp(15px, 3vmin, 26px);
		letter-spacing: 0.02em;
		color: var(--deck-ink);
		white-space: nowrap;
	}

	/* ── ASK ──
	   Boxed, left-aligned card in the deck's standard card idiom (fill, gold top
	   rule), with the raise as the dominant figure and the reason under it. */
	#p13 {
		justify-content: center;
		background:
			radial-gradient(ellipse 60% 80% at 90% 50%, rgba(240, 236, 225, 0.025) 0%, transparent 60%),
			var(--deck-bg);
	}

	.ask-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		max-width: 820px;
		padding: clamp(20px, 4.4vh, 44px) clamp(20px, 2.6vw, 40px);
		background: rgba(255, 176, 0, 0.055);
		border: 2px solid rgba(240, 236, 225, 0.05);
		border-top: 2px solid var(--deck-accent);
	}

	.ask-tag {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(9px, 1.7vmin, 13px);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--deck-accent);
	}

	.ask-amount {
		margin-top: clamp(8px, 1.8vh, 18px);
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(52px, 13vmin, 136px);
		line-height: 0.9;
		letter-spacing: 0.02em;
		color: var(--deck-accent);
	}

	/* Hairline separates the figure from its rationale without a second box. */
	.ask-why {
		margin-top: clamp(14px, 3vh, 30px);
		padding-top: clamp(12px, 2.6vh, 26px);
		border-top: 1px solid rgba(240, 236, 225, 0.12);
		width: 100%;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(15px, 3vmin, 26px);
		font-weight: 500;
		line-height: 1.45;
		color: var(--deck-ink-2);
		max-width: 44ch;
	}

	.ask-why strong {
		font-weight: 700;
	}

	.ask-thanks {
		margin-top: clamp(26px, 6.4vh, 64px);
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(30px, 7vmin, 72px);
		font-weight: 500;
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: var(--deck-ink);
	}

	.ask-footer {
		margin-top: clamp(6px, 1.4vh, 14px);
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(10.5px, 1.95vmin, 13px);
		color: var(--deck-muted);
		letter-spacing: 0.08em;
	}

	.ask-footer a {
		color: var(--deck-accent);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: rgba(240, 236, 225, 0.82);
	}

	.ask-footer a:hover {
		text-decoration-color: var(--deck-accent);
	}

	/* ── APPENDIX ── */
	.appendix-head {
		margin-top: auto;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(8px, 1.5vmin, 11px);
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--deck-accent);
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
		background: var(--deck-bg) !important;
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
			background: var(--deck-bg);
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
			border-bottom: 1px solid rgba(240, 236, 225, 0.09);
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

		/* The team headline is kept on one line on the wide deck; on a phone that
		   would push the whole page sideways, so it wraps like any other. */
		.headline-nowrap {
			white-space: normal;
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
		.ask-why,
		.ledger-row dt {
			font-size: 16px;
		}

		.split,
		.frontier-grid,
		.team-rows {
			display: flex;
			flex-direction: column;
			align-items: stretch;
			gap: 20px;
		}

		.split-figure img,
		.robot-figure img {
			max-height: 42vh;
		}

		/* The chart is portrait and dense; height-capping it on a phone makes it
		   unreadable, so let it run the full column width instead. */
		.chart-figure img {
			width: 100%;
			max-height: none;
		}

		.stack-pair {
			height: auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 12px;
		}

		.stack-pair img {
			position: static;
			max-width: 100%;
		}

		.stack-orbit {
			max-height: 28vh;
		}

		.stack-rocket {
			transform: none;
			max-height: 46vh;
		}

		.pad-figure img {
			max-height: 56vh;
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

		.team-grid {
			grid-template-columns: minmax(0, 1fr);
		}

		.team-row-rest {
			width: 100%;
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

		.ask-amount {
			font-size: clamp(48px, 14vw, 72px);
		}

		/* Stacked, the next slide is below rather than to the right, so the cue
		   points down and nudges that way on press. */
		.demo-cue-arrow {
			transform: rotate(90deg);
		}

		.demo-cue:hover .demo-cue-arrow,
		.demo-cue:active .demo-cue-arrow {
			transform: rotate(90deg) translateX(3px);
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

		/* The logo row is sized with vmin/vw clamps tuned for the on-screen
		   deck stage; the printed page is a fixed 1280x720 box, so those
		   clamps can resolve wider than the page and spill off the edge.
		   Pin fixed px heights here instead, sized to always fit. */
		.team-partners .partner-logos {
			gap: 14px !important;
		}

		.team-partners .partner-logos img {
			height: 22px !important;
		}

		.team-partners .partner-logos img.logo-compact {
			height: 18px !important;
		}

		.team-partners .partner-logos img.logo-dtu {
			height: 48px !important;
		}

		.team-partners .partner-logos img.logo-posha {
			height: 15px !important;
		}

		.team-partners .partner-logos img.logo-prominent {
			height: 26px !important;
		}
	}
</style>
