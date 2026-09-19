<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { setupRevealObserver } from '$lib/utils/reveal';

	onMount(() => {
		return setupRevealObserver({ threshold: 0.15 });
	});

	const loop = [
		{ step: '01', title: 'Record', body: 'a real-world skill.' },
		{ step: '02', title: 'Train', body: 'robot models on that data.' },
		{ step: '03', title: 'Publish', body: 'the model to a skill store.' },
		{ step: '04', title: 'Earn', body: 'every time a robot uses it.' }
	];
</script>

<svelte:head>
	<title>Robots don't have egocentric interaction data - Starforge</title>
	<meta
		name="description"
		content="LLMs got trained on everything humans have written for decades. Robots got almost nothing. Soon, anyone with a cheap pair of gloves and glasses should be able to record a skill, train a model, publish it, and earn from it."
	/>
</svelte:head>

<div class="post-scan" aria-hidden="true"></div>

<article class="post">
	<header class="post-head">
		<span class="section-label">Perspective</span>
		<h1 class="post-title">
			Robots don't have <span>egocentric interaction data</span>. That's the real bottleneck.
		</h1>
		<p class="post-dek">
			LLMs got trained on everything humans have written for decades. Robots got almost nothing.
		</p>
	</header>

	<div class="post-body">
		<p class="post-lead">
			People have been folding clothes, making tea, opening drawers, packing boxes and using tools
			for centuries. None of the physical interaction was recorded.
		</p>

		<p>
			We are trying to change that. Soon, anyone with a cheap pair of
			<a class="post-kit-link" href={resolve('/buildo-development-kit')}>gloves and glasses</a>
			should be able to:
		</p>

		<ol class="post-loop reveal">
			{#each loop as item (item.step)}
				<li class="post-loop-item">
					<span class="post-loop-step">{item.step}</span>
					<p class="post-loop-copy">
						<span class="post-loop-title">{item.title}</span>
						<span class="post-loop-body">{item.body}</span>
					</p>
				</li>
			{/each}
		</ol>

		<figure class="post-figure reveal">
			<div class="post-figure-pair">
				<img
					class="post-figure-gloves"
					src="/assets/buildo-kit-gloves.png"
					alt="Tactile data collection gloves with sensor pads across the fingers and palm"
				/>
				<img
					class="post-figure-glasses"
					src="/assets/buildo-kit-glasses.png"
					alt="Camera glasses used to record egocentric video while working"
				/>
			</div>
			<figcaption>Tactile gloves and camera glasses</figcaption>
		</figure>

		<p>
			<strong>No robot needed, no lab needed. No PhD needed.</strong> Just a few clicks.
		</p>

		<p>This creates an entirely new class of developer.</p>

		<p>
			The first generation of software developers built applications for PCs. The next generation
			built apps for Android and iOS. <strong>The next wave could build skills for robots.</strong>
		</p>

		<p>
			Labs with 20 researchers will never generate enough diversity to teach robots everything
			humans know how to do. Millions of people can.
		</p>
	</div>

	<footer class="post-foot reveal">
		<div class="post-foot-ctas">
			<a class="btn-primary" href="https://portal.starforgerobotics.com">Sign up here</a>
		</div>
	</footer>
</article>

<style>
	/* Same scan-line texture the rest of the site uses, so the article does not
	   read as a flat white sheet dropped into the brand. */
	.post-scan {
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

	/* Short piece, so the column is held a touch narrower than the announcement
	   post and the page keeps a full screen of height under the nav. */
	.post {
		position: relative;
		z-index: 1;
		max-width: 720px;
		min-height: 74vh;
		margin: 0 auto;
		padding: calc(var(--header-height, 96px) + 64px) 48px 40px;
	}

	/* ── HEAD ── */
	.post-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(36px, 5.4vw, 62px);
		font-weight: 400;
		letter-spacing: 0.03em;
		line-height: 0.98;
		color: var(--ink);
	}

	.post-title span {
		color: var(--accent);
	}

	.post-dek {
		margin-top: 24px;
		padding-bottom: 36px;
		border-bottom: 1px solid var(--border);
		font-size: clamp(17px, 2.2vw, 20px);
		font-weight: 600;
		line-height: 1.55;
		color: var(--ink);
	}

	/* ── BODY ── */
	.post-body {
		padding-top: 38px;
	}

	.post-body :global(p) {
		font-size: clamp(16px, 1.5vw, 18px);
		font-weight: 500;
		line-height: 1.75;
		color: rgba(20, 18, 16, 0.86);
	}

	.post-body :global(p + p) {
		margin-top: 22px;
	}

	.post-body :global(strong) {
		font-weight: 700;
		color: var(--ink);
	}

	.post-lead {
		font-size: clamp(17px, 1.8vw, 20px) !important;
		line-height: 1.7 !important;
	}

	.post-kit-link {
		color: var(--accent);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}

	.post-kit-link:hover {
		color: var(--ink);
	}

	/* ── FIGURE ── */
	/* Both product shots ship on a white ground, so the scan lines are repeated
	   here as a local background and the images multiply into them rather than
	   sitting on the page as two white rectangles. */
	.post-figure {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		margin: 34px 0 34px;
		padding: 10px 0;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 3px,
			rgba(0, 0, 0, 0.036) 3px,
			rgba(0, 0, 0, 0.036) 4px
		);
	}

	/* The gloves are the taller shot, so the glasses are sized against them by
	   eye rather than given the same height. */
	.post-figure-pair {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(16px, 4vw, 46px);
		width: 100%;
	}

	.post-figure-pair img {
		display: block;
		width: auto;
		max-width: 46%;
		object-fit: contain;
		mix-blend-mode: multiply;
	}

	.post-figure-gloves {
		height: clamp(130px, 22vw, 210px);
	}

	.post-figure-glasses {
		height: clamp(72px, 12vw, 116px);
	}

	.post-figure figcaption {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	/* ── FOUR-STEP LOOP ── */
	/* Numbered rather than bulleted: these are a sequence, and the numerals do
	   the same job the figures do elsewhere on the site. */
	.post-loop {
		margin: 26px 0 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--border);
	}

	.post-loop-item {
		display: flex;
		align-items: baseline;
		gap: 20px;
		padding: 16px 0;
		border-bottom: 1px solid var(--border);
	}

	.post-loop-step {
		flex-shrink: 0;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 11px;
		letter-spacing: 0.18em;
		color: var(--accent);
	}

	/* Baseline-aligned inline pieces so the label and its sentence read as one
	   line on a wide screen and stack cleanly on a narrow one. */
	.post-loop-copy {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 10px;
		min-width: 0;
	}

	.post-loop-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(20px, 2.4vw, 26px);
		letter-spacing: 0.03em;
		line-height: 1;
		color: var(--ink);
	}

	.post-loop-body {
		font-size: clamp(15px, 1.5vw, 17px);
		font-weight: 500;
		line-height: 1.6;
		color: rgba(20, 18, 16, 0.86);
	}

	/* ── FOOT ── */
	.post-foot {
		margin-top: 52px;
		padding-top: 34px;
		border-top: 1px solid var(--border);
	}

	.post-foot-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 760px) {
		.post {
			padding: calc(var(--header-height, 96px) + 36px) 24px 32px;
		}

		.post-loop-item {
			gap: 14px;
		}
	}
</style>
