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
			Robots, and AI working together to construct the future of launch infrastructure.
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
					Robots operating heavy machines for transportation and materials handing across industrial environments and launch facilities.
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
		<h2 class="section-title">A Fully <span>Autonomous</span><br />"Starbase" Factory</h2>
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
			<div class="stat-num">∞</div>
			<div class="stat-label">24/7 Autonomous Output</div>
			<div class="stat-desc">
				Autonomous factories do not sleep, do not fatigue, and do not require coordination overhead.
				Factory output becomes an always-on capability.
			</div>
		</div>
		<div class="mission-stat reveal" style="transition-delay:0.4s">
			<div class="stat-num">3</div>
			<div class="stat-label">Core Systems Built</div>
			<div class="stat-desc">
				A logistics robot, a humanoid robot, and a unified AI coordination system — the three
				pillars of an autonomous industrial workforce for space manufacturing.
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
				<div class="why-point-title">Launch vehicles are extraordinarily expensive to build</div>
				<p>
					The development cost of Starship alone is estimated at $5–10 billion. Without major leaps
					in efficiency, developing the next generation becomes harder and far more
					capital-intensive.
				</p>
			</div>
			<div class="why-point reveal" style="transition-delay:0.2s">
				<div class="why-point-title">AI and robotics can change the equation</div>
				<p>
					By automating construction, logistics, and coordination across the full factory stack, we
					believe it is possible to improve efficiency by orders of magnitude and dramatically
					reduce cost and time.
				</p>
			</div>
			<div class="why-point reveal" style="transition-delay:0.3s">
				<div class="why-point-title">The technology is ready — the factories are not</div>
				<p>
					The convergence of capable humanoids, autonomous logistics, and coordinating AI has
					arrived. Now we are putting these systems together for industrial scale output.
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

<section id="milestone">
	<div class="milestone-layout">
		<div>
			<span class="section-label reveal">Our First Milestone</span>
			<h2 class="section-title reveal">Demonstrate physical AI backbone<br /><span>building a rocket</span></h2>
			<p class="section-body reveal" style="margin-bottom:40px;">
				Every large vision starts with a clear proof point. Our first milestone is to
				demonstrate that our physical ai backbone design, simulates and coordinates with robots to build a functional rocket system.
			</p>
			<div class="milestone-steps reveal">
				<div class="milestone-step">
					<span class="step-num">→ 01</span>
					<div class="step-text">
						<strong>Robot-built rocket</strong>
						Coordinated humanoid and logistics robot assemble a small-scale rocket from components. First
						proof of real-world assembly.
					</div>
				</div>
				<div class="milestone-step">
					<span class="step-num">→ 02</span>
					<div class="step-text">
						<strong>Full factory prototype</strong>
						Autonomous cell capable of iterative, uninterrupted production cycles without human intervention.
					</div>
				</div>
				<div class="milestone-step">
					<span class="step-num">→ 03</span>
					<div class="step-text">
						<strong>Starbase-scale deployment</strong>
						Launch infrastructure construction, managed and operated by autonomous systems.
					</div>
				</div>
			</div>
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

<section id="vision">
	<span class="vision-eyebrow reveal">Vision</span>
	<h2 class="vision-headline reveal">
		From one robot-built rocket<br />to <span>autonomous space infrastructure</span>
	</h2>
	<p class="vision-body reveal">
		Today, the goal is a working demonstration. Tomorrow, it is autonomous manufacturing for the
		space age. We are building the systems that turn factory construction, rocket infrastructure,
		and launch preparation into an always-on autonomous capability.
	</p>
	<a href={resolve('/vision')} class="vision-full-link reveal">Read the full vision</a>
</section>

<div class="hr-line"></div>

<SiteClosingCta />
