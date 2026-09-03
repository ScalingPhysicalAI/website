<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { setupRevealObserver } from '$lib/utils/reveal';
	import LinkedInName from '$lib/components/LinkedInName.svelte';

	onMount(() => {
		return setupRevealObserver({ threshold: 0.12 });
	});

	type Member = {
		name: string;
		role: string;
		/** Carries inline markup, so it is rendered with {@html}. */
		bio: string;
		photo: string;
		uni: string;
		uniAlt: string;
		linkedin?: string;
		x?: string;
	};

	// Same order as the deck's team slide: three across, two rows.
	const members: Member[] = [
		{
			photo: '/assets/team/vipul.jpg',
			name: 'Vipul Saini',
			role: 'Founder · Chief Engineer',
			bio: 'Founded Cypherock and scaled the safest crypto hardware wallet to $600M AUM - <strong>hardware shipped at scale</strong>. The Delhi Technological University engineer has already taken hardware from prototype to global production once.',
			uni: '/assets/uni/vipul.png',
			uniAlt: 'Delhi Technological University',
			linkedin: 'https://www.linkedin.com/in/vipul-saini-59a24156/',
			x: 'https://x.com/vipulsaini594'
		},
		{
			photo: '/assets/team/chiragm.jpg',
			name: 'Chirag Madaan',
			role: 'Senior Machine Learning Engineer',
			bio: 'Shipped <strong>production grade machine learning</strong> at PayPal and built the cryptography securing 10,000+ Cypherock devices. He turns <strong>AI research into models</strong> that run in the real world, a craft he started at Vellore Institute of Technology.',
			uni: '/assets/uni/chiragm.png',
			uniAlt: 'Vellore Institute of Technology',
			linkedin: 'https://www.linkedin.com/in/appleswiggy/'
		},
		{
			photo: '/assets/team/rakshit.jpg',
			name: 'Rakshit Jain',
			role: 'Senior Robotics Engineer',
			bio: 'Holds multiple patents and has put <strong>robotics and aerospace products into mass manufacturing</strong> that sell commercially today. A Manipal Institute of Technology engineer, he turns a design into something a factory can actually build.',
			uni: '/assets/uni/rakshit.png',
			uniAlt: 'Manipal Institute of Technology',
			linkedin: 'https://www.linkedin.com/in/rakshitjain003/'
		},
		{
			photo: '/assets/team/sarthak.jpg',
			name: 'Sarthak Mishra',
			role: 'Senior Software Engineer',
			bio: 'Built software-defined electric vehicles at Mazout Electric across low-latency teleoperation, <strong>embedded systems</strong> and cloud. The Amity University graduate owns the real-time link that ties the robot to its operator.',
			uni: '/assets/uni/sarthak.png',
			uniAlt: 'Amity University',
			linkedin: 'https://www.linkedin.com/in/sarthak-mishra-ba32501bb/'
		},
		{
			photo: '/assets/team/anay.jpg',
			name: 'Anay Shiledar',
			role: 'Electrical Engineer',
			bio: 'Designs neural-interface electronics and firmware in the Neuroelectronics Research Lab at the University of California, Irvine. On Buildo, he handles <strong>embedded&nbsp;software</strong>, board bring-up, and hardware integration.',
			uni: '/assets/uni/anay.png',
			uniAlt: 'University of California, Irvine',
			linkedin: 'https://www.linkedin.com/in/anay-shiledar-629036209/'
		},
		{
			photo: '/assets/team/chirag.jpg',
			name: 'Chirag Singla',
			role: 'Software Engineer',
			bio: "A Bharati Vidyapeeth engineer who has been writing <strong>transformer models</strong> for five years and shipped the cryptography behind Cypherock's hardware wallet. He builds the AI that has to run inside the robot.",
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
		content="The engineers building Starforge - the intelligence layer for physical AI, and Buildo, the humanoid it runs on."
	/>
</svelte:head>

<div class="tm-scan" aria-hidden="true"></div>

<section class="tm-section">
	<!-- The page leads straight into the cards, but it still needs one h1 for
	     document outline and screen readers. -->
	<h1 class="tm-sr-title">Team</h1>

	<div class="tm-grid">
		{#each members as member, i (member.name)}
			<article class="tm-card reveal" style="transition-delay:{0.06 * (i % 3)}s">
				<img class="tm-uni" src={member.uni} alt={member.uniAlt} />
				<img class="tm-avatar" src={member.photo} alt="" />
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

	/* Three across, two rows - the same arrangement as the deck's team slide. */
	.tm-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.tm-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 26px 24px;
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
		top: 20px;
		right: 20px;
		height: 40px;
		width: auto;
		max-width: 96px;
		object-fit: contain;
		object-position: right top;
	}

	/* ── AVATAR ── */
	.tm-avatar {
		flex-shrink: 0;
		width: 64px;
		height: 64px;
		margin-bottom: 18px;
		border: 2px solid var(--border-strong);
		border-radius: 50%;
		object-fit: cover;
	}

	/* ── TEXT ── */
	.tm-name {
		font-size: 18px;
		font-weight: 600;
		line-height: 1.2;
		color: var(--ink);
		margin-bottom: 7px;
	}

	.tm-role {
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 14px;
	}

	.tm-bio {
		font-size: 16px;
		font-weight: 500;
		line-height: 1.6;
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

		.tm-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 560px) {
		.tm-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
