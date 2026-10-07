<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Quickstart - Buildo Developer Documentation | STARFORGE</title>
	<meta
		name="description"
		content="From a powered-on Buildo to your first command in under ten minutes: connect with the SDK, read joint state, and command a grasp."
	/>
</svelte:head>

<header class="docs-hero">
	<div class="docs-hero-inner">
		<span class="hero-tag">quickstart</span>
		<h1 class="docs-hero-title">Quickstart</h1>
		<p class="docs-hero-sub">
			From a powered-on robot to a command you wrote yourself, in under ten minutes. This assumes
			Buildo is already on your network &mdash; if it isn't yet, do the bring-up steps in
			<a href={resolve('/docs')}>Overview</a> first.
		</p>
	</div>
</header>

<div class="docs-layout">
	<div class="docs-content">
		<h2 id="prereqs">Before you start</h2>
		<ul>
			<li>
				Buildo is powered on, connected to your network, and you can <code>ping buildo.local</code>.
			</li>
			<li>
				Your workstation's <code>ROS_DOMAIN_ID</code> matches the robot's (factory default is
				<code>0</code>).
			</li>
			<li>
				Python 3.10+ on your workstation. ROS 2 itself is not required for this page &mdash; the SDK
				talks to the robot directly.
			</li>
		</ul>

		<div class="docs-callout docs-callout-warning">
			<span class="docs-callout-kicker">Warning</span>
			<p>
				This walkthrough commands a real grasp. Clear the area around both hands before running the
				second script.
			</p>
		</div>

		<h2 id="connect">Connect and check status</h2>
		<p>Confirm the SDK can reach the robot and see what control tier currently owns motion:</p>
		<pre><code
				>from buildo_sdk import BuildoClient

client = BuildoClient()
print(client.get_system_mode())</code
			></pre>
		<p>Expected output on a freshly booted unit:</p>
		<pre><code>SystemMode(mode='STANDBY', active_tier='system2')</code></pre>
		<p>
			<code>STANDBY</code> means actuators are backdrivable but won't accept motion commands yet
			&mdash; see the note on control modes in
			<a href={resolve('/docs/api-reference')}>API &amp; SDK Reference</a>.
		</p>

		<h2 id="first-motion">Your first motion: a grasp test</h2>
		<p>
			This script hands motion control to your process, reads one joint's position, commands a light
			pinch grasp on the right hand, and hands control back to <code>STANDBY</code> when it's done:
		</p>
		<pre><code
				>from buildo_sdk import BuildoClient

client = BuildoClient()

# Hand off motion control to this process
client.set_control_mode("AUTONOMOUS")

# Read the current right-arm shoulder position
state = client.get_joint_states()
print("right_shoulder_pitch:", state.right_shoulder_pitch.position, "rad")

# Command a light pinch grasp and confirm it closed
result = client.right_hand.grasp(preset="pinch", target_force=2.0)
print("grasp success:", result.success, "final_force:", result.final_force, "N")

# Hand control back when you're done
client.set_control_mode("STANDBY")</code
			></pre>

		<h3>Run it</h3>
		<pre><code>python3 first_grasp.py</code></pre>
		<p>Expected output:</p>
		<pre><code
				>right_shoulder_pitch: -0.042 rad
grasp success=True final_force=2.01 N</code
			></pre>

		<p>
			If <code>grasp success</code> comes back <code>False</code>, check
			<code>/buildo/diagnostics</code> for an <code>ACTUATOR_OVERCURRENT</code> or
			<code>ENCODER_FAULT</code> on the hand &mdash; see the error code table in
			<a href={resolve('/docs/safety-support')}>Safety &amp; Support</a>.
		</p>

		<h2 id="next">Next steps</h2>
		<ul>
			<li>
				<strong><a href={resolve('/docs/ros2-integration')}>ROS 2 Integration</a></strong> &mdash; bring
				up the full stack, drive the base with Nav2, and plan multi-waypoint arm motion with MoveIt 2
				instead of single preset grasps.
			</li>
			<li>
				<strong><a href={resolve('/docs/api-reference')}>API &amp; SDK Reference</a></strong>
				&mdash; every topic, service, and action behind the SDK calls above, plus the raw
				<code>rclpy</code>/<code>rclcpp</code> equivalents if you're not using Python.
			</li>
			<li>
				<strong><a href={resolve('/docs/safety-support')}>Safety &amp; Support</a></strong> &mdash; read
				this before you script anything that runs unattended.
			</li>
			<li>
				<strong><a href={resolve('/docs/faq')}>FAQ &amp; Troubleshooting</a></strong> &mdash; fixes for
				the connectivity and motion issues people hit most often at this stage.
			</li>
		</ul>
	</div>

	<nav class="docs-toc" aria-label="On this page">
		<span class="docs-toc-label">On this page</span>
		<a href="#prereqs">Before you start</a>
		<a href="#connect">Connect and check status</a>
		<a href="#first-motion">Your first motion</a>
		<a href="#next">Next steps</a>
	</nav>
</div>
