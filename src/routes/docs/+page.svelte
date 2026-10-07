<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Developer Documentation - Buildo | STARFORGE</title>
	<meta
		name="description"
		content="Developer documentation for Buildo: hardware specifications, ROS 2 integration, the complete API and SDK reference, and safety systems."
	/>
</svelte:head>

<header class="docs-hero">
	<div class="docs-hero-inner">
		<span class="hero-tag">developer documentation</span>
		<h1 class="docs-hero-title">Build on Buildo</h1>
		<p class="docs-hero-sub">
			Everything you need to bring up ROS 2 on Buildo and program against it directly: hardware
			specifications, bringup and integration guides, the full topic/service/action reference, and
			the safety systems you should know about before you send your first command.
		</p>
	</div>
</header>

<div class="docs-layout">
	<div class="docs-content">
		<h2 id="sections">Documentation</h2>
		<p>
			New to Buildo? Start with Quickstart &mdash; it gets a command you wrote running in under ten
			minutes. Bringing up a full workspace instead? Go straight to ROS 2 Integration. Already
			running and just need the interface list? API &amp; SDK Reference has it.
		</p>

		<div class="docs-cards">
			<a class="docs-card" href={resolve('/docs/quickstart')}>
				<span class="docs-card-num">01 &middot; Start here</span>
				<div class="docs-card-title">Quickstart</div>
				<p class="docs-card-desc">
					Connect with the SDK, read joint state, and command your first grasp &mdash; ten minutes,
					one script.
				</p>
			</a>
			<a class="docs-card" href={resolve('/docs/ros2-integration')}>
				<span class="docs-card-num">02 &middot; Integration</span>
				<div class="docs-card-title">ROS 2 Integration</div>
				<p class="docs-card-desc">
					Supported distros, workspace setup, the node graph, coordinate frames, manipulation,
					navigation, and simulation.
				</p>
			</a>
			<a class="docs-card" href={resolve('/docs/api-reference')}>
				<span class="docs-card-num">03 &middot; Reference</span>
				<div class="docs-card-title">API &amp; SDK Reference</div>
				<p class="docs-card-desc">
					Every topic, service, and action Buildo exposes, with message definitions and both Python
					and C++ examples.
				</p>
			</a>
			<a class="docs-card" href={resolve('/docs/safety-support')}>
				<span class="docs-card-num">04 &middot; Operations</span>
				<div class="docs-card-title">Safety &amp; Support</div>
				<p class="docs-card-desc">
					Torque limiting, diagnostics, firmware updates, and how to reach us.
				</p>
			</a>
		</div>

		<p>
			Something not working the way you expect? <a href={resolve('/docs/faq')}
				>FAQ &amp; Troubleshooting</a
			> covers the connectivity, motion, and firmware issues developers hit most often.
		</p>

		<h2 id="start">Getting started</h2>
		<ol>
			<li>
				<strong>Charge and power on.</strong> Seat the hot-swap battery. The display shows boot status;
				a steady ring on the base means the robot is up and every actuator is responding.
			</li>
			<li>
				<strong>Connect.</strong> Buildo advertises a Wi-Fi access point on first boot, or join it
				to your network from the setup page at
				<code>http://buildo.local:8080</code>. SSH and the ROS 2 graph are reachable once it's on
				your LAN.
			</li>
			<li>
				<strong>Set your DDS domain.</strong> Each unit ships on <code>ROS_DOMAIN_ID=0</code> &mdash;
				change it before running more than one Buildo on the same network.
			</li>
			<li>
				<strong>Check it's alive from your workstation:</strong>
				<pre><code
						>ros2 topic echo /buildo/joint_states --once
ros2 node list | grep buildo</code
					></pre>
			</li>
			<li>
				<strong>Write your first command.</strong> Command a grasp in ten minutes &mdash; see
				<a href={resolve('/docs/quickstart')}>Quickstart</a>. To bring up the
				full workspace instead, see
				<a href={resolve('/docs/ros2-integration')}>ROS 2 Integration</a>.
			</li>
		</ol>

		<div class="docs-callout">
			<span class="docs-callout-kicker">Note</span>
			<p>
				Factory default control mode is <code>STANDBY</code>. Actuators are backdrivable but won't
				accept motion commands until you call <code>/buildo/set_control_mode</code> &mdash; nothing moves
				on a cold boot until you ask it to.
			</p>
		</div>
	</div>

	<nav class="docs-toc" aria-label="On this page">
		<span class="docs-toc-label">On this page</span>
		<a href="#sections">Documentation</a>
		<a href="#start">Getting started</a>
	</nav>
</div>
