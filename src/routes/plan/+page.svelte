<svelte:head>
	<title>StarForge Robotics Investor Memo - Starforge</title>
	<meta
		name="description"
		content="StarForge Robotics Investor Memo: why general-purpose humanoid robots have stayed out of reach, and how StarForge closes the cost and data gaps."
	/>
</svelte:head>

<div class="scan" aria-hidden="true"></div>

<article class="thesis">
	<section>
		<p>
			Computers and machines enabled us to transform energy into massive productive output.
			General-purpose humanoid robots will take this a step further, they will combine both
			<strong>physical and digital intelligence</strong> to convert energy into productive output at
			an entirely new scale. Factories, warehouses and construction sites operating fully
			autonomously will be common by 2035. Humans will never need to do labour work again.
			Harnessing energy will be the only constraint in that era.
		</p>
	</section>

	<section>
		<h2>StarForge robots operates in two worlds</h2>
		<p>
			A warehouse robot shouldn't only pick a box. It should understand what it picked, update the
			inventory database, reconcile stock levels, trigger a replenishment workflow, flag anomalies,
			and coordinate with the software that runs the warehouse. A construction robot shouldn't only
			drill, lift, or install. It should understand the drawings, track progress against the plan,
			calculate material requirements, document what was completed, and coordinate the next task.
		</p>
		<p>
			A starforge humanoid robot would be equivalent to an ultra human with almost infinite context
			size. Imagine it to be equivalent to an operational manager who gets $10,000 per month, who
			performs hands-on tasks across warehouses or factories. But this ultra human instead of just
			8 hours a day remains operational for the entire 24 hours.
		</p>
		<p class="emphasis">
			We see Starforge robots producing 10x the output at the cost of a $3000 per month worker.
		</p>
	</section>

	<section>
		<h2>Why has no one in the industry solved this yet?</h2>
		<p>There are two major reasons for it.</p>

		<h3>1. No one wants to absorb the burden of high BOM costs.</h3>
		<p>
			Through our unique design technique, we have built the lowest-cost general purpose humanoid
			robot in the industry. We have <strong>eliminated the high end GPUs</strong> inside robots by
			dividing intelligence into an <strong>edge and a cloud model.</strong>
		</p>
		<div class="brains">
			<div>
				<span class="kicker">Edge</span>
				<p>
					Edge model handles the things that must happen locally and immediately: inverse
					kinematics, motion correction, sensor processing, actuator control, and other
					latency-sensitive functions.
				</p>
			</div>
			<div>
				<span class="kicker">Cloud</span>
				<p>
					Cloud models handle things that benefit from much larger models: visual understanding,
					reasoning, planning, memory, domain expertise, enterprise-software interaction, and
					task-level intelligence.
				</p>
			</div>
		</div>
		<p>
			This breakdown aligns where the robotics industry is heading towards. Physical Intelligence
			has also <a href="https://www.youtube.com/watch?v=pzolgvyWEFY">hinted</a> at moving up one
			order of magnitude for model parameter count, scaling to high double-digit billions. While
			they haven't quite gotten there yet, we see evidence with their latest π0.7 VLA's use of a 14B
			world model for subgoal image prediction. It is inevitable that model size will reach a
			certain 'escape velocity' at which it will be out of reach for on-board GPUs and only cloud
			inference will be the only feasible choice.
		</p>
		<p>
			On top of that, we <strong>designed our actuators in-house</strong>, giving us the flexibility
			to optimize them for virtually any torque, form factor, or size requirement.
		</p>
		<p>
			The <strong>actuation system is normally the biggest cost center</strong>, often representing
			roughly 40–55% of total hardware cost. A useful public benchmark is Unitree's G1. It has about
			23–43 joint motors, weighs about 35 kg, includes a depth camera and 3D LiDAR, and starts at
			$13,500 retail. That strongly suggests that aggressively vertically integrated manufacturers
			can drive the underlying BOM well below the traditional $20k-$50k range.
		</p>
		<p>
			We don't have any dependency on Chinese suppliers or a specific supplier for our robot
			components. The robot hands are also inhouse developed. We see the
			<strong>Robot as a Service to be the successful business model that aligns with the human
				hourly wage model</strong>. We have designed our robots specifically to solve the
			ownership, security, tracking, and asset-protection challenges that arise when they are
			deployed at scale under rental and RaaS models.
		</p>

		<h3>2. Absence of real world contact based skill data</h3>
		<p>
			The Internet has no contact based skill data. Foundation models such as Qwen 3.8 27B vision
			language models are open source and increasingly commoditized. In robotics the real scaling
			advantage now comes from contact based skill data, the data used to post-train the flow based
			action expert layered on top of vision language models.
		</p>
		<p class="emphasis">
			As a result, general-purpose robotics has become a labor-arbitrage problem: whoever can
			collect high-quality contact based skill data at scale can train larger robot capabilities and
			therefore scale deployments. The company that will have the best general purpose robotics
			model shall win the industry, Tesla, Figure AI and Physical Intelligence are still behind.
		</p>
	</section>

	<section>
		<h2>The cloud-edge models naturally extends to autonomous factories</h2>
		<p>
			Multiple robots working together will form the foundation of autonomous factories and
			warehouses. Our cloud-edge architecture naturally extends to multi-robot coordination through
			a central vision-language model that acts as a shared coordination brain for the entire
			fleet.
		</p>
		<p>
			In that setup each humanoid robot continuously sends observation tokens together with
			metadata such as robot identity, location and task status to both, a central vision-language
			model and the respective cloud model. The central model maintains a global understanding of
			the environment and the state of every connected robot, allowing it to coordinate tasks,
			resolve conflicts, allocate work, and generate fleet-level plans.
		</p>
	</section>

	<section>
		<h2>How we'll win the industry</h2>
		<p>1. Largest tactile skill data</p>
		<p>2. Patented technologies that makes robots 10x intelligent</p>
		<p>
			We have 30+ full-time creators internally and a growing network of data collection partners
			across India, collecting high-quality skill data using our
			<strong>patent pending stereo vision glasses and tactile gloves</strong> that minimizes the
			data collection hours for skill activity approximately 10 fold. This data is used to build
			robot intelligence models, which are then hosted and served through our cloud infrastructure.
		</p>
		<p>
			Our Gloves and Glasses patent specifies
			<strong>synchronized contact based skill data collection</strong>, one cannot use any random
			stereo camera with random sensor gloves, both the glove and stereo vision data has to be in
			sync. The economics of the general purpose robot intelligence model works only in low labor
			cost countries. Our combination of gloves and glasses enables data collection that is highly
			scalable in regions like India.
		</p>
		<p>
			Another patent-pending technology enables
			<strong>high-frequency tactile and force responses locally while preserving the intelligence
				of large cloud models</strong>.
		</p>
		<p>
			General-purpose humanoid robots must learn to manipulate an enormous variety of objects,
			making tactile intelligence difficult to scale entirely on the edge model. Our architecture
			keeps the large multimodal model in the cloud and sends a compressed scene identifier to the
			robot. The edge model then combines this context with live tactile and force feedback to
			recursively generate actions and make trajectory corrections in real time. This allows the
			edge model to operate at much higher frequency, around 200 Hz, while the cloud model runs at a
			significantly lower frequency, combining cloud-scale intelligence with fast local physical
			response.
		</p>
		<p>
			Key players such as Figure and Tesla have not emphasized cloud-based robot intelligence as a
			core part of their architectures. Figure uses a multi-system approach, but all its
			intelligence stack is designed to run locally on the robot. This creates a scaling limitation,
			since increasingly large foundation models are more practical to scale in the cloud than
			onboard each robot.
		</p>
		<p>
			Platforms such as Physical Intelligence and Google Gemini Robotics are moving toward
			cloud-hosted VLA models with API-based access. However, their publicly described systems do
			not address the high-frequency tactile and force-control problem in the same way. Our
			patent-pending architecture specifically bridges this gap by combining cloud-scale
			intelligence with an edge model that handles tactile, force, slip, and contact responses
			locally.
		</p>
	</section>

	<section>
		<h2>About the founder</h2>
		<p>
			Founder Vipul previously built the Cypherock hardware wallet that currently secures 600M+
			Crypto Assets globally. Cypherock is the highest rated hardware wallet by Coin Bureau. The
			broader StarForge team includes former Cypherock engineers, talent from IIIT Delhi and PayPal,
			and a PhD research advisor from AIST Japan.
		</p>
	</section>

	<section>
		<h2>Where are we today?</h2>
		<p>StarForge Robotics is raising a seed round to scale the team and build the best intelligence model.</p>
		<p>Web: <a href="http://starforgerobotics.com">Starforgerobotics.com</a></p>
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
