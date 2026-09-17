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

	const components = [
		{
			tag: 'Egocentric Video',
			title: 'Glasses',
			body: 'Wide-angle stereo cameras mounted at eye level capture exactly what the operator sees. Every session streams first-person video and depth data directly into the training pipeline — no extra capture rig required.'
		},
		{
			tag: 'Teleoperation',
			title: 'Gloves',
			body: "Instrumented gloves mirror your hand pose onto Buildo's five-fingered hands in real time. Force feedback closes the loop so you feel what the robot touches, and every motion is recorded as demonstration data."
		}
	];

	const specs: Array<{ label: string; value: string; unit: string; phrase?: boolean }> = [
		{ label: 'Camera resolution', value: '4K', unit: 'PER EYE' },
		{ label: 'Frame rate', value: '60', unit: 'FPS' },
		{ label: 'Latency', value: '<5', unit: 'MS' },
		{ label: 'Finger joints tracked', value: '21', unit: 'PER HAND' },
		{ label: 'Force feedback', value: 'Fingertip', unit: '', phrase: true },
		{ label: 'Connectivity', value: 'USB-C', unit: '+ Wireless' },
		{ label: 'SDK', value: 'Open', unit: 'SOURCE' },
		{ label: 'Compatibility', value: 'Buildo', unit: 'ROBOT' }
	];

	const useCases = [
		{ name: 'Data collection', detail: 'Record demonstrations at scale' },
		{ name: 'Imitation learning', detail: 'Train from human examples' },
		{ name: 'Remote operation', detail: 'Control Buildo from anywhere' },
		{ name: 'Sim-to-real', detail: 'Replay sessions in simulation' },
		{ name: 'Fine-motor tasks', detail: 'Dexterous manipulation demos' },
		{ name: 'Your pipeline', detail: 'Plug in your own model' }
	];
</script>

<svelte:head>
	<title>Buildo Development Kit - Egocentric Glasses & Teleoperation Gloves | STARFORGE</title>
	<meta
		name="description"
		content="The Buildo Development Kit includes egocentric video glasses and teleoperation gloves for training humanoid robots through human demonstration. Capture first-person video and hand motion data directly into your training pipeline."
	/>
</svelte:head>

<div class="bd-scan" aria-hidden="true"></div>

<header class="rdk-hero" id="order">
	<div class="hero-scan-lines" aria-hidden="true"></div>
	<div class="rdk-product-layout">
		<!-- LEFT: Image gallery / kit visual -->
		<div class="rdk-gallery">
			{#if images.length > 0}
				<div class="rdk-main-image">
					<img
						src={images[selectedImage].url}
						alt={images[selectedImage].altText ?? 'Buildo Development Kit'}
						fetchpriority="high"
					/>
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
			{:else}
				<div class="rdk-kit-preview">
					<figure class="kit-figure kit-figure--glasses">
						<img src="/assets/buildo-kit-glasses.png" alt="Buildo egocentric video glasses" />
						<figcaption>Egocentric glasses</figcaption>
					</figure>
					<figure class="kit-figure kit-figure--gloves">
						<img src="/assets/buildo-kit-gloves.png" alt="Buildo teleoperation gloves" />
						<figcaption>Teleoperation gloves</figcaption>
					</figure>
				</div>
			{/if}
		</div>

		<!-- RIGHT: Product info -->
		<div class="rdk-product-info">
			<span class="hero-tag">developer accessories for Buildo</span>
			<h1 class="rdk-product-title">{product?.title ?? 'Buildo Development Kit'}</h1>

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
					<a class="btn-ghost" href="/buildo">View Buildo Robot</a>
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
						href="mailto:contact@starforgerobotics.com?subject=Buildo%20Development%20Kit"
						>Order by email</a
					>
					<a class="btn-ghost" href="/buildo">View Buildo Robot</a>
				</div>
			{/if}

			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="rdk-specs-link" href="#specs">↓ Full specifications and features</a>

			<div class="rdk-divider-line"></div>

			<div class="rdk-whats-included">
				<span class="rdk-wi-label">What's included</span>
				<div class="rdk-wi-tags">
					<span class="rdk-wi-tag">Egocentric glasses</span>
					<span class="rdk-wi-tag">Teleoperation gloves</span>
					<span class="rdk-wi-tag">Data collection SDK</span>
					<span class="rdk-wi-tag">Example pipelines</span>
				</div>
			</div>
		</div>
	</div>
</header>

<div class="hr-line"></div>

<section class="bd-section bd-spec-section" id="specs">
	<dl class="bd-specs" aria-label="Buildo Development Kit specifications">
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
		<span class="section-label">The Kit</span>
		<h2 class="section-title">Two tools that close<br /><span>the data loop</span></h2>
		<p class="section-body">
			Collecting high-quality robot training data requires capturing what the operator sees and what
			their hands do — simultaneously, at low latency, and in a format your model can consume
			directly. The Buildo Development Kit is built around those two requirements.
		</p>
	</div>

	<div class="bd-components">
		{#each components as comp, i (comp.title)}
			<div class="bd-component reveal" style="transition-delay:{0.1 + i * 0.12}s">
				<div class="bd-component-img">
					{#if comp.title === 'Glasses'}
						<img src="/assets/buildo-kit-glasses.png" alt="Buildo egocentric video glasses" />
					{:else}
						<img src="/assets/buildo-kit-gloves.png" alt="Buildo teleoperation gloves" />
					{/if}
				</div>
				<div class="bd-component-content">
					<span class="bd-component-tag">{comp.tag}</span>
					<div class="bd-component-title">{comp.title}</div>
					<p class="bd-component-body">{comp.body}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-split">
		<div class="reveal">
			<span class="section-label">Egocentric Vision</span>
			<h2 class="section-title">See what the<br /><span>robot sees</span></h2>
			<p class="section-body">
				The glasses mount at eye level so the camera perspective matches the robot's head position
				exactly. Stereo depth is computed on-device and streamed alongside the RGB feed — everything
				your vision model needs, captured in one pass.
			</p>
			<p class="section-body" style="margin-top:20px;">
				Every session is timestamped and synchronised with the glove stream, so vision and action
				data are always aligned for training.
			</p>
		</div>
		<div class="bd-card reveal" style="transition-delay:0.12s">
			<div class="bd-card-title">Built for training pipelines</div>
			<ul class="bd-bullets">
				<li><strong>Stereo depth</strong> - on-device disparity map at 60 fps</li>
				<li><strong>Timestamped frames</strong> - aligned with glove joint stream</li>
				<li><strong>USB-C + wireless</strong> - tethered or untethered operation</li>
				<li><strong>SDK included</strong> - direct integration with Buildo data SDK</li>
			</ul>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-split reverse">
		<div class="reveal">
			<span class="section-label">Teleoperation</span>
			<h2 class="section-title">Your hands,<br /><span>the robot's hands</span></h2>
			<p class="section-body">
				The gloves track all 21 joints per hand and stream pose data to Buildo at under 5 ms
				latency. Fingertip force feedback returns what the robot is touching so the operator can
				feel — and react to — the manipulation in real time.
			</p>
			<p class="section-body" style="margin-top:20px;">
				Every teleoperation session is a demonstration. The motion capture runs in parallel with the
				glasses so you collect a complete observation-action pair with no post-processing.
			</p>
		</div>
		<div class="bd-card reveal" style="transition-delay:0.12s">
			<div class="bd-card-title">Human skill transfer</div>
			<p class="bd-card-body">
				Decades of dexterous experience live in your hands. The gloves make that experience machine
				readable in a single session — no reward engineering, no simulation, no domain gap. Plug the
				output directly into an imitation learning or diffusion policy trainer.
			</p>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-section-head reveal">
		<span class="section-label">Use Cases</span>
		<h2 class="section-title">What developers<br /><span>are building</span></h2>
		<p class="section-body">
			The kit is the entry point for every data-driven workflow on Buildo. Teams use it to bootstrap
			new skills, fine-tune existing models, and run large-scale teleoperation studies.
		</p>
	</div>

	<div class="bd-apps">
		{#each useCases as uc, i (uc.name)}
			<div class="bd-app reveal" style="transition-delay:{0.06 * i}s">
				<div class="bd-app-name">{uc.name}</div>
				<div class="bd-app-detail">{uc.detail}</div>
			</div>
		{/each}
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section bd-closing">
	<div class="bd-closing-inner reveal">
		<span class="section-label">Get Started</span>
		<h2 class="section-title">Start collecting<br /><span>training data</span></h2>
		<p class="section-body">
			Order the kit, plug it into your Buildo, and run your first demonstration session the same day.
			Every recording feeds directly into the skills store training pipeline.
		</p>
		<div class="bd-hero-ctas" style="margin-top:36px;">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="btn-primary" href="#order">Order Now</a>
			<a class="btn-ghost" href="/buildo">View Buildo Robot</a>
		</div>
	</div>
</section>

<style>
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

	/* ── KIT PREVIEW (fallback when no Shopify images) ── */
	.rdk-kit-preview {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		padding: 32px;
		border: 2px solid var(--border);
		background: rgba(20, 18, 16, 0.022);
	}

	.kit-figure {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		margin: 0;
	}

	.kit-figure img {
		display: block;
		width: 100%;
		height: auto;
		max-height: 200px;
		object-fit: contain;
	}

	.kit-figure figcaption {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	/* ── SPEC BLOCK ── */
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

	/* ── COMPONENT CARDS ── */
	.bd-components {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	.bd-component {
		display: grid;
		grid-template-rows: auto 1fr;
		border: 2px solid var(--border);
		background: rgba(20, 18, 16, 0.022);
		overflow: hidden;
		transition: border-color 0.3s ease;
	}

	.bd-component:hover {
		border-color: var(--border-strong);
	}

	.bd-component-img {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px 36px 24px;
		background: rgba(20, 18, 16, 0.018);
		border-bottom: 1px solid var(--border);
	}

	.bd-component-img img {
		display: block;
		width: auto;
		max-width: 100%;
		height: 180px;
		object-fit: contain;
	}

	.bd-component-content {
		padding: 28px 32px 36px;
	}

	.bd-component-tag {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--accent);
		display: block;
		margin-bottom: 10px;
	}

	.bd-component-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 36px;
		letter-spacing: 0.04em;
		color: var(--ink);
		margin-bottom: 14px;
	}

	.bd-component-body {
		font-size: 14px;
		line-height: 1.8;
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

	/* ── USE CASES ── */
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

		.bd-components,
		.bd-apps {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 560px) {
		.bd-specs {
			grid-template-columns: repeat(2, 1fr);
			gap: 22px 16px;
		}

		.rdk-kit-preview {
			grid-template-columns: 1fr;
		}
	}
</style>
