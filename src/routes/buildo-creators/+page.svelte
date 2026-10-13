<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { setupRevealObserver } from '$lib/utils/reveal';

	onMount(() => {
		return setupRevealObserver({ threshold: 0.12 });
	});

	const signupHref = 'mailto:contact@starforgerobotics.com?subject=Become%20a%20Buildo%20Creator';
	const appStoreHref = 'https://portal.starforgerobotics.com';

	// Store listings aren't public yet. Drop the URLs in here when they are and
	// the badges turn into links; until then they read as "coming soon".
	const downloads: Array<{ store: string; label: string; href: string | null }> = [
		{ store: 'App Store', label: 'Download on the', href: null },
		{ store: 'Google Play', label: 'Get it on', href: null }
	];

	const steps = [
		{
			n: '01',
			title: 'Get the kit',
			body: 'Sign up as a Creator and order the Creator Kit — capture glasses and haptic gloves — straight from your in-app wallet.'
		},
		{
			n: '02',
			title: 'Record skills',
			body: 'Pick a use case, put on the kit and follow the on-screen guide while you do the task. Upload when you’re done.'
		},
		{
			n: '03',
			title: 'Build an app',
			body: 'Once every skill for a use case is recorded, bundle them into a named Buildo app — say, “Home Helper.”'
		},
		{
			n: '04',
			title: 'Earn forever',
			body: 'Your app passes certification and goes live on the Buildo App Store. Every install pays you again.'
		}
	];

	const earnings = [
		{
			tag: 'Recurring',
			title: 'Per-install earnings',
			body: 'Every time a robot owner installs your app on their Buildo, you earn. It repeats for every future install — income from work you did once.',
			lead: true
		},
		{
			tag: 'One-time',
			title: 'Per-skill reward',
			body: 'Get paid for each skill you record and upload, before your app ever reaches the store.'
		},
		{
			tag: 'Welcome',
			title: 'Signup bonus',
			body: 'New Creators get a bonus for joining, credited to the in-app wallet.'
		},
		{
			tag: 'Referral',
			title: 'Bring a friend',
			body: 'Refer someone who becomes a Creator and you earn a reward — they get a discount toward their own Buildo robot.'
		}
	];

	const kit = [
		{
			tag: 'Point of view',
			title: 'Capture glasses',
			img: '/assets/buildo-kit-glasses.png',
			alt: 'Buildo egocentric capture glasses',
			body: 'An eye-level camera records exactly what you see while you work, so the robot learns the task from the same viewpoint it will perform it from.'
		},
		{
			tag: 'Hand tracking',
			title: 'Haptic gloves',
			img: '/assets/buildo-kit-gloves.png',
			alt: 'Buildo haptic teleoperation gloves',
			body: 'The gloves track every hand and finger movement during the task — the fine detail a robot needs to grip, fold and place things the way you do.'
		}
	];

	const useCases = [
		{ name: 'Home', skills: ['Load the dishwasher', 'Fold laundry', 'Water plants'] },
		{ name: 'Shops', skills: ['Restock shelves', 'Face products', 'Bag purchases'] },
		{ name: 'Offices', skills: ['Sort mail', 'Tidy desks', 'Organise supplies'] },
		{ name: 'Warehouses', skills: ['Pick items', 'Pack boxes', 'Stack totes'] },
		{ name: 'Hospitals', skills: ['Fetch supplies', 'Make beds', 'Deliver trays'] }
	];

	// Same projection as scripts/build-creators-map.py: equirectangular,
	// cropped to 80N..58S. Keep these in step with LAT_TOP/LAT_BOTTOM there.
	const MAP_LAT_TOP = 80;
	const MAP_LAT_SPAN = 138;
	const markers = [
		{ city: 'Seattle', lon: -122.3, lat: 47.6 },
		{ city: 'San Francisco', lon: -122.4, lat: 37.8 },
		{ city: 'Los Angeles', lon: -118.2, lat: 34.1 },
		{ city: 'Denver', lon: -105, lat: 39.7 },
		{ city: 'Austin', lon: -97.7, lat: 30.3 },
		{ city: 'Chicago', lon: -87.6, lat: 41.9 },
		{ city: 'Atlanta', lon: -84.4, lat: 33.7 },
		{ city: 'Miami', lon: -80.2, lat: 25.8 },
		{ city: 'New York', lon: -74, lat: 40.7 },
		{ city: 'Boston', lon: -71.1, lat: 42.4 },
		{ city: 'London', lon: -0.1, lat: 51.5 },
		{ city: 'Delhi', lon: 77.2, lat: 28.6 },
		{ city: 'Lucknow', lon: 80.9, lat: 26.8 },
		{ city: 'Ahmedabad', lon: 72.6, lat: 23 },
		{ city: 'Kolkata', lon: 88.4, lat: 22.6 },
		{ city: 'Nagpur', lon: 79.1, lat: 21.1 },
		{ city: 'Mumbai', lon: 72.9, lat: 19.1 },
		{ city: 'Hyderabad', lon: 78.5, lat: 17.4 },
		{ city: 'Bengaluru', lon: 77.6, lat: 13 },
		{ city: 'Kochi', lon: 76.3, lat: 9.9 }
	].map((m, i) => ({
		...m,
		x: ((m.lon + 180) / 360) * 100,
		y: ((MAP_LAT_TOP - m.lat) / MAP_LAT_SPAN) * 100,
		// Staggered so the pings ripple across the map rather than pulsing in sync.
		delay: (i * 0.37) % 2.4
	}));

	const regions = [
		{ name: 'United States', detail: 'Homes, shops and offices' },
		{ name: 'United Kingdom', detail: 'Homes and retail' },
		{ name: 'India', detail: 'Warehouses and hospitals' }
	];

	const faqs = [
		{
			q: 'Do I need any robotics or technical background?',
			a: 'No. If you can do everyday tasks like cleaning, cooking or organising, you can be a Creator. The app walks you through every recording step by step.'
		},
		{
			q: 'Do I have to buy the Creator Kit?',
			a: 'Yes — the glasses and gloves are what capture the data, so you need the kit before you can record a skill. It’s a one-time purchase made from your in-app wallet, with a buy-now, pay-later option.'
		},
		{
			q: 'How much can I earn?',
			a: 'You earn a reward for each skill you upload, and then again every time a robot owner installs an app you trained. All earnings — skill rewards, install income, the signup bonus and referral rewards — are paid in US dollars. Current rates are shown in the app.'
		},
		{
			q: 'What kinds of tasks will I record?',
			a: 'Real tasks from five settings: homes, shops, offices, warehouses and hospitals. Each use case lists the skills a robot needs for that setting — loading a dishwasher, restocking a shelf, packing a box.'
		},
		{
			q: 'What happens after I upload my skills?',
			a: 'Your recordings train Buildo to do the task. When a use case is complete you bundle the skills into an app, it runs through an automated testing and certification window, and then it goes live on the Buildo App Store.'
		},
		{
			q: 'Who installs the apps I build?',
			a: 'Owners of Buildo robots. They browse the same App Store you see in Buildo Creators and install apps straight onto their robot — and each install earns the Creator who trained it.'
		}
	];
</script>

<svelte:head>
	<title>Buildo Creators - Get Paid to Teach a Robot | STARFORGE</title>
	<meta
		name="description"
		content="Buildo Creators lets anyone earn by teaching robots real-world tasks. Put on the Creator Kit, record everyday skills, publish an app to the Buildo App Store, and earn every time it's installed."
	/>
</svelte:head>

<div class="bd-scan" aria-hidden="true"></div>

<header class="rdk-hero bc-hero">
	<div class="hero-scan-lines" aria-hidden="true"></div>
	<div class="bc-hero-layout">
		<div class="bc-hero-copy">
			<span class="hero-tag">The Buildo Creators app</span>
			<h1 class="bc-hero-title">Get paid to<br /><span>teach a robot</span></h1>
			<p class="bc-hero-sub">
				Put on the Creator Kit, do the everyday tasks you already know how to do, and earn every
				time a Buildo robot learns from you. No robotics, AI or coding experience needed.
			</p>
			<div class="bc-ctas">
				<a class="btn-primary" href={signupHref}>Become a Creator</a>
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a class="btn-ghost" href="#how-it-works">How it works</a>
			</div>
			<p class="bc-hero-note">iOS &amp; Android · Coming soon</p>
		</div>

		<div class="bc-hero-visual" aria-hidden="true">
			<div class="bc-hero-kit">
				<figure class="bc-hero-fig">
					<img src="/assets/buildo-kit-glasses.png" alt="" />
					<figcaption>Your view</figcaption>
				</figure>
				<figure class="bc-hero-fig">
					<img src="/assets/buildo-kit-gloves.png" alt="" />
					<figcaption>Your hands</figcaption>
				</figure>
			</div>
			<div class="bc-hero-arrow">
				<span>teaches</span>
				<i></i>
			</div>
			<figure class="bc-hero-fig bc-hero-robot">
				<img src="/assets/buildo-product.webp" alt="" />
				<figcaption>Buildo</figcaption>
			</figure>
		</div>
	</div>
</header>

<section class="bd-section">
	<div class="bd-split">
		<div class="reveal">
			<span class="section-label">What is Buildo Creators</span>
			<h2 class="section-title">Real people train<br /><span>real robots</span></h2>
			<p class="section-body">
				Buildo is a general-purpose robot for homes, shops, offices, warehouses and hospitals. To do
				real work it has to learn from people who already do that work — thousands of hours of human
				demonstration.
			</p>
			<p class="section-body" style="margin-top:20px;">
				Buildo Creators is how that happens. You wear the capture kit, perform a task the way you
				normally would, and get paid for teaching it. It’s a new kind of flexible work: your hands
				are the training data.
			</p>
		</div>
		<div class="bd-card reveal" style="transition-delay:0.12s">
			<div class="bd-card-title">Made for everyone</div>
			<ul class="bd-bullets">
				<li><strong>No technical skills</strong> - no robotics, AI or coding knowledge</li>
				<li><strong>Flexible</strong> - record when it suits you, as side income</li>
				<li><strong>Everyday tasks</strong> - cleaning, cooking, organising, handling</li>
				<li><strong>Paid in USD</strong> - every reward is paid in US dollars</li>
			</ul>
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section" id="how-it-works">
	<div class="bd-section-head reveal">
		<span class="section-label">How It Works</span>
		<h2 class="section-title">Teach once,<br /><span>earn on every install</span></h2>
	</div>

	<ol class="bc-steps">
		{#each steps as step, i (step.n)}
			<li class="bc-step reveal" style="transition-delay:{0.08 * i}s">
				<span class="bc-step-n">{step.n}</span>
				<div class="bc-step-title">{step.title}</div>
				<p class="bc-step-body">{step.body}</p>
			</li>
		{/each}
	</ol>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-section-head reveal">
		<span class="section-label">Earning Potential</span>
		<h2 class="section-title">Four ways<br /><span>to earn</span></h2>
		<p class="section-body">
			Get paid up front for each skill you record, then keep earning for as long as robots keep
			installing the app you trained.
		</p>
	</div>

	<div class="bc-earn">
		{#each earnings as e, i (e.title)}
			<div class="bc-earn-card reveal" class:lead={e.lead} style="transition-delay:{0.08 * i}s">
				<span class="bd-component-tag">{e.tag}</span>
				<div class="bc-earn-title">{e.title}</div>
				<p class="bc-earn-body">{e.body}</p>
			</div>
		{/each}
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-section-head reveal">
		<span class="section-label">The Creator Kit</span>
		<h2 class="section-title">Everything you need<br /><span>to record a skill</span></h2>
		<p class="section-body">
			The kit is a one-time purchase, paid from your in-app wallet with a buy-now, pay-later option.
			You need it before you can record your first skill.
		</p>
	</div>

	<div class="bd-components">
		{#each kit as item, i (item.title)}
			<div class="bd-component reveal" style="transition-delay:{0.1 + i * 0.12}s">
				<div class="bd-component-img">
					<img src={item.img} alt={item.alt} />
				</div>
				<div class="bd-component-content">
					<span class="bd-component-tag">{item.tag}</span>
					<div class="bd-component-title">{item.title}</div>
					<p class="bd-component-body">{item.body}</p>
				</div>
			</div>
		{/each}
	</div>

	<a class="bc-text-link reveal" href={resolve('/buildo-development-kit')}
		>Full hardware specifications →</a
	>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-section-head reveal">
		<span class="section-label">Use Cases</span>
		<h2 class="section-title">Five places<br /><span>robots need you</span></h2>
		<p class="section-body">
			Each use case lists the skills that make up a complete Buildo app for that setting. Record
			them all and the app is yours to publish.
		</p>
	</div>

	<div class="bc-uses">
		{#each useCases as uc, i (uc.name)}
			<div class="bc-use reveal" style="transition-delay:{0.06 * i}s">
				<span class="bc-use-n">0{i + 1}</span>
				<div class="bd-app-name">{uc.name}</div>
				<ul class="bc-use-skills">
					{#each uc.skills as skill (skill)}
						<li>{skill}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-split">
		<div class="reveal">
			<span class="section-label">The Buildo App Store</span>
			<h2 class="section-title">A real marketplace<br /><span>for your work</span></h2>
			<p class="section-body">
				Every live Creator-made app is listed publicly on the Buildo App Store — the same
				marketplace robot owners use to browse and install apps on their own Buildo.
			</p>
			<p class="section-body" style="margin-top:20px;">
				Apps built by Creators are already live across all five use cases. Yours joins them once it
				clears certification.
			</p>
			<div class="bc-ctas" style="margin-top:36px;">
				<a class="btn-ghost" href={appStoreHref}>Browse the App Store ↗</a>
			</div>
		</div>
		<ol class="bd-card bc-flow reveal" style="transition-delay:0.12s">
			<li>
				<span class="bd-component-tag">Creator</span>
				<strong>Records skills</strong> and bundles them into an app
			</li>
			<li>
				<span class="bd-component-tag">App Store</span>
				<strong>Tests and certifies</strong> the app, then lists it publicly
			</li>
			<li>
				<span class="bd-component-tag">Robot owner</span>
				<strong>Installs the app</strong> on their Buildo — and the Creator gets paid
			</li>
		</ol>
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-section-head reveal">
		<span class="section-label">Global Reach</span>
		<h2 class="section-title">Join a growing<br /><span>global network</span></h2>
		<p class="section-body">
			Buildo robots are already at work around the world, with the biggest concentrations in the
			United States, the United Kingdom and India. The live map in the app shows every deployment.
		</p>
	</div>

	<div
		class="bc-map reveal"
		role="img"
		aria-label="World map marking Buildo deployments in the United States, the United Kingdom and India"
	>
		<img src="/assets/creators-world-dots.svg" alt="" />
		{#each markers as m (m.city)}
			<span class="bc-marker" style="left:{m.x}%;top:{m.y}%;--d:{m.delay}s" title={m.city}></span>
		{/each}
	</div>

	<dl class="bc-regions">
		{#each regions as r, i (r.name)}
			<div class="bc-region reveal" style="transition-delay:{0.08 * i}s">
				<dt>{r.name}</dt>
				<dd>{r.detail}</dd>
			</div>
		{/each}
	</dl>
</section>

<div class="hr-line"></div>

<section class="bd-section bd-closing" id="download">
	<div class="bd-closing-inner reveal">
		<span class="section-label">Become a Creator</span>
		<h2 class="section-title">Your skills,<br /><span>Buildo’s next app</span></h2>
		<p class="section-body">
			Buildo Creators is coming to iOS and Android. Get in touch now and we’ll reserve your place —
			and let you know the moment the app is live.
		</p>
		<div class="bc-ctas" style="margin-top:36px;">
			<a class="btn-primary" href={signupHref}>Become a Creator</a>
		</div>
		<div class="bc-badges">
			{#each downloads as d (d.store)}
				{#if d.href}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a class="bc-badge" href={d.href} target="_blank" rel="noopener noreferrer">
						<span class="bc-badge-label">{d.label}</span>
						<span class="bc-badge-store">{d.store}</span>
					</a>
				{:else}
					<span class="bc-badge bc-badge--soon">
						<span class="bc-badge-label">Coming soon</span>
						<span class="bc-badge-store">{d.store}</span>
					</span>
				{/if}
			{/each}
		</div>
	</div>
</section>

<div class="hr-line"></div>

<section class="bd-section">
	<div class="bd-split bc-faq-layout">
		<div class="reveal">
			<span class="section-label">FAQ</span>
			<h2 class="section-title">Questions,<br /><span>answered</span></h2>
			<p class="section-body">
				Anything else? Email
				<a class="bc-inline-link" href="mailto:contact@starforgerobotics.com"
					>contact@starforgerobotics.com</a
				>.
			</p>
		</div>
		<div class="bc-faq reveal" style="transition-delay:0.12s">
			{#each faqs as f (f.q)}
				<details class="bc-faq-item">
					<summary>{f.q}</summary>
					<p>{f.a}</p>
				</details>
			{/each}
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

	/* ── HERO ── */
	.bc-hero {
		padding-bottom: 96px;
	}

	.bc-hero-layout {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 64px;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		padding-top: 48px;
	}

	.bc-hero-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(52px, 7vw, 104px);
		line-height: 0.92;
		letter-spacing: 0.02em;
		color: var(--ink);
		margin-bottom: 28px;
		opacity: 0;
		animation: fadeUp 0.9s 0.5s forwards;
	}

	.bc-hero-title span {
		color: var(--accent);
	}

	.bc-hero-sub {
		font-size: clamp(17px, 1.6vw, 20px);
		line-height: 1.6;
		color: rgba(20, 18, 16, 0.86);
		max-width: 52ch;
		margin-bottom: 40px;
		opacity: 0;
		animation: fadeUp 0.9s 0.7s forwards;
	}

	.bc-hero-copy .bc-ctas,
	.bc-hero-note {
		opacity: 0;
		animation: fadeUp 0.9s 0.9s forwards;
	}

	.bc-hero-note {
		margin-top: 22px;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.bc-hero-visual {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 20px;
		padding: 32px;
		border: 2px solid var(--border);
		background: rgba(255, 255, 255, 0.55);
		opacity: 0;
		animation: fadeUp 1s 0.8s forwards;
	}

	.bc-hero-kit {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.bc-hero-fig {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		margin: 0;
	}

	.bc-hero-fig img {
		display: block;
		width: 100%;
		max-height: 130px;
		object-fit: contain;
	}

	.bc-hero-robot img {
		max-height: 340px;
	}

	.bc-hero-fig figcaption {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.bc-hero-arrow {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 9px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.bc-hero-arrow i {
		position: relative;
		display: block;
		width: 56px;
		height: 1px;
		background: var(--accent);
	}

	.bc-hero-arrow i::after {
		content: '';
		position: absolute;
		right: 0;
		top: -4px;
		width: 8px;
		height: 8px;
		border-top: 1px solid var(--accent);
		border-right: 1px solid var(--accent);
		transform: rotate(45deg);
	}

	.bc-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
	}

	/* ── SECTIONS (mirrors the Dev Kit page) ── */
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

	.bd-app-name {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 28px;
		letter-spacing: 0.04em;
		color: var(--ink);
		margin-bottom: 14px;
	}

	.bd-closing-inner {
		max-width: 62ch;
	}

	.bc-text-link,
	.bc-inline-link {
		color: var(--accent);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s ease;
	}

	.bc-text-link {
		display: inline-block;
		margin-top: 28px;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.bc-inline-link {
		border-bottom-color: currentColor;
	}

	.bc-text-link:hover,
	.bc-inline-link:hover {
		border-bottom-color: var(--accent-strong);
		color: var(--accent-strong);
	}

	/* ── STEPS ── */
	.bc-steps {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2px;
		background: var(--border);
		border: 2px solid var(--border);
	}

	.bc-step {
		padding: 36px 28px 40px;
		background: #fcfaf7;
	}

	.bc-step-n {
		display: block;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 64px;
		line-height: 1;
		color: var(--accent);
		margin-bottom: 18px;
	}

	.bc-step-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 28px;
		letter-spacing: 0.04em;
		color: var(--ink);
		margin-bottom: 12px;
	}

	.bc-step-body {
		font-size: 14px;
		line-height: 1.75;
		color: rgba(20, 18, 16, 0.82);
	}

	/* ── EARNINGS ── */
	.bc-earn {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.bc-earn-card {
		padding: 32px 30px 36px;
		border: 2px solid var(--border);
		background: rgba(20, 18, 16, 0.022);
		transition: border-color 0.3s ease;
	}

	.bc-earn-card:hover {
		border-color: var(--border-strong);
	}

	/* Recurring install income is the headline incentive, so it spans the row
	   and carries the accent rather than sitting as one card among equals. */
	.bc-earn-card.lead {
		grid-column: 1 / -1;
		border-color: var(--accent);
		background: linear-gradient(135deg, rgba(122, 94, 15, 0.07) 0%, transparent 70%);
	}

	.bc-earn-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 32px;
		letter-spacing: 0.04em;
		color: var(--ink);
		margin-bottom: 12px;
	}

	.bc-earn-card.lead .bc-earn-title {
		font-size: clamp(36px, 4vw, 52px);
	}

	.bc-earn-body {
		font-size: 14px;
		line-height: 1.8;
		color: rgba(20, 18, 16, 0.82);
		max-width: 62ch;
	}

	.bc-earn-card.lead .bc-earn-body {
		font-size: 16px;
	}

	/* ── USE CASES ── */
	.bc-uses {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 2px;
		background: var(--border);
		border: 2px solid var(--border);
	}

	.bc-use {
		padding: 30px 24px 34px;
		background: #fcfaf7;
		transition: background 0.3s ease;
	}

	.bc-use:hover {
		background: #f6f2ec;
	}

	.bc-use-n {
		display: block;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.22em;
		color: var(--accent);
		margin-bottom: 16px;
	}

	.bc-use-skills {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.bc-use-skills li {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 11px;
		line-height: 1.5;
		color: var(--text-muted);
	}

	/* ── APP STORE FLOW ── */
	.bc-flow {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.bc-flow li {
		position: relative;
		padding: 0 0 26px 28px;
		font-size: 15px;
		line-height: 1.7;
		color: rgba(20, 18, 16, 0.82);
	}

	.bc-flow li:last-child {
		padding-bottom: 0;
	}

	/* A rail down the left joins the three parties into one sequence. */
	.bc-flow li::before {
		content: '';
		position: absolute;
		left: 4px;
		top: 4px;
		width: 9px;
		height: 9px;
		border: 2px solid var(--accent);
		background: var(--bg);
	}

	.bc-flow li:not(:last-child)::after {
		content: '';
		position: absolute;
		left: 8px;
		top: 17px;
		bottom: 2px;
		width: 1px;
		background: var(--border-strong);
	}

	.bc-flow strong {
		color: var(--ink);
		font-weight: 600;
	}

	/* ── MAP ── */
	.bc-map {
		position: relative;
		width: 100%;
		aspect-ratio: 180 / 69;
	}

	.bc-map img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.bc-marker {
		position: absolute;
		width: 10px;
		height: 10px;
		margin: -5px 0 0 -5px;
		border-radius: 50%;
		background: var(--accent);
	}

	.bc-marker::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 2px solid var(--accent);
		animation: bcPing 2.4s var(--d, 0s) ease-out infinite;
	}

	@keyframes bcPing {
		0% {
			transform: scale(1);
			opacity: 0.8;
		}
		100% {
			transform: scale(4);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bc-marker::after {
			animation: none;
		}
	}

	.bc-regions {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		margin: 48px 0 0;
		padding-top: 32px;
		border-top: 1px solid var(--border);
	}

	.bc-region dt {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(28px, 2.6vw, 38px);
		letter-spacing: 0.03em;
		line-height: 1;
		color: var(--ink);
		margin-bottom: 8px;
	}

	.bc-region dd {
		margin: 0;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	/* ── DOWNLOAD BADGES ── */
	.bc-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		margin-top: 20px;
	}

	.bc-badge {
		display: inline-flex;
		flex-direction: column;
		gap: 2px;
		min-width: 168px;
		padding: 10px 20px 12px;
		background: var(--ink);
		color: #fdfaf3;
		text-decoration: none;
		transition: transform 0.2s;
	}

	a.bc-badge:hover {
		transform: translateY(-2px);
	}

	.bc-badge--soon {
		background: transparent;
		color: var(--text-muted);
		border: 2px dashed var(--border-strong);
	}

	.bc-badge-label {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 9px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.bc-badge-store {
		font-family: 'Barlow', sans-serif;
		font-weight: 600;
		font-size: 19px;
		letter-spacing: 0.01em;
	}

	/* ── FAQ ── */
	.bc-faq-layout {
		align-items: start;
	}

	.bc-faq {
		border-top: 2px solid var(--border);
	}

	.bc-faq-item {
		border-bottom: 1px solid var(--border);
	}

	.bc-faq-item summary {
		position: relative;
		list-style: none;
		padding: 22px 40px 22px 0;
		font-family: 'Barlow', sans-serif;
		font-weight: 600;
		font-size: 17px;
		line-height: 1.4;
		color: var(--ink);
		transition: color 0.2s;
	}

	.bc-faq-item summary::-webkit-details-marker {
		display: none;
	}

	.bc-faq-item summary::after {
		content: '+';
		position: absolute;
		right: 4px;
		top: 50%;
		transform: translateY(-50%);
		font-family: 'Space Mono', monospace;
		font-size: 20px;
		color: var(--accent);
		transition: transform 0.2s;
	}

	.bc-faq-item[open] summary::after {
		transform: translateY(-50%) rotate(45deg);
	}

	.bc-faq-item summary:hover {
		color: var(--accent);
	}

	.bc-faq-item p {
		padding: 0 40px 24px 0;
		font-size: 15px;
		line-height: 1.8;
		color: rgba(20, 18, 16, 0.82);
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 1000px) {
		.bc-steps {
			grid-template-columns: repeat(2, 1fr);
		}

		.bc-uses {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 900px) {
		.bc-hero-layout,
		.bd-split {
			grid-template-columns: 1fr;
			gap: 48px;
		}

		.bc-hero-layout {
			padding-top: 24px;
		}

		.bd-section {
			padding: 80px 24px;
		}

		.bd-section-head {
			margin-bottom: 48px;
		}

		.bd-components,
		.bc-earn {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 560px) {
		.bc-steps,
		.bc-uses,
		.bc-regions {
			grid-template-columns: 1fr;
		}

		.bc-hero-visual {
			padding: 20px 16px;
			gap: 12px;
		}

		.bc-hero-arrow i {
			width: 32px;
		}

		.bc-hero-robot img {
			max-height: 240px;
		}

		.bc-marker {
			width: 7px;
			height: 7px;
			margin: -3.5px 0 0 -3.5px;
		}
	}
</style>
