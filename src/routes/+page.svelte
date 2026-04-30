<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import SiteClosingCta from '$lib/components/SiteClosingCta.svelte';
	import JoinUsLink from '$lib/components/JoinUsLink.svelte';
	import { setupRevealObserver } from '$lib/utils/reveal';

	let cdDays = $state('—');
	let cdHours = $state('—');
	let cdMins = $state('—');
	let cdSecs = $state('—');

	function updateCountdown() {
		const target = new Date('2027-01-10T00:00:00Z').getTime();
		const now = Date.now();
		const diff = target - now;

		if (diff <= 0) {
			cdDays = '00';
			cdHours = '00';
			cdMins = '00';
			cdSecs = '00';
			return;
		}

		const days = Math.floor(diff / 86400000);
		const hours = Math.floor((diff % 86400000) / 3600000);
		const mins = Math.floor((diff % 3600000) / 60000);
		const secs = Math.floor((diff % 60000) / 1000);

		cdDays = String(days).padStart(2, '0');
		cdHours = String(hours).padStart(2, '0');
		cdMins = String(mins).padStart(2, '0');
		cdSecs = String(secs).padStart(2, '0');
	}

	onMount(() => {
		const cleanupReveal = setupRevealObserver({ threshold: 0.12 });

		updateCountdown();
		const timer = window.setInterval(updateCountdown, 1000);

		return () => {
			cleanupReveal();
			window.clearInterval(timer);
		};
	});
</script>

<svelte:head>
	<title>STARFORGE — Autonomous Factory for Space</title>
</svelte:head>

<section id="hero">
	<div class="hero-bg">
		<div class="hero-scan-lines"></div>
	</div>

	<div class="hero-content">
		<h1 class="hero-title">
			Building the<br />
			<span>Autonomous</span><br />
			Factory for Space
		</h1>
		<p class="hero-sub">
			Robots and AI working together to construct the future of launch infrastructure.
		</p>
		<div class="hero-ctas">
			<a href="https://github.com/ScalingPhysicalAI" class="btn-primary">See What We're Building</a>
		<JoinUsLink className="btn-ghost" />
		</div>
	</div>

	<div class="scroll-indicator">
		<div class="scroll-line"></div>
		<span>Scroll</span>
	</div>
</section>

<div class="hr-line"></div>

<section id="built">
	<div class="built-left reveal">
		<span class="section-label">What We Have Built</span>
		<h2 class="section-title">All robots<br />controlled under <span>one common brain</span></h2>
		<p class="section-body">
			We have assembled the foundation of an autonomous industrial workforce — robots and AI that
			think, move, and build in coordination. Together.
		</p>
	</div>
	<div class="built-right reveal" style="transition-delay:0.15s">
		<div class="built-item">
			<div class="built-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<circle cx="12" cy="6" r="3" /><path d="M12 9v6M8 21v-3a4 4 0 018 0v3" />
					<path d="M5 12l3 3M19 12l-3 3" />
				</svg>
			</div>
			<div>
				<div class="built-item-title">Humanoid Robot</div>
				<div class="built-item-desc">
					A general-purpose humanoid capable of complex assembly tasks, engineered for the demanding
					tolerances of aerospace manufacturing.
				</div>
			</div>
		</div>
		<div class="built-item">
			<div class="built-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<rect x="2" y="14" width="4" height="8" rx="1" /><rect
						x="10"
						y="10"
						width="4"
						height="12"
						rx="1"
					/>
					<rect x="18" y="6" width="4" height="16" rx="1" />
					<path d="M4 14V8a2 2 0 012-2h4M12 10V6a2 2 0 012-2h4" />
				</svg>
			</div>
			<div>
				<div class="built-item-title">Logistics Infra</div>
				<div class="built-item-desc">
					Robots operating heavy machines for transportation and materials handling across industrial environments and launch facilities.
				</div>
			</div>
		</div>
		<div class="built-item">
			<div class="built-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
				</svg>
			</div>
			<div>
				<div class="built-item-title">AI Coordination System</div>
				<div class="built-item-desc">
					An AI that orchestrates robots in real-time — unified perception, planning, and
					execution across the entire autonomous workforce.
				</div>
			</div>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section id="mission">
	<div class="reveal">
		<span class="section-label">The Mission</span>
		<h2 class="section-title">A Fully <span>Autonomous</span><br />Starbase Factory</h2>
		<p class="section-body">
			We are building a future where large rockets, launch pads, and space infrastructure are
			constructed, managed, and scaled entirely by robots and AI and no longer bottlenecked by human
			errors, labor constraints, and slow construction cycles.
		</p>
	</div>
	<div class="mission-grid">
		<div class="mission-stat reveal" style="transition-delay:0.1s">
			<div class="stat-num">$5–10B</div>
			<div class="stat-label">Development Cost of Starship</div>
			<div class="stat-desc">
				Building the next generation of launch systems at current efficiency is harder, slower, and
				far more capital-intensive than it needs to be.
			</div>
		</div>
		<div class="mission-stat reveal" style="transition-delay:0.2s">
			<div class="stat-num">1000×</div>
			<div class="stat-label">Target Efficiency Gain</div>
			<div class="stat-desc">
				By automating construction, logistics, and coordination, we believe it is possible to
				dramatically reduce cost and time required to build large-scale launch systems.
			</div>
		</div>
		<div class="mission-stat reveal" style="transition-delay:0.3s">
			<div class="stat-num">500$</div>
			<div class="stat-label">Targeted cost of deploying payloads into low earth orbit</div>
			<div class="stat-desc">
This enables orbital datacentre that generates almost free value, mostly converting free solar energy into inference tokens.
			</div>
		</div>
		<div class="mission-stat reveal" style="transition-delay:0.4s">
			<div class="stat-num">10B+</div>
			<div class="stat-label">Projected Revenue</div>
			<div class="stat-desc">
SpaceX's launch service business generated a total revenue of $4.1 billion in 2025. Our projection shows that as a launch provider our autonomous space infra could scale the bar.
			</div>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section id="why-now">
	<span class="section-label reveal">Why Now</span>
	<h2 class="section-title reveal">
		Because the economics<br />of space <span>demand it</span>
	</h2>
	<div class="why-now-layout">
		<div class="why-now-big reveal" aria-hidden="true">
			WHY<br /><span>NOW</span>
		</div>
		<div class="why-points">
			<div class="why-point reveal" style="transition-delay:0.1s">
				<div class="why-point-title">Space economics only work if launch costs include development reality</div>
				<p>
					Starship does not get to $500 per Kg payload launch cost if the full $10B+ development
					bill is included. The next era of launch demands a radically more efficient way to build
					space infrastructure.
				</p>
			</div>
			<div class="why-point reveal" style="transition-delay:0.2s">
				<div class="why-point-title">The Moon is the next milestone, and it cannot be built by flying labor in</div>
				<p>
					Human civilization’s next practical step is lunar construction. We are not sending
					thousands of people to build on the Moon, which means we need to train AI and autonomous
					systems now.
				</p>
			</div>
			<div class="why-point reveal" style="transition-delay:0.3s">
				<div class="why-point-title">Launch windows are strategic deadlines, not aspirations</div>
				<p>
					Delays have already pushed humanity past the early 2027 Mars launch opportunity. Missing
					one window means waiting for the next, and in space, every slip compounds the cost of
					progress.
				</p>
			</div>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section id="launch-window">
	<div class="window-ticker">
		<div class="ticker-track">
			<span class="ticker-item">Mars Launch Window 2027</span>
			<span class="ticker-item">◆</span>
			<span class="ticker-item">Next Window 2029</span>
			<span class="ticker-item">◆</span>
			<span class="ticker-item">Launch Windows Do Not Wait</span>
			<span class="ticker-item">◆</span>
			<span class="ticker-item">Autonomous Factories</span>
			<span class="ticker-item">◆</span>
			<span class="ticker-item">Mars Launch Window 2027</span>
			<span class="ticker-item">◆</span>
			<span class="ticker-item">Next Window 2029</span>
			<span class="ticker-item">◆</span>
			<span class="ticker-item">Launch Windows Do Not Wait</span>
			<span class="ticker-item">◆</span>
			<span class="ticker-item">Autonomous Factories</span>
			<span class="ticker-item">◆</span>
		</div>
	</div>

	<div class="window-content">
		<div class="reveal">
			<span class="section-label">Why This Matters</span>
			<h2 class="section-title">
				Launch windows<br />do not <span>wait</span>
			</h2>
			<p class="section-body" style="margin-bottom: 24px;">
				Space development is not only expensive — it is time-sensitive. For interplanetary missions,
				launch windows are limited and precisely timed.
			</p>
			<p class="section-body">
				If a major Mars launch window is missed in early 2027, the next opportunity does not arrive
				until early 2029. A two-year delay is unacceptable for the future of space civilization. We
				believe autonomous factories will make sure humanity never misses critical launch windows
				simply because we could not build fast enough.
			</p>
		</div>
		<div class="countdown-block reveal" style="transition-delay:0.2s">
			<div class="countdown-label">Mars Launch Window — Early 2027</div>
			<div class="countdown-display">
				<div class="countdown-unit">
					<span class="countdown-num">{cdDays}</span>
					<span class="countdown-unit-label">Days</span>
				</div>
				<div class="countdown-unit">
					<span class="countdown-num">{cdHours}</span>
					<span class="countdown-unit-label">Hours</span>
				</div>
				<div class="countdown-unit">
					<span class="countdown-num">{cdMins}</span>
					<span class="countdown-unit-label">Mins</span>
				</div>
				<div class="countdown-unit">
					<span class="countdown-num">{cdSecs}</span>
					<span class="countdown-unit-label">Secs</span>
				</div>
			</div>
			<p class="countdown-note">
				Until <strong>Mars launch window opens</strong>. Miss it, and humanity waits until
				<strong>2029</strong>.
			</p>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section id="solved">
	<div class="solved-header reveal">
		<span class="section-label">What We Have Solved</span>
		<h2 class="section-title">The Robotics<br /><span>Data Flywheel</span></h2>
		<p class="section-body">
			We cracked the core challenge of physical AI: getting robots to generate the training data
			that makes the AI smarter — at scale, in the real world, automatically.
		</p>
	</div>
	<div class="solved-grid">
		<div class="solved-card reveal" style="transition-delay:0.1s">
			<div class="solved-card-num">01</div>
			<div class="solved-card-title">Robots as Developer Platforms</div>
			<p class="solved-card-body">
				Thousands of developers and startups worldwide use our robots as development platforms,
				deploying them across real-world environments and use cases.
			</p>
		</div>
		<div class="solved-card reveal" style="transition-delay:0.2s">
			<div class="solved-card-num">02</div>
			<div class="solved-card-title">Train the Model, Earn Points</div>
			<p class="solved-card-body">
				Every deployment generates valuable training data. Developers earn points each time the
				model is used in a real-world task, generating incentives from the
				end customers.
			</p>
		</div>
		<div class="solved-card reveal" style="transition-delay:0.3s">
			<div class="solved-card-num">03</div>
			<div class="solved-card-title">AI That Never Stops Learning</div>
			<p class="solved-card-body">
				Our AI backbone improves continuously through data collected by our robot infrastructure
				operating on rocket systems compounding every day.
			</p>
		</div>
	</div>
	<div class="solved-cta reveal" style="transition-delay:0.4s">
		<a href="/robo-dev-kit" class="btn-primary">Buy Robot Kit</a>
	</div>
</section>

<div class="hr-line"></div>

<section id="milestone">
	<div class="milestone-layout">
		<div>
			<span class="section-label reveal">Our First Milestone</span>
			<h2 class="section-title reveal">Demonstrate physical AI backbone<br /><span>building a fully reusable rocket system</span></h2>
			<p class="section-body reveal" style="margin-bottom:40px;">
				Every large vision starts with a clear proof point. Our first milestone is to
				demonstrate that our physical ai backbone design, simulates and coordinates with robots to build a functional rocket system.
			</p>
		</div>
		<div class="milestone-visual reveal" style="transition-delay:0.2s">
			<div class="milestone-rocket">
				<svg
					viewBox="0 0 80 80"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M40 8 C40 8 52 20 52 38 L52 52 L28 52 L28 38 C28 20 40 8 40 8Z"
						stroke-linejoin="round"
					/>
					<path d="M28 48 L20 58 L28 55" stroke-linejoin="round" />
					<path d="M52 48 L60 58 L52 55" stroke-linejoin="round" />
					<rect x="35" y="52" width="10" height="12" rx="2" />
					<circle cx="40" cy="30" r="5" />
					<path d="M38 68 Q40 72 42 68" stroke-width="1" opacity="0.4" />
					<path d="M36 66 Q40 74 44 66" stroke-width="1" opacity="0.25" />
				</svg>
			</div>
			<div class="milestone-badge">Milestone 01 — In Progress</div>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<SiteClosingCta />
