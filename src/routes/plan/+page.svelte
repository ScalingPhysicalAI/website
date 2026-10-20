<svelte:head>
	<title>Master Plan — The Intelligence Economy for Physical AI - Starforge</title>
	<meta
		name="description"
		content="Why general-purpose humanoid robots have stayed out of reach, how a dual-brain architecture and a patent-pending data pipeline close the gap, and how Starforge turns ownership into a Robot as a Service economy."
	/>
</svelte:head>

<div class="scan" aria-hidden="true"></div>

<article class="thesis">
	<header class="head">
		<span class="section-label">Master plan</span>
		<h1>The intelligence economy for <span>physical AI</span></h1>
		<div class="founder">
			<img src="/assets/team/vipul-thesis.jpg" alt="Vipul Saini" />
			<div>
				<p class="founder-name">Vipul Saini</p>
				<p class="founder-role">Founder</p>
			</div>
		</div>
		<p class="dek">
			Why general-purpose humanoid robots have stayed out of reach, how we closed the cost and data
			gaps, and how we're turning ownership into a Robot as a Service economy.
		</p>
	</header>

	<section>
		<h2>Robots will work in two worlds</h2>
		<p>
			Computers and machines enabled us to transform energy into massive productive output.
			General-purpose humanoid robots will take this a step further: they will combine both
			physical and digital intelligence to convert energy into productive output at an entirely new
			scale.
		</p>
		<p>
			Factories, warehouses, and construction sites operating fully autonomously will be a common
			thing. Humans will never need to do labor work again. Even tasks at home, like laundry and
			cleaning, will be taken over by home robots. Harnessing energy will be the only constraint in
			that era.
		</p>
		<p>
			At Starforge, we are building this future by developing humanoid robots that work in two
			worlds.
		</p>
		<p>
			A warehouse robot wouldn't just pick a box. It would understand what it picked, update the
			inventory database, reconcile stock levels, trigger a replenishment workflow, flag anomalies,
			and coordinate with the software that runs the warehouse.
		</p>
		<p>
			A construction robot wouldn't only drill, lift, or install. It would understand the drawings,
			track progress against the plan, calculate material requirements, document what was
			completed, and coordinate the next task.
		</p>
	</section>

	<section>
		<h2>An ultra human, working around the clock</h2>
		<p>
			A Starforge humanoid robot is the equivalent of an ultra human with an almost infinite
			context size. Picture a manager who earns $10,000 a month and also performs hands-on work
			across warehouses and factories, except this ultra human doesn't stop after 8 hours. It can
			remain operational for all 24.
		</p>
		<p class="emphasis">
			We see Starforge robots producing 10x the output at the cost of a $3,000-a-month worker.
		</p>
	</section>

	<section>
		<h2>Why this hasn't been solved — and how we solved it</h2>
		<p>General-purpose humanoid robots have stayed out of reach for two reasons: cost and data.</p>

		<h3>1. The bill of materials is too high</h3>
		<p>
			Through unique design and manufacturing techniques, we've built the lowest-cost
			general-purpose humanoid robot in the industry.
		</p>
		<p>
			We've eliminated the need for high-end GPUs inside the robot by dividing intelligence into
			edge and cloud models.
		</p>
		<div class="brains">
			<div>
				<span class="kicker">Edge</span>
				<h3>What must happen locally</h3>
				<p>
					Motion correction, inverse kinematics, sensor processing, actuator control, and other
					latency-sensitive functions.
				</p>
			</div>
			<div>
				<span class="kicker">Cloud</span>
				<h3>What benefits from scale</h3>
				<p>
					Visual understanding, reasoning, planning, memory, domain expertise,
					enterprise-software interaction, and task-level intelligence.
				</p>
			</div>
		</div>
		<p>
			That split is where the robotics industry is heading. Physical Intelligence has hinted at
			moving up an order of magnitude in model size, toward high double-digit billions of
			parameters. They haven't quite gotten there yet, but we see early evidence in their latest
			π0.7 VLA, which uses a 14-billion-parameter world model for subgoal image prediction. Model
			size is converging on an escape velocity, past which it is out of reach for on-board compute
			and cloud inference becomes the only feasible choice.
		</p>
		<p>
			On top of that, we design our own actuators, so we can build for any torque and size
			requirement. The actuation system is normally the biggest cost center, often representing
			roughly 40–55% of total hardware cost. A useful public benchmark is Unitree's G1: about
			23–43 joint motors, roughly 35 kg, a depth camera and 3D LiDAR, starting at $13,500 retail.
			That strongly suggests aggressively vertically integrated manufacturers can drive the
			underlying BOM well below the traditional $20,000–$50,000 range.
		</p>

		<figure class="figure">
			<img
				src="/assets/bom-cost-breakdown.png"
				alt="Sankey diagram of an indicative ~$21,900 bill of materials for a full-size industrial humanoid with onboard compute for an 8B-parameter model, breaking the cost down into actuators and drivetrain (41%), onboard compute, mechanical structure, hands and end effectors, battery and power, sensors and perception, control electronics, wiring, thermal management, and assembly."
			/>
			<figcaption>
				Indicative BOM breakdown for a full-size industrial humanoid, 1K–10K units/year.
			</figcaption>
		</figure>

		<p>
			We don't depend on Chinese suppliers, or any single supplier, for our robot. The hands are
			developed in-house too.
		</p>
		<p>
			We see Robot as a Service as the business model that aligns with how human labor is already
			priced, by the hour. We've designed our robots specifically to solve the ownership, security,
			tracking, and asset-protection challenges that come with deploying them at scale under rental
			and RaaS models, which gives us an advantage in enabling distributed RaaS infrastructure.
		</p>

		<h3>2. The absence of real-world physical contact data</h3>
		<p>
			Frontier foundation models like the Qwen vision-language models are open source and
			increasingly commoditized. In robotics, the real scaling advantage now comes from
			contact-based physical skill data, the data used to post-train the flow-based action expert
			layered on top of these vision-language models. The internet has no such skill data.
		</p>
		<p class="emphasis">
			As a result, general-purpose robotics has become a labor-arbitrage problem: whoever can
			collect high-quality physical-world skill data at scale can train larger robot capabilities,
			and therefore scale deployments.
		</p>
	</section>

	<section>
		<h2>How we'll win the industry</h2>

		<h3>1. Scale skill data collection in India</h3>
		<p>
			We currently have 40 full-time creators internally, and a growing network of creators across
			India, collecting high-quality skill data using our patent-pending egocentric video glasses
			and tactile gloves. That cuts the data-collection hours for a given skill by roughly 10x.
			This data is used to build the robot intelligence models we host and serve through our cloud
			infrastructure.
		</p>
		<p>
			Our gloves-and-glasses patent specifies synchronized data collection: you can't pair a
			random stereo camera with random sensor gloves, the glove and stereo-vision data have to be
			in sync. The combination lets us scale data collection in regions like India, keeping the
			cost of model development to a minimum.
		</p>

		<h3>2. Patents that make robots 10x more intelligent</h3>
		<p>
			Another patent-pending technology addresses a critical challenge in the cloud-edge robotics
			model: enabling high-frequency tactile and force responses locally while preserving the
			intelligence of large cloud models.
		</p>
		<p>
			General-purpose humanoid robots have to learn to manipulate an enormous variety of objects,
			which makes tactile intelligence difficult to scale entirely on-device. Our architecture
			keeps the large multimodal model in the cloud and sends a compressed scene identifier to the
			robot. The edge model combines that context with live tactile and force feedback to
			recursively generate actions and make trajectory corrections in real time. That lets the edge
			model run at a much higher frequency, around 200 Hz, while the cloud model runs at a
			significantly lower frequency, combining cloud-scale intelligence with fast local physical
			response.
		</p>
		<p>
			Key players like Figure and Tesla haven't emphasized cloud-based robot intelligence as a core
			part of their architectures. Figure uses a multi-system approach, but its entire intelligence
			stack is designed to run locally on the robot, a scaling limitation, since increasingly large
			foundation models are more practical to scale in the cloud than onboard each robot.
		</p>
		<p>
			Platforms like Physical Intelligence and Google Gemini Robotics are moving toward
			cloud-hosted VLA models with API-based access, but their publicly described systems don't
			address the high-frequency tactile and force-control problem the same way. Our
			patent-pending architecture bridges that gap by combining cloud-scale intelligence with an
			edge model that handles tactile, force, slip, and contact responses locally.
		</p>
	</section>

	<section>
		<h2>About the founder</h2>
		<p>
			Vipul built the Cypherock hardware wallet, which currently secures more than $600M in crypto
			assets globally. Cypherock is the highest-rated hardware wallet by Coin Bureau. Ex-Cypherock
			team members on Starforge come from IIIT Delhi and PayPal.
		</p>
	</section>

	<section>
		<h2>Where we are today</h2>
		<p>Starforge is raising a seed round to scale our team and deployments.</p>
		<p>
			We've built a novel distributed Robot as a Service model where robot ownership can be
			transferred and tracked on a public record. In our model, the robot owner gets 30% of the
			inference revenue, which incentivizes anyone to deploy a robot.
		</p>
	</section>
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

	.figure {
		margin: 4px 0 26px;
	}

	.figure img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--border);
		border-radius: 2px;
	}

	.figure figcaption {
		margin-top: 10px;
		font-family: 'Space Mono', monospace;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
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

	.brains {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
		margin: 8px 0 22px;
	}

	.brains > div {
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
		margin: 24px 0 8px;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 26px;
		font-weight: 400;
		letter-spacing: 0.04em;
		line-height: 1;
		color: var(--ink);
	}

	.brains h3 {
		margin: 8px 0 8px;
	}

	@media (max-width: 720px) {
		.thesis {
			padding: calc(var(--header-height, 88px) + 32px) 20px 64px;
		}

		.brains {
			grid-template-columns: 1fr;
		}

		section {
			padding-top: 36px;
		}
	}
</style>
