<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { setupRevealObserver } from '$lib/utils/reveal';

	onMount(() => {
		return setupRevealObserver({ threshold: 0.15 });
	});

	const specs = [
		{ val: '18 lb', label: 'Payload' },
		{ val: '4–6 ft', label: 'Adjustable height' },
		{ val: '31', label: 'Degrees of freedom' }
	];
</script>

<svelte:head>
	<title>Starforge Robotics Raises $500,000 Pre-Seed - Starforge</title>
	<meta
		name="description"
		content="Starforge Robotics has raised $500,000 in pre-seed funding to build Buildo, a $10,000 open-source humanoid robot and physical intelligence platform."
	/>
</svelte:head>

<div class="post-scan" aria-hidden="true"></div>

<article class="post">
	<header class="post-head">
		<span class="section-label">Announcement</span>
		<h1 class="post-title">
			Starforge Robotics raises <span>$500,000</span> pre-seed to build affordable, intelligent humanoid
			robots
		</h1>
		<p class="post-dek">
			Funding will accelerate the development and deployment of Buildo, Starforge Robotics' $10,000
			open-source humanoid robot and physical intelligence platform.
		</p>
	</header>

	<div class="post-body">
		<p class="post-lead">
			We're excited to announce that <strong
				>Starforge Robotics has raised $500,000 in pre-seed funding</strong
			>
			to advance our mission of making capable humanoid robots dramatically more affordable, accessible,
			and intelligent.
		</p>

		<p>
			We're building <strong>Buildo</strong>, a $10,000 open-source humanoid robot designed for
			developers, researchers, physical AI startups, and eventually real-world deployment. Our goal
			is simple: make advanced robotics accessible to teams that today are priced out of humanoid
			development.
		</p>

		<p>But Buildo is not simply an attempt to build a cheaper humanoid.</p>

		<p>
			It is our attempt to rethink <strong
				>where robotic intelligence should live, how it should be delivered, and how developers
				build on top of it.</strong
			>
		</p>

		<h2>The intelligence problem in robotics</h2>

		<p>The most capable AI models are getting larger.</p>

		<p>
			That is great for intelligence, but it creates a fundamental problem for robotics. Human-level
			generality increasingly depends on computationally intensive models that are expensive and
			power-hungry to run directly on a robot. For robotics developers, that creates an
			uncomfortable tradeoff: run a large model in the cloud and accept high latency, or put
			expensive GPU compute directly into every machine.
		</p>

		<p>We believe there is another way.</p>

		<p>
			Starforge has been developing a split-inference architecture that allows a large
			vision-language-action model to run remotely while a lightweight adapter runs at the edge.
		</p>

		<aside class="post-callout reveal">
			<div class="post-callout-label">Current implementation</div>
			<p>
				An <strong>8.3-billion-parameter model</strong> running on a cloud server with a
				<strong>76-million-parameter edge adapter</strong>
				produced valid action chunks at approximately <strong>400 milliseconds of latency</strong>.
			</p>
		</aside>

		<p>
			The long-term implication is important: <strong
				>robot intelligence no longer has to scale one-to-one with the compute installed inside
				every robot.</strong
			>
		</p>

		<p>
			That enables us to pursue much larger intelligence models without turning every humanoid into
			a mobile GPU cluster.
		</p>

		<h2>Meet Buildo</h2>

		<p>Buildo is the hardware layer of that vision.</p>

		<p>
			The robot is designed around a <strong>$10,000 hardware stack</strong>, compared with
			substantially more expensive industrial and research setups. Buildo can carry payloads of up
			to <strong>18 pounds</strong>, has a height adjustable from <strong>four to six feet</strong>,
			and supports accessories for collecting egocentric video and tactile data.
		</p>

		<div class="post-specs reveal">
			{#each specs as spec (spec.label)}
				<div class="post-spec">
					<span class="post-spec-val">{spec.val}</span>
					<span class="post-spec-label">{spec.label}</span>
				</div>
			{/each}
		</div>

		<figure class="post-figure reveal">
			<img src="/assets/buildo-product.webp" alt="Buildo, the $10,000 open-source humanoid robot" />
			<figcaption>Buildo</figcaption>
		</figure>

		<p>
			It has <strong>31 degrees of freedom</strong> and uses five-fingered dexterous hands, giving developers
			a platform designed for manipulation rather than simply locomotion or demonstration.
		</p>

		<p>
			We have also focused heavily on controlling the hardware stack ourselves. More than 80% of
			Buildo's bill of materials is represented by its actuators and hands, and those components are
			manufactured in the United States.
		</p>

		<blockquote class="post-quote reveal">
			The next wave of robotics will not be won by hardware alone. It will be won by the ecosystem
			that allows thousands of developers to teach robots new capabilities.
		</blockquote>

		<h2>From a robot to an intelligence platform</h2>

		<p>
			Developers will be able to train skills and distribute those capabilities through a skill
			ecosystem, with the original developers retaining the entire portion of skill-token revenue.
		</p>

		<p>
			A researcher should eventually be able to create a manipulation skill, train it, publish it,
			and allow another robot elsewhere in the world to use it.
		</p>

		<p>
			As more robots are deployed, more real-world data can be generated. As more developers build
			skills, the machines become more useful. And as the intelligence layer improves, every
			compatible robot benefits.
		</p>

		<p>
			Our ambition is to build <strong
				>the largest open intelligence ecosystem for moving the physical world.</strong
			>
		</p>

		<h2>Developers are already building</h2>

		<p>This isn't just a concept on a whiteboard.</p>

		<p>
			More than <strong>50 developers from universities and startups</strong> are already developing on
			top of Buildo. One early example is Mazout Electric, which is collecting data and training robots
			for lithium-ion battery manufacturing workflows using the platform.
		</p>

		<p>That developer-first approach is intentional.</p>

		<p>
			Our initial market isn't millions of robots walking through homes. It is the researchers,
			robotics engineers, universities, and physical AI startups that need affordable hardware today
			to collect data, train manipulation models, test new ideas, and deploy new robotic skills.
		</p>

		<h2>What comes next</h2>

		<p>
			This funding gives us the resources to move from prototype and early developer adoption toward
			production and broader deployment.
		</p>

		<p>And we have built hardware before.</p>

		<p>
			Our founding team brings experience spanning robotics, machine learning, cryptography,
			embedded systems, aerospace, and mass manufacturing. Founder and Chief Engineer
			<strong>Vipul Saini previously founded Cypherock</strong>, while the wider engineering team
			has experience shipping production machine-learning systems, cryptographic hardware, robotics
			products, transformer models, and embedded electronics. Starforge is also supported by
			numerous robotics researchers working on sim-to-real reinforcement learning and high-dexterity
			manipulation.
		</p>

		<p>
			The next chapter is about turning that experience into a platform that thousands of builders
			can use.
		</p>

		<h2>Building the physical intelligence ecosystem</h2>

		<p>
			AI transformed software because developers no longer needed to build every capability from
			scratch.
		</p>

		<p>We believe robotics is approaching the same transition.</p>

		<p>
			The winning robot may not be the machine with the most compute inside it. It may be the
			machine connected to the largest ecosystem of intelligence, skills, training infrastructure,
			and real-world data.
		</p>

		<p>That is what we are building at Starforge Robotics.</p>

		<p class="post-closing-line">
			A capable humanoid. An open developer platform. And an intelligence layer designed to get
			better every time the ecosystem builds on top of it.
		</p>

		<p>The $500,000 pre-seed round is an important step toward that future.</p>

		<p>And we're just getting started.</p>
	</div>

	<footer class="post-foot reveal">
		<div class="post-foot-ctas">
			<a class="btn-primary" href={resolve('/buildo')}>Preorder Buildo</a>
			<a class="btn-ghost" href="https://portal.starforgerobotics.com"
				>Dev Portal<span class="post-cta-arrow" aria-hidden="true">↗</span></a
			>
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

	.post {
		position: relative;
		z-index: 1;
		max-width: 760px;
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

	/* The standfirst carries the same weight as a lede but is held apart from
	   the body by the rule below it rather than by size alone. */
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

	/* Set a step below the page title so the article reads as one hierarchy
	   rather than a stack of competing headlines. */
	.post-body :global(h2) {
		margin: 54px 0 22px;
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(28px, 3.6vw, 40px);
		font-weight: 400;
		letter-spacing: 0.04em;
		line-height: 1.05;
		color: var(--ink);
	}

	/* Opens the article slightly larger than the rest of the prose, then hands
	   off to the standard measure. */
	.post-lead {
		font-size: clamp(17px, 1.8vw, 20px) !important;
		line-height: 1.7 !important;
	}

	/* ── CALLOUT ── */
	.post-callout {
		margin: 34px 0;
		padding: 24px 26px;
		border-left: 3px solid var(--accent);
		background: rgba(20, 18, 16, 0.04);
	}

	.post-callout-label {
		margin-bottom: 10px;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--accent);
	}

	/* ── PULL QUOTE ── */
	.post-quote {
		margin: 46px 0;
		padding: 0 0 0 26px;
		border-left: 3px solid var(--ink);
		font-family: 'Barlow', sans-serif;
		font-size: clamp(21px, 2.7vw, 27px);
		font-weight: 300;
		font-style: italic;
		line-height: 1.42;
		color: var(--ink);
	}

	/* ── SPEC STRIP ── */
	/* Sits inside the Buildo section as a quick reference; the same figures stay
	   in the prose so the article still reads straight through. */
	.post-specs {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		margin: 32px 0;
		background: var(--border);
		border: 1px solid var(--border);
	}

	.post-spec {
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding: 18px 16px;
		background: var(--bg);
	}

	.post-spec-val {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(22px, 2.8vw, 30px);
		letter-spacing: 0.02em;
		line-height: 1;
		color: var(--ink);
	}

	.post-spec-label {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 9.5px;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		line-height: 1.45;
		color: var(--text-muted);
	}

	/* ── FIGURE ── */
	/* The render carries its own white ground, so a tinted panel behind it would
	   just frame a white rectangle. It sits on the page instead, the same way
	   the deck presents it. Native width is modest, so the height is capped to
	   keep the render sharp. */
	.post-figure {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		margin: 30px 0 38px;
		/* The page's scan lines come from a fixed overlay the article sits above,
		   so they are repeated here as a local background. That gives the render
		   something to blend into instead of a white rectangle. */
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 3px,
			rgba(0, 0, 0, 0.036) 3px,
			rgba(0, 0, 0, 0.036) 4px
		);
	}

	.post-figure img {
		display: block;
		width: auto;
		max-width: 100%;
		height: clamp(260px, 52vh, 460px);
		object-fit: contain;
		/* The render ships on a white ground, which would otherwise sit as a
		   visible rectangle over the page's scan lines. */
		mix-blend-mode: multiply;
	}

	.post-figure figcaption {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.post-closing-line {
		margin-top: 34px !important;
		padding: 22px 0 0;
		border-top: 1px solid var(--border);
		font-size: clamp(18px, 2vw, 22px) !important;
		font-weight: 600 !important;
		line-height: 1.5 !important;
		color: var(--ink) !important;
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

	.post-cta-arrow {
		display: inline-block;
		margin-left: 4px;
		font-size: 1.45em;
		line-height: 1;
		vertical-align: -0.08em;
		transition: transform 0.2s ease;
	}

	.post-foot-ctas a:hover .post-cta-arrow {
		transform: translate(2px, -2px);
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 760px) {
		.post {
			padding: calc(var(--header-height, 96px) + 36px) 24px 32px;
		}

		/* Held at three columns rather than wrapping to two: the values are short,
		   and an even split avoids leaving a dead cell in the last row. */
		.post-spec {
			padding: 14px 10px;
		}

		.post-spec-label {
			font-size: 8.5px;
			letter-spacing: 0.1em;
		}
	}
</style>
