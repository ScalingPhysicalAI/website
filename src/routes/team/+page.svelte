<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { setupRevealObserver } from '$lib/utils/reveal';

	onMount(() => {
		return setupRevealObserver({ threshold: 0.12 });
	});

	type Member = {
		initials: string;
		name: string;
		role: string;
		bio: string;
	};

	const founder: Member = {
		initials: 'VS',
		name: 'Vipul Saini',
		role: 'Founder · Chief Engineer',
		bio: 'Founded Cypherock, scaled to $600M AUM. Previously Nymble Labs.'
	};

	// Split rather than one array so the page reads 1 / 3 / 2 down the page.
	const rowOfThree: Member[] = [
		{
			initials: 'RJ',
			name: 'Rakshit Jain',
			role: 'Senior Robotics Engineer',
			bio: 'Deep robotics and mechatronics background. IIIT Delhi.'
		},
		{
			initials: 'SS',
			name: 'Sarthak',
			role: 'Senior Software Engineer',
			bio: 'Core systems and software engineering across robotics stacks.'
		},
		{
			initials: 'AS',
			name: 'Anay Shiledar',
			role: 'Electrical Engineer',
			bio: 'Electrical systems design and embedded hardware integration.'
		}
	];

	const rowOfTwo: Member[] = [
		{
			initials: 'CS',
			name: 'Celia Sherman',
			role: 'Aerospace Engineer',
			bio: 'Aerospace engineering background. Structural and propulsion systems.'
		},
		{
			initials: 'CS',
			name: 'Chirag Singla',
			role: 'Software Engineer',
			bio: 'AI and systems engineering across multiple product cycles.'
		}
	];
</script>

<svelte:head>
	<title>Team — STARFORGE</title>
	<meta
		name="description"
		content="The engineers building Starforge — the compute layer for physical AI, and Buildo, the humanoid it runs on."
	/>
</svelte:head>

<div class="tm-scan" aria-hidden="true"></div>

<section class="tm-section">
	<!-- The page leads straight into the cards, but it still needs one h1 for
	     document outline and screen readers. -->
	<h1 class="tm-sr-title">Team</h1>

	<article class="tm-founder reveal">
		<div class="tm-avatar tm-avatar--lg" aria-hidden="true">{founder.initials}</div>
		<div class="tm-founder-text">
			<h2 class="tm-name tm-name--lg">{founder.name}</h2>
			<div class="tm-role">{founder.role}</div>
			<p class="tm-bio">{founder.bio}</p>
		</div>
	</article>

	<div class="tm-row tm-row--three">
		{#each rowOfThree as member, i (member.name)}
			<article class="tm-card reveal" style="transition-delay:{0.06 * i}s">
				<div class="tm-avatar" aria-hidden="true">{member.initials}</div>
				<h2 class="tm-name">{member.name}</h2>
				<div class="tm-role">{member.role}</div>
				<p class="tm-bio">{member.bio}</p>
			</article>
		{/each}
	</div>

	<div class="tm-row tm-row--two">
		{#each rowOfTwo as member, i (member.name)}
			<article class="tm-card reveal" style="transition-delay:{0.06 * i}s">
				<div class="tm-avatar" aria-hidden="true">{member.initials}</div>
				<h2 class="tm-name">{member.name}</h2>
				<div class="tm-role">{member.role}</div>
				<p class="tm-bio">{member.bio}</p>
			</article>
		{/each}
	</div>
</section>

<div class="hr-line"></div>

<section class="tm-section tm-closing">
	<div class="tm-closing-inner reveal">
		<span class="section-label">Join Us</span>
		<h2 class="section-title">We're hiring<br /><span>engineers who build</span></h2>
		<p class="section-body">
			If you work on robotics, controls, embedded systems or applied AI and want to build physical
			infrastructure from scratch, we want to hear from you.
		</p>
		<div class="tm-closing-ctas">
			<a class="btn-primary" href="mailto:vipulsaini594@gmail.com?subject=Joining%20Starforge"
				>Get in touch</a
			>
			<a class="btn-ghost" href={resolve('/buildo')}>See what we build</a>
		</div>
	</div>
</section>

<style>
	/* Same scan-line texture the hero sections use, held across the whole page
	   so this route is not a flat white sheet. */
	.tm-scan {
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

	.tm-sr-title {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}

	.tm-section {
		position: relative;
		z-index: 1;
		padding: 88px 48px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.tm-section:first-of-type {
		padding-top: calc(var(--header-height, 96px) + 56px);
	}

	/* ── FOUNDER ── */
	.tm-founder {
		display: flex;
		align-items: flex-start;
		gap: 32px;
		padding: 40px;
		border: 2px solid var(--border);
		background: rgba(255, 255, 255, 0.72);
	}

	.tm-founder-text {
		flex: 1;
		min-width: 0;
	}

	/* ── ROWS ── */
	.tm-row {
		display: grid;
		gap: 24px;
		margin-top: 24px;
	}

	.tm-row--three {
		grid-template-columns: repeat(3, 1fr);
	}

	/* Two cards held to the width of two of the three columns above, centred,
	   so the last row lines up with the grid instead of stretching. */
	.tm-row--two {
		grid-template-columns: repeat(2, 1fr);
		max-width: calc((100% - 48px) / 3 * 2 + 24px);
		margin-left: auto;
		margin-right: auto;
	}

	.tm-card {
		display: flex;
		flex-direction: column;
		padding: 32px 28px;
		border: 2px solid var(--border);
		background: rgba(255, 255, 255, 0.72);
		transition:
			border-color 0.3s ease,
			transform 0.3s ease;
	}

	.tm-card:hover {
		border-color: var(--border-strong);
		transform: translateY(-3px);
	}

	/* ── AVATAR ── */
	.tm-avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 60px;
		height: 60px;
		margin-bottom: 22px;
		border: 2px solid var(--border-strong);
		border-radius: 50%;
		font-family: 'Space Mono', monospace;
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--accent);
	}

	.tm-avatar--lg {
		width: 84px;
		height: 84px;
		margin-bottom: 0;
		font-size: 20px;
	}

	/* ── TEXT ── */
	.tm-name {
		font-size: 20px;
		font-weight: 600;
		line-height: 1.2;
		color: var(--ink);
		margin-bottom: 8px;
	}

	.tm-name--lg {
		font-size: 28px;
	}

	.tm-role {
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 16px;
	}

	.tm-bio {
		font-size: 15px;
		font-weight: 500;
		line-height: 1.65;
		color: rgba(20, 18, 16, 0.82);
	}

	/* ── CLOSING ── */
	.tm-closing-inner {
		max-width: 62ch;
	}

	.tm-closing-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		margin-top: 32px;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 900px) {
		.tm-section {
			padding: 64px 24px;
		}

		.tm-section:first-of-type {
			padding-top: calc(var(--header-height, 96px) + 32px);
		}

		.tm-founder {
			flex-direction: column;
			gap: 24px;
			padding: 32px 24px;
		}

		.tm-row--three,
		.tm-row--two {
			grid-template-columns: repeat(2, 1fr);
			max-width: none;
		}
	}

	@media (max-width: 560px) {
		.tm-row--three,
		.tm-row--two {
			grid-template-columns: 1fr;
		}
	}
</style>
