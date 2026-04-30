<script lang="ts">
	import { onMount } from 'svelte';
	import { setupRevealObserver } from '$lib/utils/reveal';

	let { data } = $props();

	const product = data.product;
	const images = product.images.nodes.length > 0
		? product.images.nodes
		: product.featuredImage
		? [product.featuredImage]
		: [];

	const price = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: product.priceRange.minVariantPrice.currencyCode
	}).format(Number(product.priceRange.minVariantPrice.amount));

	const variant = product.variants.nodes[0];
	const available = variant?.availableForSale ?? true;

	let selectedImage = $state(0);
	let quantity = $state(1);

	function increment() { quantity = Math.min(quantity + 1, 99); }
	function decrement() { quantity = Math.max(quantity - 1, 1); }

	const cartUrl = $derived(
		data.variantId
			? `https://${data.storeDomain}/cart/${data.variantId}:${quantity}`
			: null
	);

	onMount(() => {
		return setupRevealObserver({ threshold: 0.12 });
	});
</script>

<svelte:head>
	<title>Humanoid Robot Dev Kit — ScalingPhysicalAI</title>
	<meta
		name="description"
		content="Dextrous wearable hand for robot training data collection and an open-source joint actuator. The developer platform for humanoid robots."
	/>
</svelte:head>

<header class="rdk-hero">
	<div class="hero-scan-lines" aria-hidden="true"></div>
	<div class="rdk-product-layout">

		<!-- LEFT: Image gallery -->
		<div class="rdk-gallery">
			<div class="rdk-main-image">
				{#if images[selectedImage]}
					<img
						src={images[selectedImage].url}
						alt={images[selectedImage].altText ?? product.title}
					/>
				{:else}
					<div class="rdk-image-placeholder">
						<span class="rdk-placeholder-label">Robot Dev Kit</span>
					</div>
				{/if}
			</div>
			{#if images.length > 1}
				<div class="rdk-thumbnails">
					{#each images as img, i}
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
			<span class="hero-tag">Humanoid Robot Dev Kit</span>
			<h1 class="rdk-product-title">{product.title}</h1>

			<div class="rdk-price-row">
				<span class="rdk-price">{price}</span>
				<span class="rdk-badge" class:rdk-badge--out={!available}>
					{available ? 'Available' : 'Sold Out'}
				</span>
			</div>

			<div class="rdk-divider-line"></div>

			<div class="rdk-quantity-block">
				<span class="rdk-qty-label">Quantity</span>
				<div class="rdk-qty-control">
					<button class="rdk-qty-btn" onclick={decrement} disabled={quantity <= 1} aria-label="Decrease">−</button>
					<span class="rdk-qty-val">{quantity}</span>
					<button class="rdk-qty-btn" onclick={increment} aria-label="Increase">+</button>
				</div>
			</div>

			<div class="rdk-ctas">
				{#if cartUrl && available}
					<a class="btn-primary rdk-btn-buy" href={cartUrl}>Order Now</a>
				{/if}
				<a class="btn-ghost" href="mailto:vipulsaini594@gmail.com">Contact Sales</a>
			</div>

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

<section class="rdk-section" id="platform">
	<div class="rdk-grid">
		<div class="reveal">
			<span class="section-label">The Platform</span>
			<h2 class="section-title">Android for<br /><span>humanoid robots</span></h2>
			<p class="section-body">
				The missing layer in humanoid robotics is not hardware — it is data. Without training data,
				robots cannot generalize to real-world tasks. We are building the platform that lets developers
				create, collect, and deploy robot behavior at scale.
			</p>
			<p class="section-body" style="margin-top:20px;">
				Developers build use-case apps — cooking, home assistance, vehicle operation — and publish
				them to our app store. Every deployment generates the training data that makes the underlying
				AI smarter.
			</p>
		</div>
		<div class="rdk-card reveal" style="transition-delay:0.12s">
			<div class="rdk-card-title">Apps developers are building</div>
			<ul class="rdk-bullets">
				<li>Cooking robot — ingredient prep, stove operation</li>
				<li>Home assistant — cleaning, object handling</li>
				<li>Vehicle operation — steering, pedal control</li>
				<li>Industrial assembly — precision manipulation</li>
				<li>Warehouse picking — grasp planning at scale</li>
			</ul>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section class="rdk-section rdk-closing" id="order">
	<div class="rdk-closing-inner">
		<div class="reveal">
			<span class="section-label">Get the kit</span>
			<h2 class="section-title">Start building<br /><span>your robot app</span></h2>
			<p class="section-body">
				Tell us what you're building — the use case, the manipulation tasks involved, and your
				timeline. We'll get you set up with the right configuration.
			</p>
			<div class="hero-ctas" style="margin-top:32px;">
				<a class="btn-primary" href="mailto:vipulsaini594@gmail.com">Order now</a>
				<a class="btn-ghost" href="https://github.com/ScalingPhysicalAI">View on GitHub</a>
			</div>
		</div>
		<div class="rdk-closing-card reveal" style="transition-delay:0.12s">
			<div class="rdk-card-title">What's included</div>
			<ul class="rdk-bullets">
				<li>Dextrous wearable hand hardware</li>
				<li>Data collection SDK + logging tools</li>
				<li>Example training pipelines</li>
			</ul>
		</div>
	</div>
</section>
