<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>ROS 2 Integration - Buildo Developer Documentation | STARFORGE</title>
	<meta
		name="description"
		content="How to bring up ROS 2 on Buildo: supported distros, workspace setup, the node graph, actuator control, manipulation, navigation, and simulation."
	/>
</svelte:head>

<header class="docs-hero">
	<div class="docs-hero-inner">
		<span class="hero-tag">ros 2 integration</span>
		<h1 class="docs-hero-title">ROS 2 Integration</h1>
		<p class="docs-hero-sub">
			Buildo exposes its entire manipulation, navigation, and sensing surface through ROS 2 &mdash;
			no proprietary middleware to learn. This page covers bringup, from a first workspace build to
			a full simulated robot.
		</p>
	</div>
</header>

<div class="docs-layout">
	<div class="docs-content">
		<h2 id="stack">Software stack</h2>
		<p>
			<strong>Supported:</strong> ROS 2 Jazzy Jalisco (recommended) on Ubuntu 24.04, or Humble
			Hawksbill (LTS) on Ubuntu 22.04. The default RMW is Fast DDS; CycloneDDS is supported and
			swappable via
			<code>RMW_IMPLEMENTATION</code> if you're standardizing on it across a fleet. Everything ships
			as ordinary colcon packages &mdash; no forked <code>rclcpp</code>/<code>rclpy</code>.
		</p>
		<p>
			Every Buildo node lives under the <code>/buildo</code> namespace, so multiple units can share
			a network without topic collisions (still set a distinct <code>ROS_DOMAIN_ID</code> per unit).
		</p>

		<div class="docs-table-wrap">
			<table>
				<thead>
					<tr>
						<th>Node</th>
						<th>Package</th>
						<th>Purpose</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>buildo_hardware_interface</code></td>
						<td><code>buildo_ros2_control</code></td>
						<td>Owns the actuator bus, exposes command/state interfaces to the rest of the stack</td
						>
					</tr>
					<tr>
						<td><code>controller_manager</code></td>
						<td><code>ros2_control</code></td>
						<td>Spawns and manages the controllers below</td>
					</tr>
					<tr>
						<td><code>joint_state_broadcaster</code></td>
						<td><code>ros2_control</code></td>
						<td>Publishes <code>/buildo/joint_states</code> from the hardware interface</td>
					</tr>
					<tr>
						<td><code>left_arm_controller</code> / <code>right_arm_controller</code></td>
						<td><code>ros2_control</code></td>
						<td><code>JointTrajectoryController</code> per arm</td>
					</tr>
					<tr>
						<td><code>hand_controller</code></td>
						<td><code>buildo_hand</code></td>
						<td>Drives the five-fingered hands, exposes grasp presets</td>
					</tr>
					<tr>
						<td><code>base_controller</code></td>
						<td><code>ros2_control</code></td>
						<td>Differential-drive controller for the wheeled base</td>
					</tr>
					<tr>
						<td><code>move_group</code></td>
						<td><code>moveit_ros_move_group</code></td>
						<td
							>Motion planning for <code>left_arm</code>, <code>right_arm</code>, and
							<code>dual_arm</code></td
						>
					</tr>
					<tr>
						<td>Nav2 stack</td>
						<td><code>nav2_bringup</code></td>
						<td>Localization and navigation for the base</td>
					</tr>
					<tr>
						<td><code>vision_node</code></td>
						<td><code>buildo_perception</code></td>
						<td>Publishes the depth/color streams from the head camera</td>
					</tr>
					<tr>
						<td><code>diagnostics_aggregator</code></td>
						<td><code>buildo_diagnostics</code></td>
						<td>Rolls up per-actuator health into <code>/buildo/diagnostics</code></td>
					</tr>
				</tbody>
			</table>
		</div>

		<h2 id="description">Robot description</h2>
		<p>
			<code>buildo_description</code> holds the URDF/xacro source;
			<code>ros2 launch buildo_description view.launch.py</code>
			opens it in RViz on its own, no hardware required.
		</p>

		<pre><code
				>buildo_description/urdf/
├── buildo.urdf.xacro        # top-level: includes everything below
├── base/
│   └── wheeled_base.xacro   # chassis, 2 drive wheels, casters, IMU mount
├── arms/
│   └── buildo_arm.xacro     # macro, instantiated twice: prefix="left_"/"right_"
├── hands/
│   └── buildo_hand.xacro    # 5-finger end effector macro
└── sensors/
    └── head_camera.xacro    # binocular depth camera mount</code
			></pre>

		<p>
			Joint names follow <code>&lt;side&gt;_&lt;joint&gt;</code>
			(e.g. <code>left_shoulder_pitch</code>, <code>right_wrist_roll</code>). The base contributes
			<code>left_wheel_joint</code> / <code>right_wheel_joint</code> (continuous) and a fixed
			<code>base_to_torso</code> joint. Per-joint bus IDs, gear ratios, and torque limits used by
			the
			<code>ros2_control</code> hardware interface are declared as <code>&lt;ros2_control&gt;</code>
			tags inside each xacro, not hardcoded in the driver &mdash; reconfiguring for a non-standard build
			means editing XML, not recompiling.
		</p>

		<h2 id="frames">Coordinate frames</h2>
		<p>
			The TF tree follows the standard mobile-manipulator shape: a localization chain down to the
			base, and a static kinematic chain from the base out to each end effector.
		</p>

		<pre><code
				>map
└── odom
    └── base_link
        └── torso_link
            ├── left_arm_base_link → … → left_wrist_roll_link → left_hand_tcp
            ├── right_arm_base_link → … → right_wrist_roll_link → right_hand_tcp
            └── head_camera_link → head_camera_optical_frame</code
			></pre>

		<div class="docs-table-wrap">
			<table>
				<thead>
					<tr>
						<th>Frame</th>
						<th>Published by</th>
						<th>Notes</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>map</code> &rarr; <code>odom</code></td>
						<td><code>amcl</code> or <code>slam_toolbox</code></td>
						<td>Only present once Nav2 localization is running; absent on a bare arm bringup</td>
					</tr>
					<tr>
						<td><code>odom</code> &rarr; <code>base_link</code></td>
						<td><code>base_controller</code></td>
						<td
							>Wheel-encoder odometry; drifts over distance, corrected above by <code>map</code></td
						>
					</tr>
					<tr>
						<td><code>base_link</code> &rarr; everything else</td>
						<td><code>robot_state_publisher</code></td>
						<td
							>Driven by <code>/buildo/joint_states</code> against the URDF in
							<code>buildo_description</code></td
						>
					</tr>
					<tr>
						<td><code>left_hand_tcp</code> / <code>right_hand_tcp</code></td>
						<td><code>robot_state_publisher</code></td>
						<td
							>The frame MoveIt plans to and the <code>Grasp</code> action closes its force loop against</td
						>
					</tr>
					<tr>
						<td><code>head_camera_optical_frame</code></td>
						<td><code>robot_state_publisher</code></td>
						<td
							>Optical convention (Z forward); depth and color images are both published in this
							frame</td
						>
					</tr>
				</tbody>
			</table>
		</div>

		<p>
			If you only brought up <code>use_nav2:=false</code>, the <code>map</code> and
			<code>odom</code> frames simply won't exist &mdash; everything from <code>base_link</code> up
			is published by <code>robot_state_publisher</code> regardless, so arm planning and TF lookups for
			manipulation work the same with or without navigation running.
		</p>

		<h2 id="control">Actuator control</h2>
		<p>
			Every joint &mdash; arm and wheel alike &mdash; is a quasi-direct-drive actuator on a shared
			CAN bus (1 Mbps, extended frame). <code>buildo_ros2_control</code> is a
			<code>ros2_control</code>
			<code>SystemInterface</code> plugin, so standard tooling (<code
				>ros2 control list_hardware_interfaces</code
			>, <code>controller_manager</code> spawners) works unmodified.
		</p>

		<p>
			<strong>Command interfaces per joint:</strong> <code>position</code>, <code>velocity</code>,
			<code>effort</code> &mdash; selected per-controller, not per-robot; the arm controllers run position
			mode, the base controller runs velocity mode.
		</p>
		<p>
			<strong>State interfaces per joint:</strong> <code>position</code>, <code>velocity</code>,
			<code>effort</code>, <code>temperature</code>.
		</p>

		<pre><code
				># buildo_bringup/config/controllers.yaml (excerpt)
controller_manager:
  ros__parameters:
    update_rate: 1000  # Hz

left_arm_controller:
  ros__parameters:
    type: joint_trajectory_controller/JointTrajectoryController
    joints: [left_shoulder_pitch, left_shoulder_roll, left_elbow,
             left_wrist_pitch, left_wrist_roll, left_wrist_yaw]
    command_interfaces: [position]
    state_interfaces: [position, velocity, effort]

base_controller:
  ros__parameters:
    type: diff_drive_controller/DiffDriveController
    left_wheel_names: [left_wheel_joint]
    right_wheel_names: [right_wheel_joint]
    command_interfaces: [velocity]</code
			></pre>

		<div class="docs-callout">
			<span class="docs-callout-kicker">Note</span>
			<p>
				Per-joint torque limits (15 N&middot;m rated) are enforced in the hardware interface itself,
				below the controller &mdash; a runaway trajectory command is clamped before it reaches the
				actuator, not just caught in software.
			</p>
		</div>

		<h2 id="moveit">Manipulation: MoveIt 2</h2>
		<p><code>buildo_moveit_config</code> defines three planning groups:</p>

		<div class="docs-table-wrap">
			<table>
				<thead>
					<tr>
						<th>Group</th>
						<th>Joints</th>
						<th>Typical use</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>left_arm</code> / <code>right_arm</code></td>
						<td>One arm, wrist included</td>
						<td>Single-arm pick, point, push</td>
					</tr>
					<tr>
						<td><code>dual_arm</code></td>
						<td>Both arms together</td>
						<td>Bimanual tasks &mdash; lifting, holding while the other hand works</td>
					</tr>
					<tr>
						<td><code>left_hand</code> / <code>right_hand</code></td>
						<td>5-finger end effector</td>
						<td>Grasp pose refinement, in each arm group's end-effector slot</td>
					</tr>
				</tbody>
			</table>
		</div>

		<p>
			Planning defaults to OMPL (RRTConnect), with the Pilz industrial motion planner available for
			Cartesian point-to-point moves where you want a predictable, non-sampled path. Collision
			checking includes a self-collision matrix generated from the URDF plus whatever octomap the
			head camera feeds into <code>move_group</code>'s perception pipeline.
		</p>
		<p>
			From code, this is standard MoveIt: <code>moveit_py</code> or <code>MoveGroupInterface</code>
			in Python/C++ work against the three groups exactly as they would against any other MoveIt-configured
			arm. The one Buildo-specific addition is the grasp action described in
			<a href={resolve('/docs/api-reference')}>API &amp; SDK Reference</a>, which closes the loop
			between a Cartesian approach and the hand's own force-feedback grasp controller.
		</p>

		<h2 id="nav2">Mobile base: Nav2</h2>
		<p>
			The wheeled base runs a stock <code>nav2_bringup</code> stack, configured in
			<code>buildo_nav2_config</code>:
		</p>
		<ul>
			<li>
				<strong>Localization:</strong>
				<code>slam_toolbox</code> for building a map on first deployment in a new space,
				<code>amcl</code> against a saved map thereafter.
			</li>
			<li>
				<strong>Costmaps:</strong> footprint set to the base's physical envelope, not the full humanoid
				height &mdash; the arms are handled by MoveIt's own collision checking, not the nav costmap.
			</li>
			<li>
				<strong>Controller:</strong>
				<code>nav2_regulated_pure_pursuit_controller</code>, tuned for the 1.4 mph top speed and
				two-wheel differential drive.
			</li>
		</ul>

		<pre><code
				># Manual drive
ros2 run teleop_twist_keyboard teleop_twist_keyboard --ros-args -r cmd_vel:=/buildo/cmd_vel</code
			></pre>

		<p>
			Autonomous navigation goals go through the standard <code>/buildo/navigate_to_pose</code>
			action &mdash; send a <code>nav2_msgs/action/NavigateToPose</code> goal with a target frame and
			pose exactly as you would for any Nav2-enabled robot, from the command line, RViz's "Nav2 Goal"
			tool, or an action client in your own node.
		</p>

		<p>
			If you already have Nav2 tooling, RViz panels, or a fleet manager built for a wheeled service
			robot, it works against Buildo's base with no changes beyond pointing it at the
			<code>/buildo</code> namespace.
		</p>

		<h2 id="sim">Simulation</h2>
		<p>Three simulation backends are supported, each suited to a different stage of development:</p>

		<div class="docs-table-wrap">
			<table>
				<thead>
					<tr>
						<th>Backend</th>
						<th>Best for</th>
						<th>Notes</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Gazebo</td>
						<td
							>ROS 2 graph-level testing &mdash; controllers, Nav2, MoveIt against the real node
							graph</td
						>
						<td><code>ros2 launch buildo_bringup buildo.launch.py sim:=gazebo</code></td>
					</tr>
					<tr>
						<td>Isaac Sim</td>
						<td>Large-scale reinforcement learning and policy training</td>
						<td><code>buildo_isaac_sim</code> package</td>
					</tr>
					<tr>
						<td>MuJoCo</td>
						<td>Fast, accurate contact dynamics for manipulation research</td>
						<td><code>buildo_mujoco</code> package, lightest-weight option</td>
					</tr>
				</tbody>
			</table>
		</div>

		<p>
			All three consume the same URDF/xacro from <code>buildo_description</code>, so a controller or
			planning pipeline that works in Gazebo targets the real hardware interface unchanged &mdash;
			only the <code>ros2_control</code> hardware plugin swaps between simulated and physical, everything
			above that layer is identical.
		</p>
	</div>

	<nav class="docs-toc" aria-label="On this page">
		<span class="docs-toc-label">On this page</span>
		<a href="#stack">Software stack</a>
		<a href="#description">Robot description</a>
		<a href="#frames">Coordinate frames</a>
		<a href="#control">Actuator control</a>
		<a href="#moveit">Manipulation</a>
		<a href="#nav2">Mobile base</a>
		<a href="#sim">Simulation</a>
	</nav>
</div>
