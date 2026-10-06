<script lang="ts">
	const businesses = [
		{
			who: 'A carpenter',
			what: 'could train framing and installation skills and run a construction fleet.'
		},
		{
			who: 'A mover',
			what: 'could train loading and material-handling apps and operate a robotic moving company.'
		},
		{
			who: 'A mechanic',
			what: 'could train maintenance skills and supervise fleets of service robots.'
		},
		{
			who: 'A warehouse operator',
			what: 'could train picking and handling workflows and run a robotic fulfillment operation.'
		}
	];
</script>

<svelte:head>
	<title>Founder Thesis — The Intelligence Economy for Physical AI - Starforge</title>
	<meta
		name="description"
		content="Why dual-brain robots, cloud-hosted robot apps, wearable demonstrations, and usage-based incentives can turn human expertise into scalable robotic businesses."
	/>
</svelte:head>

<div class="scan" aria-hidden="true"></div>

<article class="thesis">
	<header class="head">
		<span class="section-label">Founder thesis</span>
		<h1>The intelligence economy for <span>physical AI</span></h1>
		<div class="founder">
			<img src="/assets/team/vipul-thesis.jpg" alt="Vipul Saini" />
			<div>
				<p class="founder-name">Vipul Saini</p>
				<p class="founder-role">Founder</p>
			</div>
		</div>
		<p class="dek">
			Why dual-brain robots, cloud-hosted robot apps, wearable demonstrations, and usage-based
			incentives can turn human expertise into scalable robotic businesses.
		</p>
	</header>

	<section>
		<h2>Robots will work in two worlds</h2>
		<p>We believe robots will not just do physical work. They will do digital work too.</p>
		<p>
			A warehouse robot shouldn't only pick a box. It should understand what it picked, update the
			inventory database, reconcile stock levels, trigger a replenishment workflow, flag anomalies, and
			coordinate with the software that runs the warehouse. A construction robot shouldn't only drill,
			lift, or install. It should understand the drawings, track progress against the plan, calculate
			material requirements, document what was completed, and coordinate the next task.
		</p>
		<p>
			That means the robot of the future is not simply a machine with arms. It is a computer capable of
			acting in both the physical and digital worlds.
		</p>
	</section>

	<section>
		<h2>The dual-brain architecture</h2>
		<p>We believe that requires a dual-brain architecture.</p>
		<div class="brains">
			<div>
				<span class="kicker">Edge</span>
				<h3>Small and fast</h3>
				<p>
					It handles what cannot tolerate latency: motion execution, kinematics, actuator control,
					safety, sensor processing, and contact response.
				</p>
			</div>
			<div>
				<span class="kicker">Cloud</span>
				<h3>As large as the task</h3>
				<p>
					It handles perception, reasoning, planning, memory, engineering knowledge, enterprise
					software, and increasingly capable multimodal foundation models.
				</p>
			</div>
		</div>
		<p>
			This separation changes the economics of robotics. The intelligence of a robot no longer has to
			be constrained by the compute physically installed inside it. A robot shipped today should be
			able to become dramatically more capable three years from now without replacing its onboard
			hardware.
		</p>
		<p class="emphasis">
			Once the intelligence lives in the cloud, the cloud model becomes the robot app.
		</p>
	</section>

	<section>
		<h2>From robots to an app economy</h2>
		<p>
			A developer could build a model for drywall installation, warehouse picking, hotel room service,
			machine tending, coffee preparation, inventory auditing, agricultural harvesting, or thousands of
			other tasks. That model can live in the cloud and be called by deployed robots through inference.
		</p>
		<p>
			The robot becomes the hardware endpoint. The model becomes the application. Inference becomes the
			transaction.
		</p>
		<p>
			We have already seen how powerful this economic model can become in traditional computing. Apple
			says the global App Store ecosystem facilitated nearly $1.3 trillion in developer billings and
			sales in 2024. The App Store now attracts more than 850 million visitors each week, and Apple says
			developers selling digital goods and services have earned more than $550 billion since 2008.<a
				class="cite"
				href="https://www.apple.com/newsroom/pdfs/2024-Apple-Global-Ecosystem-Report-June2025.pdf"
				target="_blank"
				rel="noopener noreferrer">[1]</a
			>
		</p>
		<p>The lesson is not that robots need a literal copy of the App Store.</p>
		<p>
			The lesson is that when hardware becomes a distribution platform for third-party software, the
			economic activity created on top of the hardware can become enormous.
		</p>
		<p>We think physical AI creates the next version of that opportunity.</p>
	</section>

	<section>
		<h2>The next bottleneck is physical data</h2>
		<p>But to make this happen, robotics has another fundamental bottleneck to solve: data.</p>
		<p>
			You cannot give millions of people expensive robotic arms and ask them to collect demonstrations.
			Robot hardware is too expensive, too scarce, too difficult to distribute, and too cumbersome to
			operate at data-collection scale.
		</p>
		<p>But you can distribute relatively inexpensive sensor gloves and smart glasses.</p>
		<p>
			Humans already perform the tasks we want robots to learn. Every day, billions of hands operate
			tools, prepare food, assemble objects, repair machines, open doors, stock shelves, use appliances,
			and perform specialized trades.
		</p>
		<p>
			Instead of waiting for robot fleets to slowly rediscover those behaviors through expensive
			robot-native demonstrations, we can capture human demonstrations directly.
		</p>
		<p>Glasses provide the egocentric view of the task.</p>
		<p>Gloves provide hand motion, finger state, contact, pressure, and interaction data.</p>
		<p>Together, they can turn human work into structured physical-intelligence data.</p>
		<p>
			This means the robotics data network does not have to scale at the same speed as robot
			manufacturing.
		</p>
		<p class="emphasis">
			You might have 10,000 robots but 1 million people capable of contributing demonstrations.
		</p>
		<p>That asymmetry can be incredibly powerful.</p>
	</section>

	<section>
		<h2>A worker can turn expertise into a robot company</h2>
		<p>
			A construction worker already knows how to frame a wall, install drywall, operate tools, sequence
			a job, and recover when something goes wrong.
		</p>
		<p>
			Instead of requiring a robotics company to recreate that knowledge from scratch, the worker can
			wear inexpensive sensor gloves and smart glasses while doing the job normally. Those
			demonstrations become training data for a construction skill model.
		</p>
		<p>
			The training data becomes a robot skill app. The app becomes the cloud intelligence used by a
			fleet of construction robots.
		</p>
		<blockquote>
			A skilled worker can demonstrate a task with gloves and glasses, turn that expertise into a robot
			skill app, and deploy the app to a fleet of robots that becomes the labor force of their own
			company.
		</blockquote>
		<figure class="worker">
			<img
				src="/assets/thesis-skilled-worker.jpg"
				alt="A skilled worker in a hard hat, safety glasses, and gloves operating machinery"
			/>
		</figure>
		<p>
			The worker can then deploy that app to their own robots. The robots provide scalable physical
			execution, while cloud AI contributes construction reasoning, design assistance, quantity
			estimation, scheduling, procurement, documentation, and planning.
		</p>
		<p>
			The same cloud intelligence that tells a robot how to install a component can read the drawing,
			calculate material requirements, update the project schedule, document progress, flag a
			discrepancy, and issue the next physical task.
		</p>
		<p>
			The person who once sold physical labor by the hour can become the trainer, app owner, robot fleet
			operator, and business owner.
		</p>
	</section>

	<section>
		<h2>The economic unit changes</h2>
		<div class="units">
			<div>
				<span class="kicker">Traditional company</span>
				<p>One skilled worker, hired crews, and support staff. Scale tied to headcount.</p>
			</div>
			<div>
				<span class="kicker">Robot-native company</span>
				<p>
					One skilled worker, a skill app, cloud intelligence, and a robot fleet. Company-scale
					productive capacity.
				</p>
			</div>
		</div>
		<p class="emphasis">This is why we see robotics as labor leverage, not only labor replacement.</p>
		<ul class="trades">
			{#each businesses as item (item.who)}
				<li>
					<strong>{item.who}</strong>
					{item.what}
				</li>
			{/each}
		</ul>
		<p>
			The worker is no longer limited by the number of hours they can personally work or the number of
			employees they can afford to hire. Their expertise can be multiplied across machines. This
			happened with digital AI<a
				class="cite"
				href="https://x.com/KobeissiLetter/status/2106777112552390986"
				target="_blank"
				rel="noopener noreferrer">[2]</a
			>
			and will happen with physical AI too.
		</p>
		<figure class="worker">
			<img
				src="/assets/thesis-robot-fleet.jpg"
				alt="Humanoid robots assembling large components on a factory floor"
			/>
		</figure>
		<p>
			That can create a new class of small businesses: one skilled human, a portfolio of robot skill
			apps, cloud intelligence, and a fleet of robots producing at a scale that previously required a
			much larger organization.
		</p>
	</section>

	<section>
		<h2>The flywheel</h2>
		<p>That creates a marketplace not merely for software, but for physical intelligence.</p>
		<p>
			A great electrician could help create an electrical-installation model. A great welder could
			contribute data to a welding model. A skilled technician could create a machine-maintenance
			model. A developer could combine those datasets with a powerful foundation model, package the
			intelligence into a cloud application, and distribute it to robots around the world.
		</p>
		<p>
			The person creating the intelligence no longer needs to manufacture the robot. The person
			operating the business no longer needs to build the AI. And the company manufacturing the robot
			no longer needs to develop every skill its customers could ever need.
		</p>
		<p>That division of labor is what made previous computing platforms explode.</p>
		<p>
			Apple did not build every iPhone application. Microsoft did not write every Windows program.
			Amazon did not manufacture every product sold through its marketplace.
		</p>
		<p>
			Platforms became powerful when they created the infrastructure and economic incentives for other
			people to create value on top of them.
		</p>
		<p>Robotics needs the same transition.</p>
	</section>

	<section>
		<h2>A platform that compounds across three dimensions</h2>
		<p>
			More robots create more inference demand. More inference demand attracts more developers. More
			developers create more skills. More useful skills increase the value of owning a robot. More
			deployed robots create a larger market for those apps.
		</p>
		<p>
			And because app developers make money from usage, they are economically incentivized to
			continuously create better datasets, better models, and entirely new capabilities.
		</p>
		<p>
			Meanwhile, the dual-brain architecture means those models can keep getting larger and more capable
			without forcing every robot to carry more GPUs onboard.
		</p>
		<p>The cloud becomes an effectively expanding brain shared across a distributed physical workforce.</p>
	</section>

	<section>
		<h2>The opportunity</h2>
		<p>That is why the opportunity is bigger than building another humanoid robot.</p>
		<p>It is bigger than building another VLA.</p>
		<p>
			The opportunity is to build the economic and intelligence layer for physical AI: a system where
			human expertise can become training data, training data can become robot intelligence,
			intelligence can become cloud apps, developers can earn when those apps are used, and individual
			humans can command levels of productive capacity that once required entire organizations.
		</p>
	</section>

	<footer id="sources">
		<p class="sources-label">Sources</p>
		<ol>
			<li>
				Apple, “The App Store ecosystem in 2024.”
				<a
					href="https://www.apple.com/newsroom/pdfs/2024-Apple-Global-Ecosystem-Report-June2025.pdf"
					target="_blank"
					rel="noopener noreferrer">Apple Newsroom ecosystem report</a
				>.
			</li>
			<li>
				LinkedIn estimates, via
				<a
					href="https://x.com/KobeissiLetter/status/2106777112552390986"
					target="_blank"
					rel="noopener noreferrer">The Kobeissi Letter</a
				> — digital AI-linked roles have accounted for more than 750,000 new jobs in the US since 2023.
			</li>
		</ol>
	</footer>
</article>

<style>
	.scan {
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

	.thesis {
		position: relative;
		z-index: 1;
		max-width: 820px;
		margin: 0 auto;
		padding: calc(var(--header-height, 96px) + 56px) 40px 88px;
	}

	.head h1 {
		max-width: 16ch;
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(46px, 7vw, 78px);
		font-weight: 400;
		letter-spacing: 0.03em;
		line-height: 0.92;
		color: var(--ink);
	}

	.head h1 span {
		color: var(--accent);
	}

	.dek {
		max-width: 38rem;
		margin-top: 22px;
		font-size: clamp(17px, 2vw, 20px);
		font-weight: 500;
		line-height: 1.5;
		color: rgba(20, 18, 16, 0.86);
	}

	.founder {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 18px;
	}

	.founder img {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		object-fit: cover;
		object-position: center center;
	}

	.founder-name,
	.founder-role {
		margin: 0;
	}

	.founder-name {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 22px;
		letter-spacing: 0.04em;
		line-height: 1;
		color: var(--ink);
	}

	.founder-role {
		margin-top: 6px;
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.worker {
		margin: 4px 0 26px;
	}

	.worker img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 2px;
	}

	section {
		padding: 48px 0 0;
	}

	h2 {
		margin: 0 0 16px;
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(28px, 3.6vw, 40px);
		font-weight: 400;
		letter-spacing: 0.04em;
		line-height: 1.02;
		color: var(--ink);
	}

	p {
		margin: 0 0 16px;
		font-size: clamp(16px, 1.5vw, 18px);
		font-weight: 500;
		line-height: 1.7;
		color: rgba(20, 18, 16, 0.86);
	}

	.emphasis {
		font-weight: 600;
		color: var(--ink);
	}

	.cite {
		color: var(--accent);
		font-weight: 700;
		text-decoration: none;
	}

	.brains,
	.units {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
		margin: 8px 0 22px;
	}

	.brains > div,
	.units > div {
		padding: 18px 18px 8px;
		border: 1px solid var(--border-strong);
		background: rgba(255, 255, 255, 0.55);
	}

	.kicker {
		font-family: 'Space Mono', monospace;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	h3 {
		margin: 8px 0 8px;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 26px;
		font-weight: 400;
		letter-spacing: 0.04em;
		line-height: 1;
	}

	blockquote {
		margin: 8px 0 22px;
		padding: 4px 0 4px 18px;
		border-left: 2px solid var(--accent);
		font-size: clamp(17px, 1.8vw, 20px);
		font-weight: 600;
		line-height: 1.5;
		color: var(--ink);
	}

	.trades,
	footer ol {
		margin: 0 0 18px;
		padding: 0;
		list-style: none;
	}

	.trades li {
		padding: 12px 0;
		border-top: 1px solid var(--border);
		font-size: clamp(16px, 1.5vw, 18px);
		line-height: 1.55;
		color: rgba(20, 18, 16, 0.86);
	}

	.trades li:last-child {
		border-bottom: 1px solid var(--border);
	}

	.trades strong {
		color: var(--ink);
	}

	footer {
		margin-top: 36px;
		padding-top: 18px;
		border-top: 1px solid var(--border);
	}

	.sources-label {
		margin-bottom: 8px;
		font-family: 'Space Mono', monospace;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	footer li {
		font-size: 14px;
		line-height: 1.5;
		color: rgba(20, 18, 16, 0.78);
	}

	footer a {
		color: var(--accent);
	}

	@media (max-width: 720px) {
		.thesis {
			padding: calc(var(--header-height, 88px) + 32px) 20px 64px;
		}

		.brains,
		.units {
			grid-template-columns: 1fr;
		}

		section {
			padding-top: 36px;
		}
	}
</style>
