<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { setupRevealObserver } from '$lib/utils/reveal';

	onMount(() => {
		return setupRevealObserver({ threshold: 0.15 });
	});

	// One entry per part of the robot. Further parts get appended here and each
	// renders as its own full-height section. Copy is a sequence of segments so
	// any number of phrases in a line can carry the accent colour: plain strings
	// render as-is, `accent` entries are highlighted.
	const parts = [
		{
			id: 'head',
			image: '/assets/buildo-head.webp',
			alt: "Buildo's head, torso and arms, front view",
			fit: 'contain',
			side: 'right',
			anchor: 'top-left',
			lede: [
				'You can run ',
				{ accent: 'any sized model' },
				' on Buildo, essential for building real world, long horizon use cases.'
			]
		},
		{
			id: 'hands',
			image: '/assets/buildo-hands.webp',
			alt: "Buildo's two five-fingered hands and forearms",
			fit: 'bleed',
			side: 'left',
			anchor: 'bottom-right',
			lede: [
				'Buildo has ',
				{ accent: '5 fingered dexterous hands' },
				' with tactile sensors, to move the world designed around humans.'
			]
		},
		{
			id: 'base',
			image: '/assets/buildo-base.webp',
			alt: "Buildo's telescoping column and wheeled base",
			fit: 'lift',
			side: 'right',
			anchor: 'mid-left',
			lede: [
				'Buildo is ',
				{ accent: 'wheel based' },
				' and it can ',
				{ accent: 'adjust its height' },
				' to reach the top of that cupboard no one can touch.'
			],
			// Last part section, so it closes the tour with somewhere to go next.
			closing: true
		}
	];
</script>

<svelte:head>
	<title>STARFORGE - Building the intelligence layer for physical AI</title>
	<meta
		name="description"
		content="Starforge is building the intelligence layer for physical AI - the models and API that let humanoid robots work in the real world."
	/>
</svelte:head>

<section id="hero">
	<div class="hero-bg">
		<div class="hero-scan-lines"></div>
	</div>

	<div class="hero-content">
		<h1 class="hero-title">
			Meet <span>Buildo</span>, our<br />
			$10k open source<br />
			humanoid robot
		</h1>
		<p class="hero-sub">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="hero-sub-link" href="#{parts[0].id}">Buildo</a> is a uniquely capable and affordable
			robot made possible by our breakthrough intelligence platform.
		</p>
		<div class="hero-ctas">
			<a href={resolve('/buildo')} class="btn-primary">Preorder</a>
			<a href="https://portal.starforgerobotics.com" class="btn-ghost">Simulate Buildo</a>
		</div>
	</div>

	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a class="hero-scroll" href="#{parts[0].id}" aria-label="Scroll to Buildo">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
			<path d="M5 8.5l7 7 7-7" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</a>
</section>

{#each parts as part (part.id)}
	<section class="part part--{part.fit} part--{part.side}" id={part.id}>
		<div class="part-scan" aria-hidden="true"></div>

		<figure class="part-visual">
			<img src={part.image} alt={part.alt} loading="lazy" decoding="async" />
		</figure>

		<div class="part-copy part-copy--{part.anchor} reveal">
			<!-- Segments run flush against each other: any whitespace between them
			     would render as a stray space mid-sentence, so the spacing lives
			     inside the strings themselves. -->
			<h2 class="part-lede">
				{#each part.lede as seg, i (i)}{#if typeof seg === 'string'}{seg}{:else}<span
							>{seg.accent}</span
						>{/if}{/each}
			</h2>

			{#if part.closing}
				<div class="part-ctas">
					<a class="btn-ghost" href="https://portal.starforgerobotics.com"
						>Simulate Buildo<span class="cta-arrow" aria-hidden="true">↗</span></a
					>
					<a class="btn-primary" href={resolve('/buildo')}>Preorder</a>
				</div>
			{/if}
		</div>
	</section>
{/each}

<style>
	.hero-sub-link {
		color: var(--accent);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
		transition: color 0.2s ease;
	}

	.hero-sub-link:hover {
		color: var(--accent-strong);
	}

	/* ── SCROLL CUE ── */
	.hero-scroll {
		position: absolute;
		left: 50%;
		bottom: 30px;
		transform: translateX(-50%);
		z-index: 2;
		display: block;
		width: clamp(48px, 5.2vw, 72px);
		height: clamp(48px, 5.2vw, 72px);
		color: var(--text-muted);
		opacity: 0;
		animation: fadeUp 0.9s 1.2s forwards;
		transition: color 0.2s ease;
	}

	.hero-scroll:hover {
		color: var(--accent);
	}

	.hero-scroll svg {
		display: block;
		width: 100%;
		height: 100%;
		animation: heroNudge 1.4s ease-in-out infinite;
	}

	@keyframes heroNudge {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(7px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-scroll svg {
			animation: none;
		}
	}

	/* ── PART SECTIONS ── */
	/* Same white as the hero. Each render is keyed to a transparent backdrop, so
	   the slide's own surface shows through around the robot and there is no
	   panel, border or visible image edge. */
	.part {
		position: relative;
		background: var(--bg);
		min-height: 100vh;
		display: flex;
		/* Bottom-aligned with no bottom padding: the render is cropped mid-torso,
		   so seating that edge on the slide's edge reads as the robot continuing
		   past the fold rather than being cut off in mid-air. */
		align-items: flex-end;
		justify-content: center;
		padding: clamp(88px, 13vh, 140px) 48px 0;
		overflow: hidden;
	}

	/* The renders alternate down the page. Held centred, three consecutive slices
	   of the same robot line up and read as one continuous machine as you scroll;
	   pushing them to opposite sides breaks that. Each slide's copy sits on the
	   opposite side from its render. */
	.part--right {
		justify-content: flex-end;
	}

	.part--left {
		justify-content: flex-start;
	}

	.part--bleed {
		/* Bleeds top and bottom: both crop edges meet the slide edges, so the
		   arms read as continuing past the frame in both directions. */
		padding-top: 0;
	}

	/* Bleeds off the top like the hands slide, but the render is cut at the
	   base's bottom edge and held clear of the slide's floor, so the standoff
	   below the box reads as deliberate clearance rather than a crop. */
	.part--lift {
		--lift-gap: clamp(40px, 7vh, 84px);
		/* This render is a narrow column, so fitting it to the viewport height
		   leaves it far thinner than the other two and it reads as small. Height
		   is the only lever available, since the base has to stay clear of the
		   floor, so it is scaled past the viewport and the surplus crops off the
		   top, which is already a cut edge. */
		--lift-scale: 1.24;
		/* Pinned rather than left to min-height, so the oversize render overflows
		   and is clipped instead of stretching the slide past one screen. */
		height: 100vh;
		padding-top: 0;
		padding-bottom: var(--lift-gap);
		/* Inset from the right edge further than the other slides. This render is
		   narrow, so hard against the gutter it drifts away from the copy and
		   leaves a dead band across the middle of the slide. */
		padding-right: clamp(48px, 18vw, 270px);
	}

	/* The header is fixed and has no background of its own, so it relies on
	   sitting over light content. This render is dark and, once it is both
	   right-aligned and scaled up, it runs directly under the nav links. Fading
	   its top back to the page colour keeps those links legible and doubles as a
	   soft edge for what is otherwise a hard crop through the arms. */
	.part--lift::before {
		content: '';
		position: absolute;
		inset: 0 0 auto 0;
		height: clamp(150px, 24vh, 240px);
		z-index: 2;
		pointer-events: none;
		background: linear-gradient(to bottom, var(--bg) 30%, transparent);
	}

	/* Behind the render rather than over it, so the lines read as the surface
	   the robot is standing on. This only works because the render is keyed:
	   the texture shows through the empty backdrop and stops at the robot. */
	.part-scan {
		position: absolute;
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

	/* Centred by the flex parent so the robot sits on the page's midline. */
	.part-visual {
		position: relative;
		z-index: 1;
		margin: 0;
	}

	.part-visual img {
		display: block;
		width: auto;
		max-width: 100%;
		max-height: min(84vh, 46vw);
		height: auto;
	}

	/* Scaled to the full slide height so it meets both edges. Width is allowed
	   to run past the container and is clipped by the section's overflow. */
	.part--bleed .part-visual img {
		height: 100vh;
		width: auto;
		max-height: none;
		max-width: none;
	}

	/* Bottom-aligned by the flex parent, so the oversize height spills upward and
	   is clipped by the section, leaving the base sitting clear of the floor. */
	.part--lift .part-visual img {
		height: calc((100vh - var(--lift-gap)) * var(--lift-scale));
		width: auto;
		max-height: none;
		max-width: none;
	}

	/* Taken out of flow rather than given its own column: that keeps the robot
	   dead centre on the page while the copy is free to be as wide as it needs,
	   instead of being squeezed into whatever a side track leaves over. */
	.part-copy {
		position: absolute;
		/* Above the lift slide's top fade as well as the render. */
		z-index: 3;
	}

	/* The measure lives on the heading, not the block, so a row of buttons below
	   it can run wider than the text without forcing the text to match. */
	.part-lede {
		max-width: min(26ch, 30vw);
		margin: 0;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(16px, 1.6vw, 24px);
		font-weight: 500;
		line-height: 1.5;
		letter-spacing: 0;
		color: var(--ink);
	}

	/* Sits in the upper band, where the robot narrows to just the head. */
	.part-copy--top-left {
		left: clamp(24px, 6vw, 104px);
		top: 20%;
	}

	/* Level with the column rather than the head or the floor, since that is the
	   part of the render this copy is about. */
	.part-copy--mid-left {
		left: clamp(24px, 6vw, 104px);
		top: 50%;
		transform: translateY(-50%);
	}

	/* The hands render is empty white below and to the right of the forearms,
	   so the copy tucks into that corner without covering the robot. */
	/* Set wider than the other slide on purpose: a wider measure means fewer
	   lines, which keeps the block low enough to sit under the forearms where
	   the render is empty. */
	.part-copy--bottom-right {
		right: clamp(24px, 4vw, 64px);
		bottom: clamp(44px, 7vh, 84px);
		text-align: right;
	}

	.part-copy--bottom-right .part-lede {
		max-width: min(34ch, 36vw);
	}

	.part-lede span {
		color: var(--accent);
		font-weight: 600;
	}

	/* Deliberately looser than the hero's 44px: this is the end of the tour
	   rather than a continuation of the sentence above it. */
	.part-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		margin-top: clamp(48px, 8vh, 88px);
	}

	/* inline-block stops the arrow being dragged along by the letter-spacing on
	   the label, and lets it shift on hover independently. Sized in em so it
	   scales with the label, and given a flat line-height so the taller glyph
	   cannot stretch the button. */
	.cta-arrow {
		display: inline-block;
		margin-left: 4px;
		font-size: 1.45em;
		line-height: 1;
		vertical-align: -0.08em;
		transition: transform 0.2s ease;
	}

	.part-ctas a:hover .cta-arrow {
		transform: translate(2px, -2px);
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 1024px) {
		/* Not enough width to run copy beside the robot, so it returns to flow
		   and stacks above it. */
		.part {
			flex-direction: column;
			justify-content: center;
			gap: 36px;
			/* The bottom-alignment this section uses when it is a row becomes
			   right-alignment once the axis flips, which would strand the copy
			   against the right edge. */
			align-items: stretch;
		}

		.part-visual {
			align-self: center;
		}

		.part-copy,
		.part-copy--top-left,
		.part-copy--mid-left,
		.part-copy--bottom-right {
			position: static;
			inset: auto;
			transform: none;
			text-align: left;
			order: -1;
		}

		.part-lede,
		.part-copy--bottom-right .part-lede {
			max-width: 34ch;
			font-size: clamp(17px, 3vw, 23px);
		}

		/* Stacked, the copy sits directly above the render, so the looser desktop
		   spacing would push the buttons into the image. */
		.part-ctas {
			margin-top: 28px;
		}

		.part-visual img {
			max-height: 56vh;
		}

		/* The full-bleed treatment only works when the copy sits beside the
		   render; stacked, it has to return to a contained image. */
		.part--bleed,
		.part--lift {
			padding-top: 72px;
		}

		/* Stacked, the slide has to grow with its content again, the render no
		   longer reaches the nav so the fade is unnecessary, and the right inset
		   would just knock the centred render off-centre. */
		.part--lift {
			height: auto;
			padding-right: 24px;
		}

		.part--lift::before {
			display: none;
		}

		.part--bleed .part-visual img,
		.part--lift .part-visual img {
			height: auto;
			max-height: 56vh;
			max-width: 100%;
		}
	}

	@media (max-width: 900px) {
		.part {
			min-height: 0;
			padding: 72px 24px 64px;
		}

		/* Clears the fixed two-row nav, which the copy would otherwise start
		   underneath as soon as the section reaches the top of the screen. */
		.part:first-of-type {
			padding-top: 116px;
		}

		.hero-scroll {
			bottom: 22px;
		}
	}
</style>
