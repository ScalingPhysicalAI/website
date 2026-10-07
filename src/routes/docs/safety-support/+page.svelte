<svelte:head>
	<title>Safety &amp; Support - Buildo Developer Documentation | STARFORGE</title>
	<meta
		name="description"
		content="Buildo's safety systems: torque limiting, watchdogs, diagnostics, firmware updates, and how to reach developer support."
	/>
</svelte:head>

<header class="docs-hero">
	<div class="docs-hero-inner">
		<span class="hero-tag">safety &amp; support</span>
		<h1 class="docs-hero-title">Safety &amp; Support</h1>
		<p class="docs-hero-sub">
			What stops Buildo when something goes wrong, how to read its health before that point, and how
			to reach us when you need to.
		</p>
	</div>
</header>

<div class="docs-layout">
	<div class="docs-content">
		<h2 id="safety">Safety systems</h2>

		<h3>Watchdogs</h3>
		<p>
			If a controller publishing commands goes silent for longer than <code>command_timeout_ms</code>
			(150 ms by default), the hardware interface treats it as a dropped connection and holds the
			robot's last commanded position rather than acting on a stale command. Tune this in
			<code>buildo_bringup/config/controllers.yaml</code> if your control loop runs slower than the default
			assumes &mdash; a timeout set tighter than your actual loop rate will trip on every cycle.
		</p>

		<h3>Torque limiting</h3>
		<p>
			Per-joint torque limits (15 N&middot;m rated) are enforced in the hardware interface itself,
			below the controller. A runaway trajectory command is clamped before it reaches the actuator
			&mdash; this is a hard floor underneath whatever soft limits your own planning stack applies,
			not a substitute for them.
		</p>

		<h3>Collision behavior</h3>
		<p>
			MoveIt's self-collision matrix and the head camera's octomap stop a planned trajectory before
			execution. There is no reactive collision avoidance once a trajectory is already executing
			&mdash; if your application needs that, build it on top of the per-joint effort feedback in
			<code>/buildo/joint_states</code>, which updates at 200 Hz.
		</p>

		<h2 id="diagnostics">Diagnostics</h2>
		<p>
			<code>/buildo/diagnostics</code> rolls up per-actuator and per-subsystem health as a standard
			<code>diagnostic_msgs/DiagnosticArray</code>, so <code>rqt_robot_monitor</code> or any other standard
			ROS 2 diagnostics viewer works against Buildo unmodified.
		</p>

		<div class="docs-table-wrap">
			<table>
				<thead>
					<tr>
						<th>Error code</th>
						<th>Level</th>
						<th>Meaning</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>ACTUATOR_OVERCURRENT</code></td>
						<td>Error</td>
						<td>Joint drew current above its rated limit; actuator disabled until reset</td>
					</tr>
					<tr>
						<td><code>ACTUATOR_OVERTEMP</code></td>
						<td>Warn &rarr; Error</td>
						<td>Winding temperature approaching, then past, its safe limit</td>
					</tr>
					<tr>
						<td><code>ENCODER_FAULT</code></td>
						<td>Error</td>
						<td
							>Position feedback lost or inconsistent &mdash; run <code>/buildo/calibrate_arm</code
							></td
						>
					</tr>
					<tr>
						<td><code>BUS_TIMEOUT</code></td>
						<td>Error</td>
						<td>An actuator stopped responding on the control bus</td>
					</tr>
					<tr>
						<td><code>BATTERY_LOW</code></td>
						<td>Warn</td>
						<td>Charge below 15% &mdash; swap the battery before it reaches 5%</td>
					</tr>
				</tbody>
			</table>
		</div>

		<h2 id="firmware">Firmware updates</h2>
		<p>
			Actuator and base-controller firmware update over the same connection as ROS 2 &mdash; no
			separate cabling or tooling required.
		</p>
		<pre><code
				>ros2 run buildo_firmware update --target all --version latest

# Or a single subsystem
ros2 run buildo_firmware update --target left_arm --version 2.4.1</code
			></pre>
		<p>
			An update holds the robot in <code>STANDBY</code> and refuses to start if any actuator is
			mid-motion. Each unit checks for updates on boot and notifies over
			<code>/buildo/diagnostics</code> when one is available; it never installs automatically.
		</p>

		<h2 id="support">Support &amp; resources</h2>
		<ul>
			<li>
				<strong>Developer support:</strong>
				<a href="mailto:developers@starforgerobotics.com">developers@starforgerobotics.com</a> &mdash;
				integration questions, bug reports, firmware issues.
			</li>
			<li>
				<strong>Sales and fleet orders:</strong>
				<a href="mailto:contact@starforgerobotics.com">contact@starforgerobotics.com</a>
			</li>
			<li>
				<strong>Robot App Store:</strong> browse and publish use-case applications built on this API
				at <a href="https://portal.starforgerobotics.com">portal.starforgerobotics.com</a>.
			</li>
		</ul>
		<p>
			When reporting an integration issue, include the output of <code>ros2 doctor --report</code>
			and the active firmware version (<code>ros2 run buildo_firmware version</code>) &mdash; the
			two things we ask for first.
		</p>
	</div>

	<nav class="docs-toc" aria-label="On this page">
		<span class="docs-toc-label">On this page</span>
		<a href="#safety">Safety systems</a>
		<a href="#diagnostics">Diagnostics</a>
		<a href="#firmware">Firmware updates</a>
		<a href="#support">Support &amp; resources</a>
	</nav>
</div>
