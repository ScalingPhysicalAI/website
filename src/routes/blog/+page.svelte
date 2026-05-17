<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>STARFORGE — Updates</title>
	<meta name="description" content="Insights on Physical AI, space manufacturing, and the future of launch infrastructure." />
</svelte:head>

<div class="blog-list-page">
	<div class="blog-hero">
		<div class="hero-scan-lines"></div>
		<div class="blog-hero-content">
			<span class="hero-tag">Starforge — Updates</span>
			<h1 class="hero-title">Updates</h1>
		</div>
	</div>

	<section class="blog-list-section">
		<div class="blog-list-grid">
			{#each data.posts as post}
				<a href={resolve(`/blog/${post.slug}/`)} class="blog-card">
					<div class="s6-photo-bg">
						<img src="/assets/rocket.jpeg" alt="FORGE-1 rocket" class="s6-photo" />
						<div class="s6-photo-fade"></div>
					</div>
					<div class="s6-left">
						<div class="s6-label">Proof of Execution</div>
						<h2 class="s6-headline">
							StarForge designed, simulated,<br />and built a<br />
							<span class="s6-gold">9-foot VTVL hopper rocket</span>
						</h2>
						<div class="s6-stats">
							<div class="s6-stat">
								<div class="s6-stat-val">9 ft</div>
								<div class="s6-stat-label">Vehicle Height</div>
							</div>
							<div class="s6-stat">
								<div class="s6-stat-val">VTVL</div>
								<div class="s6-stat-label">Architecture</div>
							</div>
							<div class="s6-stat">
								<div class="s6-stat-val">AI</div>
								<div class="s6-stat-label">Simulated</div>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>
</div>

<style>
	.s6-photo-bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.s6-photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 55% 65%;
		filter: brightness(0.82) contrast(1.1) saturate(0.55) sepia(0.08);
		transition: filter 0.4s ease, transform 0.4s ease;
	}

	:global(.blog-card:hover) .s6-photo {
		filter: brightness(0.9) contrast(1.08) saturate(0.65);
		transform: scale(1.04);
	}

	.s6-photo-fade {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			rgba(5, 5, 5, 0.95) 0%,
			rgba(5, 5, 5, 0.65) 28%,
			rgba(5, 5, 5, 0.08) 50%,
			rgba(5, 5, 5, 0.0) 100%
		);
	}

	.s6-left {
		position: relative;
		z-index: 2;
		max-width: 56%;
		padding: 28px 32px;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.s6-label {
		font-family: 'Space Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.3em;
		color: #b89c72;
		text-transform: uppercase;
		margin-bottom: 12px;
	}

	.s6-headline {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(18px, 1.6vw, 24px);
		font-weight: 400;
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: #e8e2d6;
		margin: 0 0 16px;
	}

	.s6-gold {
		color: #b89c72;
	}

	.s6-stats {
		display: grid;
		grid-template-columns: repeat(3, auto);
		gap: 3px;
		margin-top: 16px;
	}

	.s6-stat {
		padding: 10px 14px;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(184, 156, 114, 0.1);
	}

	.s6-stat-val {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(18px, 1.6vw, 26px);
		color: #b89c72;
		letter-spacing: 0.04em;
		line-height: 1;
	}

	.s6-stat-label {
		font-family: 'Space Mono', monospace;
		font-size: 8px;
		color: #6b6155;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		margin-top: 4px;
	}
</style>
