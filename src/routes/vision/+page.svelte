<script lang="ts">
	import { onMount } from 'svelte';
	import SiteClosingCta from '$lib/components/SiteClosingCta.svelte';
	import { setupRevealObserver } from '$lib/utils/reveal';

	onMount(() => {
		return setupRevealObserver({ threshold: 0.1 });
	});
</script>

<svelte:head>
	<title>STARFORGE — Vision</title>
</svelte:head>

<div class="vision-page-hero">
	<div class="hero-scan-lines"></div>
	<div class="vision-page-hero-content">
		<span class="hero-tag">Starforge — Vision</span>
		<h1 class="hero-title">
			From one robot-build<br />
			rocket to<br />
			<span>autonomous space infrastructure</span>
		</h1>
	</div>
</div>

<section id="vision">
	<div class="vision-container">
		<div class="vision-intro">
			<p class="reveal">
				Demand for orbital AI data centers is rising fast, but launch capacity is nowhere close to
				keeping up. Right now, Falcon from SpaceX is the only launch vehicle that reliably works at
				scale, and it is effectively booked out for the year. Across the industry, launch
				availability for 2026 is already extremely constrained, and aside from SpaceX, no new
				platform appears likely to meaningfully serve startups by early 2027.
			</p>
			<p class="reveal" style="transition-delay:0.1s">
				The nearest competitors — Rocket Lab and Blue Origin — still face cost structures too high
				to solve the problem at scale. Once government demand is added on top, the market could
				require thousands of launches per month, and the industry is simply not equipped to deliver
				that.
			</p>

			<!-- Row: text left, image right -->
			<div class="vision-split vision-split-launch reveal" style="transition-delay:0.15s">
				<div class="vision-split-text">
					<p class="vision-pull">The <span>2027 Mars window</span> is at risk.</p>
					<p>
						For deep space missions, Starship's current pace is too slow. SpaceX itself is close to
						risking the early-2027 Mars window — orbital refueling tests, essential for Mars
						missions, appear to be running 6 to 8 months behind schedule. If that window is missed,
						the next opportunity will not arrive until 2029.
					</p>
					<p>One thing is clear: this has to change.</p>
				</div>
				<div class="vision-image-block" style="margin:0;">
					<img src="/assets/image4.png" alt="Launch capacity vs. demand" />
					<div class="vision-image-caption">Launch capacity vs. demand — the growing gap</div>
				</div>
			</div>

			<!-- Row: image left, text right -->
			<div class="vision-split reverse vision-split-manufacturing reveal" style="transition-delay:0.25s">
				<div class="vision-split-text">
					<p class="vision-pull">Rockets have <span>no manufacturing playbook.</span></p>
					<p>
						Starship vehicles must be transported to Cape Canaveral on an enormous dedicated
						transport system. Flap systems need specialized towers and wire rigs built just to test
						a single component. The chopstick catching tower — central to rapid reusability — had to
						be designed and built from nothing.
					</p>
					<p>
						These are foundational decisions that take significant time to execute. Unlike
						smartphones, rocket development has no standardized manufacturing path. That has to
						change.
					</p>
				</div>
				<div class="vision-image-block" style="margin:0;">
					<img src="/assets/image3.png" alt="Starbase infrastructure" />
					<div class="vision-image-caption">
						Starbase — foundational decisions shaping the entire timeline
					</div>
				</div>
			</div>

			<div class="vision-split vision-split-future reveal" style="transition-delay:0.3s">
				<div class="vision-split-text">
					<p>
						This challenge will become even more critical in the future. The industry will need not just
						launch vehicles, but far more complex space systems. Starship alone is not enough for
						long-duration human space travel. We will need vehicles like space cyclers — capable of
						generating artificial gravity — spacecraft too large to launch from Earth, that must be
						assembled in orbit, much like the ISS.
					</p>

					<p>
						The industry needs a fundamental shift. We must rethink not just how rockets are built, but
						how the entire launch infrastructure is designed and constructed. The answer is physical AI
						— systems not just good at reasoning, but at building real-world infrastructure. Humanoid
						robots, logistics robots, and AI will be the bootstrapping layer for that future.
					</p>
				</div>
				<div class="vision-image-block" style="margin:0;">
					<img src="/assets/image1.png" alt="Humanoid robots in factory" />
					<div class="vision-image-caption">
						Humanoid robots — the physical layer of autonomous construction
					</div>
				</div>
			</div>

			<div class="vision-two-col">
				<div class="vision-image-block reveal" style="transition-delay:0.4s; margin:0;">
					<img src="/assets/image2.png" alt="Autonomous logistics systems" />
					<div class="vision-image-caption">
						Autonomous logistics — coordinated systems at scale
					</div>
				</div>
				<div
					class="vision-image-block reveal"
					style="transition-delay:0.45s; margin:0; display:flex; flex-direction:column; justify-content:center; background:rgba(255,255,255,0.01); padding:40px;"
				>
					<p class="vision-pull" style="font-size:clamp(24px,2.5vw,38px); margin-bottom:20px;">
						That is the problem<br />we are <span>solving.</span>
					</p>
					<p style="font-size:15px; line-height:1.8; color:rgba(232,226,214,0.65);">
						An autonomous factory for space infrastructure, where humanoids, logistics vehicles, and
						heavy machines all operate under a shared intelligence layer — around the clock, at
						orders-of-magnitude greater efficiency.
					</p>
					<p
						style="font-size:15px; line-height:1.8; color:rgba(232,226,214,0.65); margin-top:16px;"
					>
						Our first milestone: build, entirely with robots, all the infrastructure required to
						launch a small rocket.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<SiteClosingCta />
