<svelte:head>
	<title>API &amp; SDK Reference - Buildo Developer Documentation | STARFORGE</title>
	<meta
		name="description"
		content="The complete Buildo ROS 2 interface: every topic, service, and action, custom message definitions, Python and C++ SDK quickstarts, and parameter reference."
	/>
</svelte:head>

<header class="docs-hero">
	<div class="docs-hero-inner">
		<span class="hero-tag">api &amp; sdk reference</span>
		<h1 class="docs-hero-title">API &amp; SDK Reference</h1>
		<p class="docs-hero-sub">
			The complete topic, service, action, and message surface Buildo exposes over ROS 2 &mdash;
			everything you can subscribe to, call, or command.
		</p>
	</div>
</header>

<div class="docs-layout">
	<div class="docs-content">
		<h2 id="conventions">Conventions</h2>
		<p>
			Every interface lives under the <code>/buildo</code> namespace. Per-arm interfaces are further
			scoped: <code>/buildo/left_arm/...</code>, <code>/buildo/right_arm/...</code>. All custom
			types live in the <code>buildo_msgs</code> package (<code>buildo_msgs/msg</code>,
			<code>/srv</code>,
			<code>/action</code>) &mdash; inspectable on-robot with
			<code>ros2 interface show</code>.
		</p>

		<div class="docs-table-wrap">
			<table>
				<thead>
					<tr>
						<th>Interface kind</th>
						<th>Reliability</th>
						<th>History</th>
						<th>Notes</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>High-rate sensor topics (<code>joint_states</code>, <code>imu/data</code>)</td>
						<td>Best effort</td>
						<td>Keep last 1</td>
						<td>Match this QoS on your subscriber or you won't connect</td>
					</tr>
					<tr>
						<td>Low-rate status topics (<code>battery_state</code>, <code>diagnostics</code>)</td>
						<td>Reliable</td>
						<td>Keep last 1</td>
						<td></td>
					</tr>
					<tr>
						<td>Commands (<code>cmd_vel</code>, trajectory topics)</td>
						<td>Reliable</td>
						<td>Keep last 1</td>
						<td></td>
					</tr>
					<tr>
						<td>Services and actions</td>
						<td>Reliable (RMW default)</td>
						<td>&mdash;</td>
						<td>Standard ROS 2 defaults, nothing custom</td>
					</tr>
				</tbody>
			</table>
		</div>

		<h2 id="topics">Topics</h2>
		<div class="docs-table-wrap">
			<table>
				<thead>
					<tr>
						<th>Topic</th>
						<th>Type</th>
						<th>Direction</th>
						<th>Rate</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>/buildo/joint_states</code></td>
						<td><code>sensor_msgs/JointState</code></td>
						<td>Pub</td>
						<td>200 Hz</td>
						<td>Position, velocity, effort for every arm, hand, and wheel joint</td>
					</tr>
					<tr>
						<td><code>/buildo/cmd_vel</code></td>
						<td><code>geometry_msgs/Twist</code></td>
						<td>Sub</td>
						<td>50 Hz</td>
						<td>Base velocity command</td>
					</tr>
					<tr>
						<td><code>/buildo/odom</code></td>
						<td><code>nav_msgs/Odometry</code></td>
						<td>Pub</td>
						<td>50 Hz</td>
						<td>Base odometry from wheel encoders</td>
					</tr>
					<tr>
						<td><code>/buildo/imu/data</code></td>
						<td><code>sensor_msgs/Imu</code></td>
						<td>Pub</td>
						<td>200 Hz</td>
						<td>Torso IMU</td>
					</tr>
					<tr>
						<td><code>/buildo/battery_state</code></td>
						<td><code>sensor_msgs/BatteryState</code></td>
						<td>Pub</td>
						<td>1 Hz</td>
						<td>Hot-swap battery charge, voltage, health</td>
					</tr>
					<tr>
						<td><code>/buildo/camera/color/image_raw</code></td>
						<td><code>sensor_msgs/Image</code></td>
						<td>Pub</td>
						<td>30 fps</td>
						<td>Head camera, color stream</td>
					</tr>
					<tr>
						<td><code>/buildo/camera/depth/image_raw</code></td>
						<td><code>sensor_msgs/Image</code></td>
						<td>Pub</td>
						<td>30 fps</td>
						<td>Head camera, depth stream (8MP binocular)</td>
					</tr>
					<tr>
						<td><code>/buildo/left_hand/state</code>, <code>/buildo/right_hand/state</code></td>
						<td><code>buildo_msgs/msg/HandState</code></td>
						<td>Pub</td>
						<td>100 Hz</td>
						<td>Per-finger position, velocity, and fingertip force</td>
					</tr>
					<tr>
						<td><code>/buildo/system_mode</code></td>
						<td><code>buildo_msgs/msg/SystemMode</code></td>
						<td>Pub</td>
						<td>On change</td>
						<td>Which control tier currently owns motion</td>
					</tr>
					<tr>
						<td><code>/buildo/diagnostics</code></td>
						<td><code>diagnostic_msgs/DiagnosticArray</code></td>
						<td>Pub</td>
						<td>1 Hz</td>
						<td>Rolled-up per-actuator and per-subsystem health</td>
					</tr>
				</tbody>
			</table>
		</div>

		<p>
			Topics are listed exactly as published &mdash; the <code>/buildo</code> prefix is the robot's
			namespace, not a remap. On a multi-robot network, separate units by <code>ROS_DOMAIN_ID</code> rather
			than renaming topics.
		</p>

		<h2 id="services">Services &amp; actions</h2>
		<h3>Services</h3>
		<div class="docs-table-wrap">
			<table>
				<thead>
					<tr>
						<th>Service</th>
						<th>Type</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>/buildo/set_control_mode</code></td>
						<td><code>buildo_msgs/srv/SetControlMode</code></td>
						<td
							>Switch between <code>STANDBY</code>, <code>TELEOP</code>, <code>AUTONOMOUS</code></td
						>
					</tr>
					<tr>
						<td><code>/buildo/calibrate_arm</code></td>
						<td><code>buildo_msgs/srv/CalibrateArm</code></td>
						<td>Re-home a single arm's joint encoders</td>
					</tr>
					<tr>
						<td><code>/buildo/set_grasp_preset</code></td>
						<td><code>buildo_msgs/srv/SetGraspPreset</code></td>
						<td>Load a named grip profile (force/aperture curve) onto a hand</td>
					</tr>
				</tbody>
			</table>
		</div>

		<h3>Actions</h3>
		<div class="docs-table-wrap">
			<table>
				<thead>
					<tr>
						<th>Action</th>
						<th>Type</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>/buildo/left_arm/follow_joint_trajectory</code>,
							<code>/buildo/right_arm/follow_joint_trajectory</code>
						</td>
						<td><code>control_msgs/action/FollowJointTrajectory</code></td>
						<td
							>Standard <code>ros2_control</code> action &mdash; what MoveIt calls under the hood</td
						>
					</tr>
					<tr>
						<td><code>/buildo/navigate_to_pose</code></td>
						<td><code>nav2_msgs/action/NavigateToPose</code></td>
						<td>Standard Nav2 action for the base</td>
					</tr>
					<tr>
						<td>
							<code>/buildo/left_hand/grasp</code>, <code>/buildo/right_hand/grasp</code>
						</td>
						<td><code>buildo_msgs/action/Grasp</code></td>
						<td>Closed-loop grasp: approach, close to target force, hold</td>
					</tr>
					<tr>
						<td><code>/buildo/execute_skill</code></td>
						<td><code>buildo_msgs/action/ExecuteSkill</code></td>
						<td
							>High-level task handoff (e.g. "pick up the red cup") &mdash; the entry point for
							commanding Buildo by instruction rather than by trajectory</td
						>
					</tr>
				</tbody>
			</table>
		</div>

		<p>
			<code>follow_joint_trajectory</code> and <code>navigate_to_pose</code> are deliberately stock
			ROS 2 types with no Buildo-specific fields &mdash; any MoveIt or Nav2 client code you already
			have targets them unmodified. <code>Grasp</code> and <code>ExecuteSkill</code> are the two places
			the API extends past the ROS 2 standard, because no standard type covers force-closed-loop grasping
			or language-conditioned task execution.
		</p>

		<h2 id="messages">Message definitions</h2>
		<p><code>buildo_msgs/msg/HandState.msg</code></p>
		<pre><code
				>float64[5] finger_position     # radians, per finger
float64[5] finger_velocity     # rad/s
float64[5] fingertip_force     # newtons
std_msgs/Header header</code
			></pre>

		<p><code>buildo_msgs/msg/SystemMode.msg</code></p>
		<pre><code
				>uint8 STANDBY = 0
uint8 TELEOP = 1
uint8 AUTONOMOUS = 2
uint8 mode
string active_tier             # "system2" | "system1" | "system0"</code
			></pre>

		<p><code>buildo_msgs/action/Grasp.action</code></p>
		<pre><code
				># Goal
string preset_name
float64 target_force           # newtons
---
# Result
bool success
float64 final_force
---
# Feedback
float64 current_force</code
			></pre>

		<h2 id="sdk">SDK quickstart</h2>
		<p>
			There's one official SDK, and it's Python. C++ clients talk to the same topics, services, and
			actions directly through <code>rclcpp</code> &mdash; there's no separate C++ convenience layer to
			install.
		</p>

		<h3>Python</h3>
		<p>
			The Buildo SDK is a thin Python convenience layer over <code>rclpy</code> &mdash; every call
			below maps directly to the topics and actions above, so dropping to raw <code>rclpy</code> at any
			point works the same way it would for any ROS 2 node.
		</p>

		<pre><code
				>from buildo_sdk import BuildoClient

client = BuildoClient()
client.set_control_mode("AUTONOMOUS")

# Read joint state
state = client.get_joint_states()
print(state.left_shoulder_pitch.position)

# Command a grasp
result = client.right_hand.grasp(preset="pinch", target_force=4.0)
print(result.success, result.final_force)

# Drive the base
client.drive(linear_x=0.3, angular_z=0.0, duration_s=2.0)

# Hand off a high-level task
client.execute_skill("pick up the red cup")</code
			></pre>

		<h3>C++ (rclcpp)</h3>
		<p>
			The same two calls directly against the generated <code>buildo_msgs</code> bindings &mdash; this
			is the pattern every other call in this reference follows from C++:
		</p>

		<pre><code
				>#include &lt;rclcpp/rclcpp.hpp&gt;
#include &lt;rclcpp_action/rclcpp_action.hpp&gt;
#include "buildo_msgs/srv/set_control_mode.hpp"
#include "buildo_msgs/action/grasp.hpp"

using Grasp = buildo_msgs::action::Grasp;

auto node = rclcpp::Node::make_shared("buildo_client_example");

// Set control mode
auto mode_client = node-&gt;create_client&lt;buildo_msgs::srv::SetControlMode&gt;(
    "/buildo/set_control_mode");
auto mode_req = std::make_shared&lt;buildo_msgs::srv::SetControlMode::Request&gt;();
mode_req-&gt;mode = "AUTONOMOUS";
mode_client-&gt;async_send_request(mode_req);

// Command a grasp
auto grasp_client = rclcpp_action::create_client&lt;Grasp&gt;(node, "/buildo/right_hand/grasp");
Grasp::Goal goal;
goal.preset_name = "pinch";
goal.target_force = 4.0;
grasp_client-&gt;async_send_goal(goal);

rclcpp::spin(node);</code
			></pre>

		<h2 id="params">Parameters &amp; versioning</h2>
		<p><code>buildo_hardware_interface</code> node parameters:</p>
		<div class="docs-table-wrap">
			<table>
				<thead>
					<tr>
						<th>Parameter</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>can_interface</code></td>
						<td>string</td>
						<td><code>can0</code></td>
						<td>Linux SocketCAN interface name</td>
					</tr>
					<tr>
						<td><code>can_bitrate</code></td>
						<td>int</td>
						<td>1000000</td>
						<td>Bus bitrate in bps</td>
					</tr>
					<tr>
						<td><code>joint_torque_limit</code></td>
						<td>double[]</td>
						<td>15.0 per joint</td>
						<td>Firmware-enforced torque clamp, N&middot;m</td>
					</tr>
					<tr>
						<td><code>control_loop_rate_hz</code></td>
						<td>int</td>
						<td>1000</td>
						<td>Hardware interface update rate</td>
					</tr>
				</tbody>
			</table>
		</div>

		<p>
			<code>buildo_msgs</code> follows semantic versioning and is pinned per firmware release
			&mdash; check <code>ros2 pkg xml buildo_msgs</code> against your robot's firmware version before
			upgrading a client in the field. Breaking changes to any interface on this page land in a major
			version bump and a note in the release changelog, never silently.
		</p>
	</div>

	<nav class="docs-toc" aria-label="On this page">
		<span class="docs-toc-label">On this page</span>
		<a href="#conventions">Conventions</a>
		<a href="#topics">Topics</a>
		<a href="#services">Services &amp; actions</a>
		<a href="#messages">Message definitions</a>
		<a href="#sdk">SDK quickstart</a>
		<a href="#params">Parameters &amp; versioning</a>
	</nav>
</div>
