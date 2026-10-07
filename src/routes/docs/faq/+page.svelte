<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>FAQ &amp; Troubleshooting - Buildo Developer Documentation | STARFORGE</title>
	<meta
		name="description"
		content="Answers to the connectivity, motion, simulation, and firmware questions developers hit most often when integrating with Buildo."
	/>
</svelte:head>

<header class="docs-hero">
	<div class="docs-hero-inner">
		<span class="hero-tag">faq &amp; troubleshooting</span>
		<h1 class="docs-hero-title">FAQ &amp; Troubleshooting</h1>
		<p class="docs-hero-sub">
			The questions we hear most from new integrators, grouped by what's actually going wrong. Each
			one links back to the full explanation elsewhere in the docs.
		</p>
	</div>
</header>

<div class="docs-layout">
	<div class="docs-content">
		<h2 id="connectivity">Connectivity</h2>

		<h3>I can't see any /buildo topics from my workstation</h3>
		<p>
			Almost always a domain or network mismatch. Check, in order: your workstation's
			<code>ROS_DOMAIN_ID</code> matches the robot's (<code>echo $ROS_DOMAIN_ID</code> on both),
			you're on the same subnet as the robot, and the network isn't blocking DDS multicast &mdash;
			corporate and guest Wi-Fi are the most common culprits, a direct Ethernet link or a simple
			home router are the most reliable.
			<code>ros2 doctor --report</code> flags a domain ID mismatch directly.
		</p>

		<h3>ros2 node list shows the robot's nodes, but a topic won't echo</h3>
		<p>
			Usually a QoS mismatch rather than a connectivity problem &mdash; your subscriber's
			reliability has to match the publisher's. Check the reliability column in the
			<a href={resolve('/docs/api-reference')}>Conventions table</a>; it trips people up most often
			on <code>joint_states</code>, which publishes best-effort.
		</p>

		<h3>Can I run more than one Buildo on the same network?</h3>
		<p>
			Yes &mdash; give each unit its own <code>ROS_DOMAIN_ID</code>. Topics stay under the
			<code>/buildo</code> namespace on every unit, so domain separation (not topic renaming) is
			what keeps them from colliding. See
			<a href={resolve('/docs/ros2-integration')}>Software stack</a>.
		</p>

		<h2 id="motion">Motion &amp; control</h2>

		<h3>A trajectory goal gets rejected or aborted immediately</h3>
		<p>
			Two usual causes: the goal asks for more torque than the
			<a href={resolve('/docs/ros2-integration')}>per-joint limit</a> allows, in which case the
			hardware interface clamps it before it ever executes; or MoveIt's collision checking rejected
			the plan against the self-collision matrix or the head camera's octomap &mdash; see
			<a href={resolve('/docs/ros2-integration')}>Manipulation: MoveIt 2</a>.
		</p>

		<h2 id="sim">Simulation</h2>

		<h3>My controller works in Gazebo but not on hardware</h3>
		<p>
			Only the <code>ros2_control</code> hardware plugin swaps between simulated and physical
			&mdash; everything above that layer is identical, so this is almost always a controller
			relying on an idealized sensor Gazebo provides that the real camera or encoders don't quite
			match. See <a href={resolve('/docs/ros2-integration')}>Simulation</a> for what each backend is actually
			good for; MuJoCo is the closer match for contact-heavy manipulation testing.
		</p>

		<h2 id="firmware">Firmware &amp; versioning</h2>

		<h3>Do I need to recalibrate after a firmware update?</h3>
		<p>
			Run <code>/buildo/calibrate_arm</code> on any arm whose firmware changed. Updates hold the
			robot in <code>STANDBY</code> and won't start mid-motion, but encoder calibration isn't
			guaranteed to survive every firmware revision &mdash; see
			<a href={resolve('/docs/safety-support')}>Firmware updates</a>.
		</p>

		<h3>Which ROS 2 distro should I run?</h3>
		<p>
			Jazzy Jalisco for a new deployment &mdash; it's what we test against first. Humble Hawksbill
			if you need to match an existing fleet on the LTS release; both are fully supported. See
			<a href={resolve('/docs/ros2-integration')}>Software stack</a>.
		</p>

		<h2 id="still-stuck">Still stuck?</h2>
		<p>
			Email <a href="mailto:developers@starforgerobotics.com">developers@starforgerobotics.com</a>
			with the output of <code>ros2 doctor --report</code> and your firmware version (<code
				>ros2 run buildo_firmware version</code
			>) &mdash; see
			<a href={resolve('/docs/safety-support')}>Support &amp; resources</a> for everything else we ask
			for.
		</p>
	</div>

	<nav class="docs-toc" aria-label="On this page">
		<span class="docs-toc-label">On this page</span>
		<a href="#connectivity">Connectivity</a>
		<a href="#motion">Motion &amp; control</a>
		<a href="#sim">Simulation</a>
		<a href="#firmware">Firmware &amp; versioning</a>
		<a href="#still-stuck">Still stuck?</a>
	</nav>
</div>
