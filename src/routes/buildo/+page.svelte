<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { setupRevealObserver } from '$lib/utils/reveal';

	onMount(() => {
		return setupRevealObserver({ threshold: 0.12 });
	});

	const controlLayers = [
		{
			tier: 'System 2',
			rate: '~1 Hz',
			title: 'Reasoning',
			body: 'Vision-Language Action model. Understands instructions, decomposes complex tasks into steps, and plans over long horizons.'
		},
		{
			tier: 'System 1',
			rate: '~10 Hz',
			title: 'Motion',
			body: 'On-board foundation model handling motion planning and coarse action control, running locally on the robot.'
		},
		{
			tier: 'System 0',
			rate: '~100 Hz',
			title: 'Reflex',
			body: 'Microcontroller-level model driving fine-motor control through direct tactile feedback.'
		}
	];

	// Torque is quoted per joint. Newton-metres (N·m) is the torque unit; N/m is
	// stiffness, so the spelling here is deliberate.
	const specs = [
		{ label: 'Payload', value: '8', unit: 'KG' },
		{ label: 'Height', value: '4–5', unit: 'FT' },
		{ label: 'Speed', value: '2.3', unit: 'KM/H' },
		{ label: 'Joint torque', value: '15', unit: 'N·M' },
		{ label: 'Hands', value: '5', unit: 'FINGER' },
		{ label: 'Reflex loop', value: '100', unit: 'HZ' }
	];

	const applications = [
		{ name: 'Industrial assembly', detail: 'Precision manipulation on the line' },
		{ name: 'Warehouse picking', detail: 'Grasp planning at scale' },
		{ name: 'Vehicle operation', detail: 'Steering and pedal control' },
		{ name: 'Cooking', detail: 'Ingredient prep, stove operation' },
		{ name: 'Home assistance', detail: 'Cleaning and object handling' },
		{ name: 'Your use case', detail: 'Build and publish your own' }
	];
</script>

<svelte:head>
	<title>Buildo — Humanoid Robot for Physical AI | STARFORGE</title>
	<meta
		name="description"
		content="Buildo is a general-purpose humanoid built for physical AI development. Three-layer on-board intelligence, five-fingered dexterous hands, and a data collection platform that trains itself."
	/>
</svelte:head>

<div class="bd-scan" aria-hidden="true"></div>

<header class="bd-hero">
	<div class="hero-scan-lines" aria-hidden="true"></div>
	<div class="bd-hero-inner">
		<div class="bd-hero-text">
			<h1 class="bd-hero-title">Buildo</h1>
			<p class="bd-hero-sub">
				A general-purpose humanoid, built to work in the spaces people already work in.
			</p>
			<div class="bd-hero-ctas">
				<a class="btn-primary" href={resolve('/buildo-prebook')}>Prebook</a>
				<a class="btn-ghost" href="https://portal.starforgerobotics.com">Simulate Buildo</a>
			</div>

			<dl class="bd-specs" aria-label="Buildo specifications">
				{#each specs as spec (spec.label)}
					<div class="bd-spec">
						<dt class="bd-spec-label">{spec.label}</dt>
						<dd class="bd-spec-value">
							{spec.value}<span class="bd-spec-unit">{spec.unit}</span>
						</dd>
					</div>
				{/each}
			</dl>
		</div>
		<div class="bd-hero-visual">
			<img src="/assets/buildo-robot.jpg" alt="Buildo humanoid robot" fetchpriority="high" />
		</div>
	</div>
</header>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-section-head reveal">
		<span class="section-label">The Architecture</span>
		<h2 class="section-title">Three layers of<br /><span>on-board intelligence</span></h2>
		<p class="section-body">
			Reasoning, motion, and reflex run as separate loops at separate speeds — from cloud-scale
			planning down to sub-100ms fine-motor control. Every layer is modular. Swap in your own model
			at any tier.
		</p>
	</div>

	<div class="bd-layers">
		{#each controlLayers as layer, i (layer.tier)}
			<div class="bd-layer reveal" style="transition-delay:{0.1 + i * 0.1}s">
				<div class="bd-layer-top">
					<span class="bd-layer-tier">{layer.tier}</span>
					<span class="bd-layer-rate">{layer.rate}</span>
				</div>
				<div class="bd-layer-title">{layer.title}</div>
				<p class="bd-layer-body">{layer.body}</p>
			</div>
		{/each}
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-split">
		<div class="reveal">
			<span class="section-label">Compute</span>
			<h2 class="section-title">Any sized model,<br /><span>running on the robot</span></h2>
			<p class="section-body">
				The constraint on humanoid robotics has never been the chassis — it is what you can actually
				run inside it. Buildo is built around a compute architecture that removes the model-size
				ceiling, so capability is no longer traded away for latency.
			</p>
			<p class="section-body" style="margin-top:20px;">
				That changes the economics of deployment. Models that previously required a server can run
				where the work happens.
			</p>
		</div>
		<div class="bd-card reveal" style="transition-delay:0.12s">
			<div class="bd-card-title">Built to be programmed</div>
			<ul class="bd-bullets">
				<li><strong>Open joint actuator</strong> — FOC firmware source included</li>
				<li><strong>Data collection SDK</strong> — logging and replay tooling</li>
				<li><strong>Example pipelines</strong> — training scaffolds you can fork</li>
				<li><strong>Modular model layer</strong> — bring your own weights</li>
			</ul>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-split reverse">
		<div class="reveal">
			<span class="section-label">Dexterity</span>
			<h2 class="section-title">Five-fingered hands<br /><span>for a human world</span></h2>
			<p class="section-body">
				Nearly every tool and object in industry was designed for a human hand. Five-fingered
				dexterous manipulation is not a stylistic choice — it is the requirement for operating in
				environments that already exist, without rebuilding them around the robot.
			</p>
		</div>
		<div class="bd-card reveal" style="transition-delay:0.12s">
			<div class="bd-card-title">Learning by demonstration</div>
			<p class="bd-card-body">
				Our wearable system lets an operator move the robot directly and feel the same forces its
				hands sense. Human skill transfers into the model without decades of experiential learning —
				and every session becomes training data.
			</p>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-section-head reveal">
		<span class="section-label">Applications</span>
		<h2 class="section-title">What developers<br /><span>are building</span></h2>
		<p class="section-body">
			Developers build use-case apps on Buildo and publish them. Every deployment generates the
			training data that makes the underlying model better.
		</p>
	</div>

	<div class="bd-apps">
		{#each applications as app, i (app.name)}
			<div class="bd-app reveal" style="transition-delay:{0.06 * i}s">
				<div class="bd-app-name">{app.name}</div>
				<div class="bd-app-detail">{app.detail}</div>
			</div>
		{/each}
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section bd-closing">
	<div class="bd-closing-inner reveal">
		<span class="section-label">Get Started</span>
		<h2 class="section-title">Put Buildo<br /><span>to work</span></h2>
		<p class="section-body">
			Reserve a unit, or run it in simulation first through the developer portal. Tell us the use
			case and the manipulation tasks involved and we will get you the right configuration.
		</p>
		<div class="bd-hero-ctas" style="margin-top:36px;">
			<a class="btn-primary" href={resolve('/buildo-prebook')}>Prebook</a>
			<a class="btn-ghost" href="https://portal.starforgerobotics.com">Simulate Buildo</a>
		</div>
	</div>
</section>

<style>
	/* Carries the hero's scan-line texture across the whole page so the sections
	   below are not flat white. */
	.bd-scan {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 3px,
			rgba(0, 0, 0, 0.036) 3px,
			rgba(0, 0, 0, 0.036) 4px
		);
	}

	.bd-hero {
		position: relative;
		padding: calc(var(--header-height, 96px) + 40px) 48px 88px;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.9) 100%),
			radial-gradient(circle at 25% 20%, rgba(20, 18, 16, 0.072) 0%, transparent 55%),
			linear-gradient(135deg, #f7f4ef 0%, #efe9df 40%, #faf8f4 100%);
		overflow: hidden;
		border-bottom: 1px solid var(--border);
	}

	.bd-hero-inner {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 64px;
		/* Top-aligned, not centred: the name should start high and the spec
		   block below it fills the column against the tall render. */
		align-items: start;
		max-width: 1200px;
		margin: 0 auto;
	}

	.bd-hero-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(64px, 9vw, 140px);
		font-weight: 500;
		line-height: 0.92;
		letter-spacing: 0.02em;
		color: var(--ink);
		margin: 16px 0 20px;
	}

	.bd-hero-sub {
		font-size: clamp(15px, 1.3vw, 18px);
		line-height: 1.7;
		color: rgba(20, 18, 16, 0.82);
		max-width: 46ch;
		margin-bottom: 36px;
	}

	.bd-hero-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
	}

	/* Render ships on a flat #cfcdce studio backdrop; the panel extends it so the
	   light product shot reads as deliberate against the dark hero. */
	.bd-hero-visual {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #cfcdce;
		border: 2px solid var(--border);
		overflow: hidden;
	}

	.bd-hero-visual img {
		display: block;
		width: auto;
		max-width: 100%;
		max-height: 620px;
		height: auto;
	}

	/* ── SPEC BLOCK ── */
	/* Sits directly under the CTAs in the left column so the text side fills to
	   roughly the height of the portrait render beside it. */
	.bd-specs {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 26px 20px;
		margin: 44px 0 0;
		padding-top: 32px;
		border-top: 1px solid var(--border);
	}

	.bd-spec-label {
		font-family: 'Space Mono', monospace;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 8px;
	}

	.bd-spec-value {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(28px, 2.4vw, 38px);
		line-height: 1;
		letter-spacing: 0.02em;
		color: var(--ink);
		margin: 0;
	}

	.bd-spec-unit {
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--text-muted);
		margin-left: 6px;
		white-space: nowrap;
	}

	/* ── SECTIONS ── */
	.bd-section {
		position: relative;
		z-index: 1;
		padding: 110px 48px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.bd-section-head {
		max-width: 62ch;
		margin-bottom: 64px;
	}

	.bd-split {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 72px;
		align-items: center;
	}

	.bd-split.reverse > :first-child {
		order: 2;
	}

	/* ── CONTROL LAYERS ── */
	.bd-layers {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.bd-layer {
		padding: 32px 28px;
		border: 2px solid var(--border);
		background: rgba(20, 18, 16, 0.033);
		transition: border-color 0.3s ease;
	}

	.bd-layer:hover {
		border-color: var(--border-strong);
	}

	.bd-layer-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 22px;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--border);
	}

	.bd-layer-tier {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.bd-layer-rate {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 11px;
		color: var(--text-muted);
	}

	.bd-layer-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 30px;
		letter-spacing: 0.04em;
		color: var(--ink);
		margin-bottom: 12px;
	}

	.bd-layer-body {
		font-size: 14px;
		line-height: 1.75;
		color: rgba(20, 18, 16, 0.82);
	}

	/* ── CARDS ── */
	.bd-card {
		padding: 40px 36px;
		border: 2px solid var(--border);
		background: linear-gradient(135deg, rgba(20, 18, 16, 0.036) 0%, transparent 65%);
	}

	.bd-card-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 26px;
		letter-spacing: 0.05em;
		color: var(--accent);
		margin-bottom: 22px;
	}

	.bd-card-body {
		font-size: 15px;
		line-height: 1.8;
		color: rgba(20, 18, 16, 0.82);
	}

	.bd-bullets {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.bd-bullets li {
		position: relative;
		padding-left: 20px;
		font-size: 14px;
		line-height: 1.7;
		color: rgba(20, 18, 16, 0.82);
	}

	.bd-bullets li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 9px;
		width: 6px;
		height: 1px;
		background: var(--accent);
	}

	.bd-bullets strong {
		color: var(--ink);
		font-weight: 500;
	}

	/* ── APPLICATIONS ── */
	/* Inner rules are drawn by the grid gap showing the background through, so
	   the gap has to track the outer border width or the grid looks mismatched. */
	.bd-apps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2px;
		background: var(--border);
		border: 2px solid var(--border);
	}

	.bd-app {
		padding: 34px 28px;
		background: #fcfaf7;
		transition: background 0.3s ease;
	}

	.bd-app:hover {
		background: rgba(20, 18, 16, 0.029);
	}

	.bd-app-name {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 24px;
		letter-spacing: 0.04em;
		color: var(--ink);
		margin-bottom: 8px;
	}

	.bd-app-detail {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 11px;
		line-height: 1.6;
		color: var(--text-muted);
	}

	/* ── CLOSING ── */
	.bd-closing-inner {
		max-width: 62ch;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 900px) {
		.bd-hero {
			padding: calc(var(--header-height, 96px) + 32px) 24px 64px;
		}

		.bd-hero-inner,
		.bd-split {
			grid-template-columns: 1fr;
			gap: 48px;
		}

		.bd-split.reverse > :first-child {
			order: 0;
		}

		.bd-section {
			padding: 80px 24px;
		}

		.bd-section-head {
			margin-bottom: 48px;
		}

		.bd-layers,
		.bd-apps {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 560px) {
		.bd-specs {
			grid-template-columns: repeat(2, 1fr);
			gap: 22px 16px;
		}
	}
</style>
