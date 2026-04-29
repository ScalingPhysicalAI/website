<script lang="ts">
	import { onMount } from 'svelte';
	import JoinUsLink from '$lib/components/JoinUsLink.svelte';
	import { setupRevealObserver } from '$lib/utils/reveal';

	let { data } = $props();

	onMount(() => {
		return setupRevealObserver({ threshold: 0.12 });
	});

	function money(amount: string, currencyCode: string) {
		const n = Number(amount);
		if (!Number.isFinite(n)) return `${amount} ${currencyCode}`;
		return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(n);
	}

	const product = $derived(data.product);
	const firstVariant = $derived(product?.variants?.nodes?.[0]);
</script>

<svelte:head>
	<title>{product?.seo?.title ?? product?.title ?? 'Robo Dev Kit'} — Build, test, iterate</title>
	<meta
		name="description"
		content={product?.seo?.description ??
			'A robotics developer kit designed for fast iteration: modular hardware, real-time control, telemetry, and safety-first defaults.'}
	/>
</svelte:head>

<header class="rdk-hero">
	<div class="hero-scan-lines" aria-hidden="true"></div>
	<div class="rdk-hero-inner">
		<span class="hero-tag">Robo Dev Kit</span>
		<h1 class="hero-title">
			Ship robot<br />
			behavior <span>faster</span>
		</h1>
		<p class="hero-sub">
			A dev kit for robotics teams who want tight iteration loops — modular hardware, deterministic control,
			and telemetry you can trust.
		</p>
		<div class="hero-ctas">
			<a class="btn-primary" href="#buy">Get the kit</a>
			<JoinUsLink className="btn-ghost" />
		</div>
		{#if product}
			<div class="rdk-storeline reveal" style="transition-delay:0.1s">
				<div class="rdk-storeline-title">{product.title}</div>
				<div class="rdk-storeline-meta">
					<span>
						From
						<strong>
							{money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
						</strong>
					</span>
					{#if firstVariant}
						<span class="rdk-dot">◆</span>
						<span class:rdk-out={!firstVariant.availableForSale}>
							{firstVariant.availableForSale ? 'In stock' : 'Out of stock'}
						</span>
					{/if}
				</div>
			</div>
		{/if}
		<div class="rdk-proof">
			<div class="rdk-proof-item">
				<div class="rdk-proof-k">Fast bring-up</div>
				<div class="rdk-proof-v">Hours, not weeks</div>
			</div>
			<div class="rdk-proof-item">
				<div class="rdk-proof-k">Built for iteration</div>
				<div class="rdk-proof-v">Swap modules, keep software</div>
			</div>
			<div class="rdk-proof-item">
				<div class="rdk-proof-k">Safety defaults</div>
				<div class="rdk-proof-v">Limits, E‑stop, sanity checks</div>
			</div>
		</div>
	</div>
</header>

<div class="hr-line"></div>

<section class="rdk-section" id="why">
	<div class="rdk-grid">
		<div class="reveal">
			<span class="section-label">Why Robo Dev Kit</span>
			<h2 class="section-title">Robotics is hard. Iteration shouldn’t be.</h2>
			<p class="section-body">
				Most robotics programs slow down in the same places: bring-up, wiring, flaky comms, unclear logs, and
				the fear of “one bad command” ruining hardware. Robo Dev Kit is designed to remove friction from the
				loop so your team can spend time on behavior — not babysitting tooling.
			</p>
		</div>

		<div class="rdk-card reveal" style="transition-delay:0.12s">
			<div class="rdk-card-title">What it optimizes for</div>
			<ul class="rdk-bullets">
				<li>Stable, repeatable experiments</li>
				<li>Clean telemetry and debuggability</li>
				<li>Modular hardware and simple replacements</li>
				<li>Safety-first control primitives</li>
			</ul>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section class="rdk-section" id="features">
	<span class="section-label reveal">Key features</span>
	<h2 class="section-title reveal">Everything you need to iterate daily</h2>

	<div class="rdk-features">
		<div class="rdk-feature reveal">
			<div class="rdk-feature-top">
				<div class="rdk-ico" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M7 7h10v10H7z" />
						<path d="M4 4h4v4H4zM16 4h4v4h-4zM4 16h4v4H4zM16 16h4v4h-4z" />
					</svg>
				</div>
				<div class="rdk-feature-title">Modular hardware stack</div>
			</div>
			<p class="rdk-feature-desc">Swap actuators/sensors, keep the same software interface and test harness.</p>
		</div>

		<div class="rdk-feature reveal" style="transition-delay:0.08s">
			<div class="rdk-feature-top">
				<div class="rdk-ico" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M4 12h16" />
						<path d="M8 8l-4 4 4 4" />
						<path d="M16 8l4 4-4 4" />
					</svg>
				</div>
				<div class="rdk-feature-title">Deterministic control loop</div>
			</div>
			<p class="rdk-feature-desc">Consistent timing and guardrails so you can reproduce results across runs.</p>
		</div>

		<div class="rdk-feature reveal" style="transition-delay:0.16s">
			<div class="rdk-feature-top">
				<div class="rdk-ico" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M12 2v20" />
						<path d="M4 14c2-2 4-3 8-3s6-1 8-3" />
						<path d="M4 18c2-2 4-3 8-3s6-1 8-3" opacity="0.6" />
					</svg>
				</div>
				<div class="rdk-feature-title">Telemetry you can trust</div>
			</div>
			<p class="rdk-feature-desc">Unified event + metrics stream for debugging, replay, and performance tuning.</p>
		</div>

		<div class="rdk-feature reveal" style="transition-delay:0.24s">
			<div class="rdk-feature-top">
				<div class="rdk-ico" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M12 2l9 4-9 4-9-4 9-4z" />
						<path d="M3 10v7c0 2 4 5 9 5s9-3 9-5v-7" />
					</svg>
				</div>
				<div class="rdk-feature-title">Safety defaults</div>
			</div>
			<p class="rdk-feature-desc">Current/velocity limits, watchdogs, and an E‑stop workflow built into the stack.</p>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section class="rdk-section" id="included">
	<div class="rdk-grid">
		<div class="reveal">
			<span class="section-label">In the box</span>
			<h2 class="section-title">A complete kit for real experiments</h2>
			<p class="section-body">
				Designed to be used on a bench, in a lab, and in the field. Bring a laptop and start running
				experiments the same day.
			</p>
		</div>

		<div class="rdk-card reveal" style="transition-delay:0.12s">
			<div class="rdk-card-title">Includes</div>
			<ul class="rdk-bullets">
				<li>Controller + power distribution</li>
				<li>Motor/actuator interface</li>
				<li>Sensor bus + timestamping</li>
				<li>Calibration + test utilities</li>
				<li>Example projects + starter templates</li>
			</ul>
			<div class="rdk-note">Exact BOM may vary by configuration.</div>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section class="rdk-section" id="buy">
	<span class="section-label reveal">Pricing</span>
	<h2 class="section-title reveal">Start building this week</h2>

	<div class="rdk-pricing">
		<article class="rdk-tier reveal">
			<div class="rdk-tier-name">Starter</div>
			<div class="rdk-tier-desc">For individuals and small teams prototyping behaviors.</div>
			<div class="rdk-tier-price">Contact</div>
			<ul class="rdk-tier-list">
				<li>Core controller stack</li>
				<li>Reference wiring + harnessing</li>
				<li>Example projects</li>
			</ul>
			<a class="btn-ghost rdk-tier-cta" href="#closing">Request details</a>
		</article>

		<article class="rdk-tier featured reveal" style="transition-delay:0.08s">
			<div class="rdk-tier-badge">Recommended</div>
			<div class="rdk-tier-name">Team</div>
			<div class="rdk-tier-desc">For labs shipping weekly experiments and hardware iterations.</div>
			<div class="rdk-tier-price">
				{#if product}
					From
					{money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
				{:else}
					Live pricing (Storefront API)
				{/if}
			</div>
			<ul class="rdk-tier-list">
				<li>Everything in Starter</li>
				<li>Spare modules for swap + repair</li>
				<li>Bring-up checklist + test plan</li>
			</ul>
			{#if firstVariant}
				<form method="POST" action="?/addToCart" class="rdk-tier-cta">
					<input type="hidden" name="variantId" value={firstVariant.id} />
					<input type="hidden" name="quantity" value="1" />
					<button class="btn-primary" type="submit" disabled={!firstVariant.availableForSale}>
						{firstVariant.availableForSale ? 'Checkout' : 'Sold out'}
					</button>
				</form>
			{:else}
				<a class="btn-primary rdk-tier-cta" href="#closing">Get a quote</a>
			{/if}
		</article>

		<article class="rdk-tier reveal" style="transition-delay:0.16s">
			<div class="rdk-tier-name">Lab</div>
			<div class="rdk-tier-desc">For orgs standardizing on a kit across multiple projects.</div>
			<div class="rdk-tier-price">Contact</div>
			<ul class="rdk-tier-list">
				<li>Everything in Team</li>
				<li>Multi-kit onboarding session</li>
				<li>Priority support channel</li>
			</ul>
			<a class="btn-ghost rdk-tier-cta" href="#closing">Talk to us</a>
		</article>
	</div>
</section>

<div class="hr-line"></div>

<section class="rdk-section" id="faq">
	<span class="section-label reveal">FAQ</span>
	<h2 class="section-title reveal">Common questions</h2>

	<div class="rdk-faq">
		<details class="rdk-faq-item reveal">
			<summary>Is this a toy kit?</summary>
			<p>
				No — it’s designed for real robotics development. The focus is reliability, safety, and fast iteration
				loops for engineering teams.
			</p>
		</details>
		<details class="rdk-faq-item reveal" style="transition-delay:0.08s">
			<summary>What software does it work with?</summary>
			<p>
				The kit is designed to integrate cleanly with modern robotics workflows. If you have a preferred stack,
				we’ll align the configuration to your environment.
			</p>
		</details>
		<details class="rdk-faq-item reveal" style="transition-delay:0.16s">
			<summary>Can I buy replacement parts?</summary>
			<p>
				Yes — the kit is modular by design. Replacement modules and spares are available depending on your
				configuration.
			</p>
		</details>
	</div>
</section>

<div class="hr-line"></div>

<section class="rdk-closing" id="closing">
	<div class="rdk-closing-inner">
		<div class="reveal">
			<span class="section-label">Next step</span>
			<h2 class="section-title">Tell us what you’re building</h2>
			<p class="section-body">
				Share your project goals, target timelines, and the kind of experiments you run weekly — we’ll recommend
				a configuration that gets you to a stable loop quickly.
			</p>
			<div class="hero-ctas" style="margin-top:28px;">
				<JoinUsLink className="btn-primary" />
				<a class="btn-ghost" href="mailto:sales@yourdomain.com">Email sales</a>
			</div>
			<div class="rdk-note" style="margin-top:14px;">Replace “Email sales” with your preferred contact link.</div>
		</div>

		<div class="rdk-closing-card reveal" style="transition-delay:0.12s">
			<div class="rdk-card-title">Ideal for</div>
			<ul class="rdk-bullets">
				<li>Robotics startups</li>
				<li>University labs</li>
				<li>R&amp;D teams prototyping autonomy</li>
				<li>Hardware teams validating actuators and sensors</li>
			</ul>
		</div>
	</div>
</section>
