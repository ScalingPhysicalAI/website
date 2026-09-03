<script lang="ts">
	import { onMount } from 'svelte';
	import { setupRevealObserver } from '$lib/utils/reveal';

	let { data } = $props();

	const product = data.product;

	const images = product
		? product.images.nodes.length > 0
			? product.images.nodes
			: product.featuredImage
				? [product.featuredImage]
				: []
		: [];

	const price = product
		? new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: product.priceRange.minVariantPrice.currencyCode
			}).format(Number(product.priceRange.minVariantPrice.amount))
		: null;

	const variant = product?.variants.nodes[0];
	const available = variant?.availableForSale ?? true;
	const origin = product?.origin?.value?.replace(/August/gi, 'September') ?? null;
	// Matches a tag on the Shopify product, so it has to keep accepting the
	// original 'prebook' spelling: the store still carries that tag even though
	// the site now says preorder everywhere.
	const isPreorder = (product?.tags ?? []).some((tag: string) => {
		const t = tag.toLowerCase();
		return t === 'preorder' || t === 'prebook';
	});

	let selectedImage = $state(0);
	let quantity = $state(1);

	function increment() {
		quantity = Math.min(quantity + 1, 99);
	}
	function decrement() {
		quantity = Math.max(quantity - 1, 1);
	}

	const cartUrl = $derived(
		data.variantId ? `https://${data.storeDomain}/cart/${data.variantId}:${quantity}` : null
	);

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
	const specs: Array<{ label: string; value: string; unit: string; phrase?: boolean }> = [
		{ label: 'Payload', value: '18', unit: 'LB' },
		{ label: 'Height', value: '4–5', unit: 'FT' },
		{ label: 'Speed', value: '1.4', unit: 'MPH' },
		{ label: 'Joint torque', value: '15', unit: 'N·M' },
		{ label: 'Hands', value: '5', unit: 'FINGER' },
		{ label: 'Battery', value: 'Hot Swappable', unit: '', phrase: true },
		{ label: 'Display', value: '5', unit: 'INCH HDMI' },
		{ label: 'Depth Camera', value: '8MP', unit: 'BINOCULAR USB CAMERA' }
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
	<title>Buildo - Preorder the Humanoid for Physical AI | STARFORGE</title>
	<meta
		name="description"
		content="Preorder Buildo, a general-purpose humanoid built for physical AI development. Three-layer on-board intelligence, five-fingered dexterous hands, and a data collection platform that trains itself."
	/>
</svelte:head>

<div class="bd-scan" aria-hidden="true"></div>

<header class="rdk-hero" id="preorder">
	<div class="hero-scan-lines" aria-hidden="true"></div>
	<div class="rdk-product-layout">
		<!-- LEFT: Image gallery -->
		<div class="rdk-gallery">
			<div class="rdk-main-image">
				{#if images[selectedImage]}
					<img
						src={images[selectedImage].url}
						alt={images[selectedImage].altText ?? product?.title ?? 'Buildo'}
						fetchpriority="high"
					/>
				{:else}
					<div class="rdk-image-placeholder">
						<span class="rdk-placeholder-label">Robot Dev Kit</span>
					</div>
				{/if}
			</div>
			{#if images.length > 1}
				<div class="rdk-thumbnails">
					{#each images as img, i (img.url)}
						<button
							class="rdk-thumb"
							class:active={selectedImage === i}
							onclick={() => (selectedImage = i)}
							aria-label="View image {i + 1}"
						>
							<img src={img.url} alt={img.altText ?? ''} />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- RIGHT: Product info -->
		<div class="rdk-product-info">
			<span class="hero-tag">humanoid robot + dev kit</span>
			<h1 class="rdk-product-title">{product?.title ?? 'Buildo'}</h1>

			{#if product}
				<div class="rdk-price-row">
					<span class="rdk-price">{price}</span>
					<span class="rdk-badge" class:rdk-badge--out={!available}>
						{available ? 'Available' : 'Sold Out'}
					</span>
				</div>

				{#if origin}
					<p class="rdk-origin">{origin}</p>
				{/if}

				<div class="rdk-divider-line"></div>

				<div class="rdk-quantity-block">
					<span class="rdk-qty-label">Quantity</span>
					<div class="rdk-qty-control">
						<button
							class="rdk-qty-btn"
							onclick={decrement}
							disabled={quantity <= 1}
							aria-label="Decrease">−</button
						>
						<span class="rdk-qty-val">{quantity}</span>
						<button class="rdk-qty-btn" onclick={increment} aria-label="Increase">+</button>
					</div>
				</div>

				<div class="rdk-ctas">
					{#if cartUrl && available}
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a class="btn-primary rdk-btn-buy" href={cartUrl}
							>{isPreorder ? 'Preorder' : 'Order Now'}</a
						>
					{/if}
					<a class="btn-ghost" href="https://portal.starforgerobotics.com">Simulate Buildo</a>
				</div>
			{:else}
				<p class="rdk-origin">
					Online reservations are temporarily unavailable. Email us and we will hold your place in
					the queue.
				</p>

				<div class="rdk-divider-line"></div>

				<div class="rdk-ctas">
					<a
						class="btn-primary rdk-btn-buy"
						href="mailto:contact@starforgerobotics.com?subject=Buildo%20Preorder">Preorder by email</a
					>
					<a class="btn-ghost" href="https://portal.starforgerobotics.com">Simulate Buildo</a>
				</div>
			{/if}

			<!-- The specifications now live further down this same page rather than on
			     a separate one, so this jumps rather than navigates. -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="rdk-specs-link" href="#specs">↓ Full specifications and features</a>

			<div class="rdk-divider-line"></div>

			<div class="rdk-whats-included">
				<span class="rdk-wi-label">What's included</span>
				<div class="rdk-wi-tags">
					<span class="rdk-wi-tag">Wearable dextrous hand</span>
					<span class="rdk-wi-tag">Data collection SDK</span>
					<span class="rdk-wi-tag">FOC firmware source</span>
					<span class="rdk-wi-tag">Example training pipelines</span>
				</div>
			</div>
		</div>
	</div>
</header>

<div class="hr-line"></div>

<!-- Kept from the old hero, which the product block above replaced. These are the
     headline numbers for the machine and there is nowhere else on the site that
     carries them. -->
<section class="bd-section bd-spec-section" id="specs">
	<dl class="bd-specs" aria-label="Buildo specifications">
		{#each specs as spec (spec.label)}
			<div class="bd-spec">
				<dt class="bd-spec-label">{spec.label}</dt>
				<dd class="bd-spec-value" class:bd-spec-value--phrase={spec.phrase}>
					{spec.value}<span class="bd-spec-unit">{spec.unit}</span>
				</dd>
			</div>
		{/each}
	</dl>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-section-head reveal">
		<span class="section-label">The Architecture</span>
		<h2 class="section-title">Three layers of<br /><span>intelligence</span></h2>
		<p class="section-body">
			Reasoning, motion, and reflex run as separate loops at separate speeds - from cloud-scale
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
			<span class="section-label">Intelligence</span>
			<h2 class="section-title">Any sized model,<br /><span>running on the robot</span></h2>
			<p class="section-body">
				The constraint on humanoid robotics has never been the chassis - it is what you can actually
				run inside it. Buildo is built around an intelligence architecture that removes the model-size
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
				<li><strong>Open joint actuator</strong> - FOC firmware source included</li>
				<li><strong>Data collection SDK</strong> - logging and replay tooling</li>
				<li><strong>Example pipelines</strong> - training scaffolds you can fork</li>
				<li><strong>Modular model layer</strong> - bring your own weights</li>
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
				dexterous manipulation is not a stylistic choice - it is the requirement for operating in
				environments that already exist, without rebuilding them around the robot.
			</p>
		</div>
		<div class="bd-card reveal" style="transition-delay:0.12s">
			<div class="bd-card-title">Learning by demonstration</div>
			<p class="bd-card-body">
				Our wearable system lets an operator move the robot directly and feel the same forces its
				hands sense. Human skill transfers into the model without decades of experiential learning -
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
			<!-- Ordering happens at the top of this page now, so this returns there. -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="btn-primary" href="#preorder">Preorder</a>
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

	.bd-hero-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
	}

	/* Came across with the product block; the rest of that page's styling is
	   global, this one rule was scoped to it. */
	.rdk-specs-link {
		display: inline-block;
		margin-top: 20px;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-muted);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.rdk-specs-link:hover {
		color: var(--accent);
		border-bottom-color: var(--accent);
	}

	/* ── SPEC BLOCK ── */
	/* A band of its own now that the product block has taken the top of the page,
	   so it can run as a single row of stats rather than stacking in a hero column. */
	.bd-spec-section {
		padding-top: 72px;
		padding-bottom: 72px;
	}

	.bd-specs {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 26px 20px;
		margin: 0;
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

	/* Bebas Neue has no lowercase glyphs, so mixed-case phrases use Barlow. */
	.bd-spec-value--phrase {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(20px, 1.7vw, 26px);
		font-weight: 600;
		letter-spacing: 0.01em;
		line-height: 1.15;
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
		.bd-split {
			grid-template-columns: 1fr;
			gap: 48px;
		}

		.bd-specs {
			grid-template-columns: repeat(3, 1fr);
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
