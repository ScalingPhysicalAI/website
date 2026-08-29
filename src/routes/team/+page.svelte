<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { setupRevealObserver } from '$lib/utils/reveal';
	import LinkedInName from '$lib/components/LinkedInName.svelte';

	onMount(() => {
		return setupRevealObserver({ threshold: 0.12 });
	});

	type Member = {
		initials: string;
		name: string;
		role: string;
		/** Carries inline markup, so it is rendered with {@html}. */
		bio: string;
		uni: string;
		uniAlt: string;
		linkedin?: string;
		x?: string;
	};

	const founder: Member = {
		initials: 'VS',
		name: 'Vipul Saini',
		role: 'Founder · Chief Engineer',
		bio: 'Founded Cypherock and scaled the safest crypto hardware wallet to $600M AUM - <strong>hardware shipped at scale</strong>. He has already taken a hardware product from prototype to global production once.',
		uni: '/assets/uni/vipul.png',
		uniAlt: 'Delhi Technological University',
		linkedin: 'https://www.linkedin.com/in/vipul-saini-59a24156/',
		x: 'https://x.com/vipulsaini594'
	};

	// Split rather than one array so the page reads 1 / 3 / 2 down the page.
	const rowOfThree: Member[] = [
		{
			initials: 'RJ',
			name: 'Rakshit Jain',
			role: 'Senior Robotics Engineer',
			bio: 'Holds multiple patents and has put <strong>robotics and aerospace products into mass manufacturing</strong> that sell commercially today. He turns a design into something a factory can actually build.',
			uni: '/assets/uni/rakshit.png',
			uniAlt: 'Manipal Institute of Technology',
			linkedin: 'https://www.linkedin.com/in/rakshitjain003/'
		},
		{
			initials: 'SS',
			name: 'Sarthak Mishra',
			role: 'Senior Software Engineer',
			bio: 'Built software-defined electric vehicles at Mazout Electric across low-latency teleoperation, <strong>embedded systems</strong> and cloud. He owns the real-time link that ties the robot to its operator.',
			uni: '/assets/uni/sarthak.png',
			uniAlt: 'Amity University',
			linkedin: 'https://www.linkedin.com/in/sarthak-mishra-ba32501bb/'
		},
		{
			initials: 'AS',
			name: 'Anay Shiledar',
			role: 'Electrical Engineer',
			bio: "Builds implantable-electronics pipelines at UC Irvine's Neuroelectronics Research Lab and race-car firmware for FSAE Electric. <strong>Embedded software</strong>, firmware and hardware integration are his craft.",
			uni: '/assets/uni/anay.png',
			uniAlt: 'University of California, Irvine',
			linkedin: 'https://www.linkedin.com/in/anay-shiledar-629036209/'
		}
	];

	const rowOfTwo: Member[] = [
		{
			initials: 'CS',
			name: 'Celia Sherman',
			role: 'Aerospace Engineer',
			bio: "An <strong>aerospace engineer</strong> from the University of Miami working in space robotics, thermodynamics and composite manufacturing. She keeps Buildo's structures light, strong and cheap to build.",
			uni: '/assets/uni/celia.png',
			uniAlt: 'University of Miami',
			linkedin: 'https://www.linkedin.com/in/celia-sherman-a85967325/'
		},
		{
			initials: 'CS',
			name: 'Chirag Singla',
			role: 'Software Engineer',
			bio: "Has been writing <strong>transformer models</strong> for five years and shipped the cryptography behind Cypherock's hardware wallet. He builds the AI that has to run inside the robot.",
			uni: '/assets/uni/chirag.png',
			uniAlt: 'Bharati Vidyapeeth',
			linkedin: 'https://www.linkedin.com/in/chirag-droid/'
		}
	];
</script>

<svelte:head>
	<title>Team - STARFORGE</title>
	<meta
		name="description"
		content="The engineers building Starforge - the compute layer for physical AI, and Buildo, the humanoid it runs on."
	/>
</svelte:head>

<div class="tm-scan" aria-hidden="true"></div>

<section class="tm-section">
	<!-- The page leads straight into the cards, but it still needs one h1 for
	     document outline and screen readers. -->
	<h1 class="tm-sr-title">Team</h1>

	<article class="tm-founder reveal">
		<img class="tm-uni" src={founder.uni} alt={founder.uniAlt} />
		<div class="tm-avatar tm-avatar--lg" aria-hidden="true">{founder.initials}</div>
		<div class="tm-founder-text">
			<h2 class="tm-name tm-name--lg">
				<LinkedInName name={founder.name} linkedin={founder.linkedin} x={founder.x} />
			</h2>
			<div class="tm-role">{founder.role}</div>
			<p class="tm-bio">{@html founder.bio}</p>
		</div>
	</article>

	<div class="tm-row tm-row--three">
		{#each rowOfThree as member, i (member.name)}
			<article class="tm-card reveal" style="transition-delay:{0.06 * i}s">
				<img class="tm-uni" src={member.uni} alt={member.uniAlt} />
				<div class="tm-avatar" aria-hidden="true">{member.initials}</div>
				<h2 class="tm-name">
					<LinkedInName name={member.name} linkedin={member.linkedin} x={member.x} />
				</h2>
				<div class="tm-role">{member.role}</div>
				<p class="tm-bio">{@html member.bio}</p>
			</article>
		{/each}
	</div>

	<div class="tm-row tm-row--two">
		{#each rowOfTwo as member, i (member.name)}
			<article class="tm-card reveal" style="transition-delay:{0.06 * i}s">
				<img class="tm-uni" src={member.uni} alt={member.uniAlt} />
				<div class="tm-avatar" aria-hidden="true">{member.initials}</div>
				<h2 class="tm-name">
					<LinkedInName name={member.name} linkedin={member.linkedin} x={member.x} />
				</h2>
				<div class="tm-role">{member.role}</div>
				<p class="tm-bio">{@html member.bio}</p>
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
			<a class="btn-primary" href="mailto:contact@starforgerobotics.com?subject=Joining%20Starforge"
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
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 32px;
		padding: 40px;
		padding-right: 160px;
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
		position: relative;
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

	/* Logos vary between wordmarks and tall crests, so they are boxed to a
	   common height and left to find their own width inside it. */
	.tm-uni {
		position: absolute;
		top: 24px;
		right: 24px;
		height: 46px;
		width: auto;
		max-width: 110px;
		object-fit: contain;
		object-position: right top;
	}

	.tm-founder .tm-uni {
		top: 32px;
		right: 32px;
		height: 62px;
		max-width: 150px;
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
		font-size: 18px;
		font-weight: 500;
		line-height: 1.65;
		color: rgba(20, 18, 16, 0.82);
	}

	/* Bios are injected as markup, so the emphasis needs a global selector. */
	.tm-bio :global(strong) {
		font-weight: 700;
		color: var(--ink);
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

		.tm-founder .tm-uni {
			top: 24px;
			right: 24px;
			height: 46px;
			max-width: 110px;
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
