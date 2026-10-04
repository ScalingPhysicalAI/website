<script lang="ts">
	import { onMount } from 'svelte';

	const tex: Record<string, string> = {
		e1: String.raw`A^{\mathrm{cloud}}_{k}=\left\{T^{L*}_{\mathrm{EE}}(\tau),\, T^{R*}_{\mathrm{EE}}(\tau),\, T^{*}_{\mathrm{head}}(\tau),\, C^{*}(\tau)\right\}_{\tau=0}^{H_{k}}`,
		e2: String.raw`\hat{T}(t)=\mathcal{I}(T_{k},T_{k+1},\alpha),\quad \alpha=\frac{t-t_{k}}{t_{k+1}-t_{k}}`,
		e3: String.raw`\dot{q}^{*}=\arg\min_{\dot{q}}\|J_{L}\dot{q}-v^{*}_{L}\|^{2}_{W_{L}}+\|J_{R}\dot{q}-v^{*}_{R}\|^{2}_{W_{R}}+\lambda_{p}\|\dot{q}-\dot{q}_{\mathrm{post}}\|^{2}+\lambda_{r}\|\dot{q}\|^{2}`,
		e5: String.raw`q^{\mathrm{motor}}_{j}=s_{j}\!\left(q^{\mathrm{QP}}_{j}+q^{\mathrm{offset}}_{j}\right),\quad s_{j}\in\{-1,+1\}`,
		e6: String.raw`v^{*}_{\mathrm{EE}}=v^{\mathrm{cloud}}_{\mathrm{EE}}+\mathrm{clip}(\Delta v_{\mathrm{tactile}})`,
		e7: String.raw`T^{W}_{i,t}=T^{W}_{\mathrm{Wrist},t}\, T^{\mathrm{Wrist}}_{i,t}`,
		e8: String.raw`a^{H}_{t}=\left[T^{L}_{w},\, T^{R}_{w},\, P^{L}_{1:5},\, P^{R}_{1:5},\, P_{\mathrm{elbow}},\, c_{t},\, f_{t},\, s_{t}\right]`,
		e9: String.raw`z_{t}=f_{\theta}(I_{t-k:t},\, \ell,\, a^{H}_{t-k:t})`,
		e10: String.raw`q^{*}_{t}=\arg\min_{q}\ \lambda_{p}\sum_{i}\|P^{R}_{i}(q)-\hat{P}^{H}_{i,t}\|^{2}+\lambda_{o}L_{\mathrm{ori}}+\lambda_{c}L_{\mathrm{contact}}+\lambda_{s}L_{\mathrm{smooth}}`,
		e11: String.raw`A_{t:t+H}=g_{\phi}(z_{t},\, q^{R}_{t},\, d_{\mathrm{skill}})`,
		e12: String.raw`A_{\tau}=\tau A+(1-\tau)\epsilon`,
		e13: String.raw`L_{\mathrm{flow}}=\mathbb{E}\left\|v_{\phi}(A_{\tau},\tau,z_{t},q^{R}_{t})-(A-\epsilon)\right\|_{2}^{2}`,
		e14: String.raw`\max_{r_{i}}\sum_{i} w_{i}U_{i}(r_{i})\quad \mathrm{s.t.}\quad \sum_{i} A_{i}r_{i}^{2}\le B_{\mathrm{pix}}`,
		e15: String.raw`\rho_{t}=\mathrm{clip}\!\left(w_{c}C_{t}+w_{u}U_{t}+w_{d}D_{t}+w_{v}(1-V_{t}),\, 0,\, 1\right)`,
		e16: String.raw`H_{t}=H_{\min}+(1-\rho_{t})(H_{\max}-H_{\min})`,
		e17: String.raw`s_{i,t}=\left[p_{i,t},\, \dot{p}_{i,t},\, c_{i,t},\, \sigma_{i,t}\right]`,
		e18: String.raw`L_{\mathrm{match}}=\left\|g_{H}(x^{H})-g_{R}(x^{R})\right\|_{2}^{2}`,
		e19: String.raw`d_{\mathrm{skill}}=E_{\psi}(D_{s})`
	};

	onMount(() => {
		const render = () => {
			const katex = (window as unknown as { katex?: { render: (t: string, el: HTMLElement, o: object) => void } })
				.katex;
			if (!katex) return;
			document.querySelectorAll<HTMLElement>('.eq-tex').forEach((el) => {
				const src = el.dataset.tex;
				if (!src) return;
				katex.render(src, el, { throwOnError: false, displayMode: true });
			});
		};

		if ((window as unknown as { katex?: unknown }).katex) {
			render();
			return;
		}

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css';
		document.head.appendChild(link);

		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js';
		script.onload = render;
		document.head.appendChild(script);
	});
</script>

<svelte:head>
	<title>Two-Rate Hierarchical Vision–Language–Action Architecture for One-Shot Dexterous Skill Adaptation - Starforge</title>
	<meta
		name="description"
		content="TwoRate-VLA separates a cloud vision-language-action model at 20 Hz from a 200 Hz deterministic edge adapter for dexterous robot control."
	/>
	<meta name="robots" content="noindex" />
	<link
		href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<article class="paper">
	<p class="mast">Starforge Robotics &nbsp;·&nbsp; Technical Report &nbsp;·&nbsp; September 2026</p>

	<header class="front">
		<h1>
			Two-Rate Hierarchical Vision–Language–Action Architecture for One-Shot Dexterous Skill
			Adaptation
		</h1>
		<p class="authors">Starforge Robotics</p>
		<p class="affil">September 2026</p>

		<div class="abstract">
			<h2>Abstract</h2>
			<p>
				<strong>Abstract—</strong> Human-level robot intelligence increasingly requires massive multimodal
				models and high-end GPUs. Running such models entirely onboard makes robots expensive and
				power-hungry, constraining how rapidly their intelligence can scale. We present TwoRate-VLA, a
				general-purpose two-rate hierarchical vision–language–action architecture that separates
				frontier-scale semantic reasoning from fast physical execution. A cloud-hosted VLA operates at
				approximately 20 Hz and can scale toward frontier-size multimodal models, while an edge adapter
				executes at 200 Hz. The edge adapter is deterministic rather than a second learned policy: it
				buffers and resamples cloud task-space action chunks, converts left/right end-effector targets
				into robot joint targets with QP-based differential inverse kinematics, incorporates measured
				joint-state feedback, and forwards bounded references to the robot actuators. In the current
				Buildo implementation, this layer is designed around a Broadcom BCM2712-based edge computer,
				Dora dataflow, MuJoCo/Mink kinematics, and direct robot-actuator control without ROS. Human
				demonstrations are captured with synchronized smart glasses and sensor gloves, represented in an
				embodiment-neutral geometric/contact space, retargeted to the target robot, and used to
				post-train a flow-matching MM-DiT action expert. We further introduce four optimizations: an
				edge resolution optimizer, a dynamic action horizon, field-of-view recovery actions, and matched
				glove/robot tactile sensing. Buildo is the current target embodiment, but the cloud VLA and
				human-demonstration pipeline are not tied to a wheeled platform and can be transferred to
				bipedal or other embodiments through embodiment-specific retargeting and edge control.
			</p>
		</div>
	</header>

	<div class="cols">
		<h2><span>1</span> Introduction</h2>
		<p>
			Vision–language–action (VLA) systems increasingly combine large visual-language backbones with
			robot-specific action generators. A second scaling constraint is computational: the strongest
			multimodal models increasingly require GPU resources that are costly, power-hungry, and difficult
			to package onboard a general-purpose robot. We therefore treat cloud inference not merely as
			remote execution, but as a mechanism for decoupling robot intelligence from onboard compute
			limits. The staged training philosophy in Ψ<sub>0</sub> explicitly separates visual-action
			representation learning from embodiment-specific action post-training [1]; our architecture
			adopts this separation and extends it with direct wearable sensing of hand pose, fingertip
			contact, and slip signals.
		</p>
		<p>
			The current target platform is Buildo, a mobile manipulator with two 7-DoF arms, a
			height-adjustable 3-DoF torso, a 2-DoF head, five-finger tactile hands, and a wheeled base. This
			embodiment is used to instantiate and evaluate the architecture, but the VLA itself is
			general-purpose. The two-rate control split uses cloud policy generation at approximately 20 Hz
			and local edge execution at 200 Hz. A bipedal embodiment can reuse the same cloud VLA,
			demonstration representation, skill conditioning, and action-expert training recipe while
			replacing the embodiment-specific retargeter and low-level controller.
		</p>
		<p>
			Our goal is not to directly regress robot motor angles from human finger angles. Instead, we use
			an embodiment-neutral geometric and tactile representation as an intermediate layer. This allows
			the visual-language model to learn what the human is doing, while robot-specific retargeting and
			edge kinematics determine how the target embodiment should execute the behavior.
		</p>
		<p class="contrib">Contributions. We propose:</p>
		<ul>
			<li>
				a staged human-to-robot training pipeline using synchronized glasses/glove demonstrations,
				geometric retargeting, and MM-DiT flow-matching action generation;
			</li>
			<li>
				a 20 Hz cloud-to-200 Hz deterministic edge adapter based on action buffering, Cartesian
				interpolation, QP-based differential IK, measured-state synchronization, and direct actuator
				execution;
			</li>
			<li>
				an edge resolution optimizer, dynamic action horizon, and explicit field-of-view recovery
				policy for cloud inference under changing manipulation risk; and
			</li>
			<li>
				matched glove/robot sensing, aligning tactile semantics between demonstrations and deployment
				to reduce modality mismatch.
			</li>
		</ul>

		<h2><span>2</span> Related Architecture</h2>
		<p>
			<strong>Staged human-to-robot learning.</strong> Ψ<sub>0</sub> argues that human and humanoid data
			should not simply be co-trained because of kinematic disparity; it pre-trains a VLM on egocentric
			human manipulation and post-trains a flow-based action expert on robot trajectories [1]. We adopt
			the same separation: after human-action representation learning, the VLM is frozen and an
			approximately 500M-parameter MM-DiT action expert is post-trained on embodiment-specific robot
			actions.
		</p>
		<p>
			<strong>Vision-language backbone.</strong> Qwen3-VL 27B is used as the proposed multimodal VLM
			backbone [2]. The architecture uses the VLM primarily for visual semantics, temporal task
			understanding, and motion priors rather than direct low-level motor control.
		</p>
		<p>
			<strong>Differential IK and QP control.</strong> Differential kinematics maps end-effector
			velocity objectives to joint velocities through the manipulator Jacobian and is a standard basis
			for resolved-rate robot control [4]. QP formulations extend this idea by supporting redundancy
			resolution, regularization, and inequality constraints such as joint bounds and velocity limits
			[5]. Hierarchical QP methods further organize multiple objectives and constraints by priority and
			have been demonstrated for whole-body humanoid motion generation at control-relevant rates [6].
			Our edge adapter follows this family of methods rather than learning a second neural action
			model. The current software implementation uses Mink, a MuJoCo-based differential IK library with
			task-space objectives and joint/velocity limits [7], through Enactic’s
			<code>dora-openarm-kinematics</code> bimanual QP node [8].
		</p>
		<p>
			<strong>Simulation and deployment.</strong> MuJoCo provides efficient generalized-coordinate
			dynamics and contact simulation suitable for robotics validation [3]. We use the same task-space
			action contract in simulation and on the real robot so that cloud outputs can be tested against
			an identical edge-adapter interface before hardware deployment.
		</p>

		<h2><span>3</span> System Overview</h2>
		<p>
			Figure 1 summarizes the proposed architecture. The system is divided into four representations:
			(1) raw human multimodal sensing, (2) canonical human action state, (3) retargeted robot action
			state, and (4) deployed cloud/edge control.
		</p>

		<figure class="fig fig-wide">
			<div class="flow flow-3">
				<div>
					<p class="flow-kicker">Human demonstration</p>
					<div class="node">
						<strong>Smart glasses</strong>
						<span>Egocentric RGB, 3D wrist and arm, head pose</span>
					</div>
					<div class="node">
						<strong>Sensor gloves</strong>
						<span>Finger and palm IMUs, pressure, contact, slip</span>
					</div>
					<div class="node">
						<strong>Canonical human action</strong>
						<span>Wrist 6D, fingertip XYZ, contact / force / slip</span>
					</div>
				</div>
				<div>
					<p class="flow-kicker">Robot learning</p>
					<div class="node">
						<strong>Retargeting</strong>
						<span>Fingertip geometry, robot IK and limits, contact intent</span>
					</div>
					<div class="node">
						<strong>MM-DiT action expert</strong>
						<span>Flow matching, task-space chunks, one-shot conditioning</span>
					</div>
				</div>
				<div>
					<p class="flow-kicker">Deployment</p>
					<div class="node">
						<strong>Cloud VLA · 20 Hz</strong>
						<span>Future task-space chunk</span>
					</div>
					<div class="node">
						<strong>Edge adapter · 200 Hz</strong>
						<span>Resample, QP IK, actuator execution</span>
					</div>
				</div>
			</div>
			<figcaption>
				<strong>Fig. 1.</strong> End-to-end two-rate architecture. The cloud VLA supplies future
				task-space motion at approximately 20 Hz. The edge adapter converts the cloud chunk into 200 Hz
				robot execution using interpolation, QP-based differential IK, measured-state feedback, and
				direct actuator control.
			</figcaption>
		</figure>

		<h3>3.1 Robot Embodiment</h3>
		<p>
			The current Buildo instantiation uses a 19-DoF articulated body excluding dexterous-hand joints
			and base drive: 14 arm DoF, 3 torso DoF, and 2 head DoF. The platform uses a RealSense
			D435i-class depth camera and a Broadcom BCM2712-based edge computer for local sensor fusion,
			action buffering, kinematics, and networking. The VLA-facing action interface is task-space
			oriented, with left/right wrist trajectories, head/gaze targets, hand/finger targets, contact
			intent, and optional body-motion intent.
		</p>

		<h3>3.2 Two-Rate Control Contract</h3>
		<p>
			The cloud VLA predicts nominal future motion at approximately 20 Hz. Each cloud update therefore
			arrives every 50 ms, while the edge adapter executes every 5 ms. The edge is intentionally not a
			second semantic policy. It accepts the latest timestamped action chunk, constructs a smooth 200
			Hz task-space target, solves the embodiment kinematics, applies bounded local corrections, and
			sends commands to the hardware layer.
		</p>
		<p>Let the cloud output be</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e1}></div>
			<span class="eq-no">(1)</span>
		</div>
		<p>
			where <em>T</em><sup>L*</sup><sub>EE</sub> and <em>T</em><sup>R*</sup><sub>EE</sub> are future
			left/right end-effector poses, <em>T</em>*<sub>head</sub> is a gaze/head target, and
			<em>C</em>* denotes contact intent. The edge resamples this representation to the local control
			period before solving for joint motion.
		</p>

		<h2><span>4</span> Edge Adapter Architecture</h2>
		<p>
			The edge adapter is the embodiment bridge between cloud action generation and physical actuation.
			In the current implementation it is designed to run on a Broadcom BCM2712-based edge computer and
			is composed of four functions: (i) a cloud action receiver and buffer, (ii) a 20-to-200 Hz
			Cartesian resampler, (iii) QP-based differential IK, and (iv) a direct robot-actuator hardware
			interface with measured-state feedback. The components can be wired as independent Dora
			processes; no ROS dependency is required for the arm execution path.
		</p>

		<h3>4.1 Cloud Action Buffer and 20-to-200 Hz Resampling</h3>
		<p>
			At 20 Hz, successive cloud waypoints are separated by 50 ms; a 200 Hz edge loop requires a 5 ms
			target period. The edge therefore performs local time-based interpolation rather than asking the
			cloud to emit ten redundant commands. Translation can be interpolated with a bounded cubic
			trajectory, while orientation uses quaternion spherical interpolation. For adjacent cloud targets
			<em>T<sub>k</sub></em> and <em>T</em><sub>k+1</sub>,
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e2}></div>
			<span class="eq-no">(2)</span>
		</div>
		<p>
			A newly received cloud chunk is blended from the current interpolated state at a safe temporal
			boundary. Stale or out-of-order chunks are rejected before entering the local controller.
		</p>

		<h3>4.2 QP-Based Differential Inverse Kinematics</h3>
		<p>
			Let <em>q</em> denote the current robot configuration and <em>J<sub>L</sub></em>(<em>q</em>),
			<em>J<sub>R</sub></em>(<em>q</em>) the left/right end-effector Jacobians. Pose errors are converted
			to desired twists <em>v</em>*<sub>L</sub>, <em>v</em>*<sub>R</sub>. A representative bimanual
			differential-IK problem is
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e3}></div>
			<span class="eq-no">(3)</span>
		</div>
		<p>
			subject to joint and velocity bounds and any additional inequality constraints exposed by the
			solver. This is a standard extension of resolved-rate differential kinematics into a constrained
			optimization problem [4], [5]. Hierarchical variants can additionally enforce strict task
			priority when whole-body objectives become mutually incompatible [6].
		</p>
		<p>
			In the current arm implementation, Enactic’s <code>dora-openarm-kinematics</code> node uses one
			shared Mink configuration and one QP solve for both arms [8]. The Buildo MuJoCo MJCF replaces the
			OpenArm arm model while preserving the solver interface. The measured actuator encoder state is
			provided to the solver as the current <em>q</em>, preventing drift between the mathematical
			configuration and the physical robot.
		</p>

		<figure class="fig fig-wide">
			<div class="flow flow-pipe">
				<div class="node">
					<strong>Cloud VLA</strong>
					<span>20 Hz · EE and head chunk</span>
				</div>
				<div class="node">
					<strong>Action buffer</strong>
					<span>Timestamps, freshness, blending</span>
				</div>
				<div class="node">
					<strong>Cartesian resampler</strong>
					<span>200 Hz · XYZ interpolation, quaternion SLERP</span>
				</div>
				<div class="node">
					<strong>Mink differential IK</strong>
					<span>Shared bimanual QP, limits, posture term</span>
				</div>
				<div class="node">
					<strong>Actuator I/O</strong>
					<span>Calibration, hardware bus, position targets</span>
				</div>
			</div>
			<p class="fig-note">Measured joint state q<sub>meas</sub> is fed back into the IK solve.</p>
			<figcaption>
				<strong>Fig. 2.</strong> Buildo edge-adapter execution path on a Broadcom BCM2712 computer. The
				20 Hz cloud trajectory is converted into 200 Hz Cartesian targets and then into joint targets
				by a constrained differential-IK QP.
			</figcaption>
		</figure>

		<h3>4.3 Direct Robot-Actuator Execution</h3>
		<p>
			The QP output is not a raw motor torque command. It is a desired joint configuration that is
			mapped through per-joint sign, zero-offset, and joint-limit calibration before being sent to the
			robot actuator servo loops. A simple calibration map is
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e5}></div>
			<span class="eq-no">(5)</span>
		</div>
		<p>
			The hardware node sends position references over SocketCAN and decodes measured position,
			velocity, temperature, and fault state. For the current bimanual arm path, two CAN interfaces can
			isolate the left and right seven-actuator chains. The motor-side servo loop remains faster than
			the 200 Hz edge reference rate.
		</p>

		<h3>4.4 Tactile and Non-Arm Control</h3>
		<p>
			Tactile correction is applied as a bounded local modification to the task-space reference rather
			than as an unconstrained replacement policy. One form is
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e6}></div>
			<span class="eq-no">(6)</span>
		</div>
		<p>
			followed by the same QP solve. This keeps semantic authority in the cloud while allowing fast
			contact stabilization.
		</p>
		<p>
			The initial <code>dora-openarm-kinematics</code> path solves the two arms and freezes non-arm
			DoFs [8]. Head, dexterous-hand, torso, and wheel-base commands may therefore use separate local
			controllers in the first deployment. A whole-body extension can later include head, torso, and
			base generalized coordinates in the QP, enabling local distribution of one cloud end-effector
			objective across arm, torso, and base without changing the VLA action contract [5], [6].
		</p>

		<h2><span>5</span> Synchronized Human Demonstration Data</h2>
		<p>
			The smart glasses and glove define complementary sensing roles. The glasses observe global hand
			movement in the scene; the glove provides detailed finger configuration and tactile interaction,
			including during self-occlusion. Each demonstration episode contains language, synchronized RGB,
			head/camera pose, left/right wrist and arm state, finger pose, fingertip contact/pressure/slip,
			and calibration metadata.
		</p>
		<p>
			Let the glasses stream provide image <em>I<sub>t</sub></em>, head pose
			<em>T</em><sup>W</sup><sub>H,t</sub>, and wrist estimates
			<em>T</em><sup>W</sup><sub>L,t</sub>, <em>T</em><sup>W</sup><sub>R,t</sub>. Let the glove provide
			local finger state <em>q</em><sup>H</sup><sub>f,t</sub> and fingertip transforms
			<em>T</em><sup>Wrist</sup><sub>i,t</sub>. The world-space fingertip pose is reconstructed as
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e7}></div>
			<span class="eq-no">(7)</span>
		</div>
		<p>
			The raw glove stream is retained at high rate, while a synchronized VLA training view is
			resampled near the cloud-model rate.
		</p>

		<h3>5.1 Canonical Human Action State</h3>
		<p>We define an embodiment-neutral action representation</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e8}></div>
			<span class="eq-no">(8)</span>
		</div>
		<p>
			where <em>P</em><sub>1:5</sub> are fingertip positions, <em>c<sub>t</sub></em> is contact state,
			<em>f<sub>t</sub></em> is force/pressure intent, and <em>s<sub>t</sub></em> denotes slip-related
			state. This preserves task geometry while avoiding direct dependence on human joint topology.
		</p>

		<h2><span>6</span> VLM Pre-Training on Human Manipulation</h2>
		<p>
			Starting from Qwen3-VL 27B, we adapt the VLM on egocentric human manipulation. The objective is
			next-action understanding rather than motor control. Given recent frames, instruction ℓ, and
			human-state history,
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e9}></div>
			<span class="eq-no">(9)</span>
		</div>
		<p>
			followed by a next-action prediction head or action tokenizer. The pre-training target includes
			next wrist pose, fingertip geometry, and contact/force state. This encourages the VLM to
			associate visible affordances — for example, a handle, button, cup rim, or appliance door — with
			approach direction, hand aperture, wrist rotation, and expected contact transition. Training
			should preserve successful, failed, and recovery demonstrations as well as viewpoint and object
			variation so that the model learns both nominal behavior and correction structure.
		</p>

		<h2><span>7</span> Human-to-Robot Retargeting</h2>
		<p>
			We solve a constrained retargeting problem rather than linearly mapping human finger angles to
			robot joint angles. For robot configuration <em>q</em>, a representative objective is
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e10}></div>
			<span class="eq-no">(10)</span>
		</div>
		<p>
			subject to robot joint, collision, and reachability constraints. The retargeting output contains
			robot wrist/arm targets, robot-hand joint targets, desired contact/force state, and a residual
			score. Demonstrations with large infeasibility residuals are rejected or down-weighted.
		</p>

		<h2><span>8</span> MM-DiT Action-Expert Post-Training</h2>
		<p>
			After human-action pre-training, the VLM is frozen and a separate MM-DiT action expert is trained
			on robot-space trajectories. Let
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e11}></div>
			<span class="eq-no">(11)</span>
		</div>
		<p>
			where <em>q</em><sup>R</sup><sub>t</sub> is the current robot state and
			<em>d</em><sub>skill</sub> is an optional one-shot skill embedding. The action chunk can contain
			left/right end-effector targets, hand targets, head/gaze commands, contact/force intent, and
			optional body-motion intent.
		</p>
		<p>
			For flow matching, sample ε ∼ 𝒩(0, <em>I</em>) and τ ∼ 𝒰(0, 1),
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e12}></div>
			<span class="eq-no">(12)</span>
		</div>
		<p>and learn a vector field <em>v</em><sub>φ</sub> that transports noisy actions toward the ground-truth trajectory,</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e13}></div>
			<span class="eq-no">(13)</span>
		</div>
		<p>
			We additionally recommend joint-space and fingertip-geometry supervision for dexterous hands so
			the model is penalized for both incorrect actuator configuration and incorrect physical fingertip
			placement.
		</p>

		<h2><span>9</span> Optimization I: Edge Resolution Optimizer</h2>
		<p>
			Cloud-hosted VLM inference incurs both uplink bandwidth and visual-token cost. Sending every
			camera frame at a fixed high resolution wastes compute on walls, floors, and background regions
			when manipulation depends primarily on the target object, hands, contact neighborhood, and
			immediate obstacles. We therefore construct a multi-resolution observation packet: (1) downsample
			the full frame to preserve global context; (2) detect and track task-relevant regions using
			instruction-conditioned proposals, hand regions, depth discontinuities, and recent target
			history; (3) transmit selected regions at higher resolution with crop coordinates and depth
			metadata; and (4) adjust the total pixel budget according to network bandwidth, VLM latency, and
			task risk. Let region <em>i</em> have area <em>A<sub>i</sub></em>, resolution scale
			<em>r<sub>i</sub></em>, and task importance <em>w<sub>i</sub></em>,
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e14}></div>
			<span class="eq-no">(14)</span>
		</div>
		<p>with an analogous visual-token budget <em>B</em><sub>tok</sub>.</p>

		<h2><span>10</span> Optimization II: Dynamic Action Horizon</h2>
		<p>
			Cloud output is represented as future action chunks, typically hundreds of milliseconds long,
			locally buffered and interpolated between server responses. We make the horizon state-dependent.
			Define normalized manipulation risk
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e15}></div>
			<span class="eq-no">(15)</span>
		</div>
		<p>
			where <em>C<sub>t</sub></em> measures contact proximity and state, <em>U<sub>t</sub></em>
			uncertainty, <em>D<sub>t</sub></em> scene-change magnitude, and <em>V<sub>t</sub></em> target
			visibility. Then
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e16}></div>
			<span class="eq-no">(16)</span>
		</div>
		<p>
			Longer chunks reduce server-call frequency in predictable free-space motion, while shorter chunks
			permit more frequent replanning near contact or uncertainty. The edge resampler remains fixed at
			200 Hz; only the semantic chunk horizon changes.
		</p>

		<h2><span>11</span> Optimization III: Field-of-View Recovery</h2>
		<p>
			Egocentric manipulation frequently loses the task target because the robot wrist, hand, object,
			or environment occludes the camera. Continuing a stale action chunk when the target is unseen can
			turn a perception error into a physical failure. The policy maintains target visibility
			<em>V<sub>t</sub></em> from detection confidence, depth consistency, and recent target tracking.
			When visibility remains below threshold, the current skill is suspended and the edge enters a
			bounded recovery state. Recovery can use head rotation, torso motion, small base repositioning,
			or an arm motion that removes self-occlusion. Once the target is reacquired, the cloud receives a
			fresh observation and returns a new action chunk rather than blindly resuming a stale trajectory.
		</p>

		<figure class="fig fig-wide">
			<div class="opt-grid">
				<div class="node">
					<strong>1 · Edge resolution</strong>
					<span>Low-resolution context, high-resolution task regions, pixel and token budget</span>
				</div>
				<div class="node">
					<strong>2 · Dynamic horizon</strong>
					<span>Long chunks in free space, short chunks near contact</span>
				</div>
				<div class="node">
					<strong>3 · Field-of-view recovery</strong>
					<span>Detect target loss, reposition, reacquire, and replan</span>
				</div>
				<div class="node">
					<strong>4 · Matched tactile sensing</strong>
					<span>Aligned glove and robot channels for contact, force, and slip</span>
				</div>
			</div>
			<figcaption>
				<strong>Fig. 3.</strong> Four optimizations around the cloud–edge loop. The edge packages the
				observation under a compute and network budget; the cloud predicts a risk-adaptive task-space
				chunk; the edge resamples, solves the QP, and applies a bounded tactile correction.
			</figcaption>
		</figure>

		<figure class="fig">
			<ol class="state">
				<li><strong>Execute skill</strong> <span>Consume the current chunk</span></li>
				<li><strong>Visibility check</strong> <span>Target confidence and occlusion</span></li>
				<li><strong>Recovery action</strong> <span>Head, then torso, base, and arm</span></li>
				<li><strong>Reacquired</strong> <span>Refresh the observation and discard the stale chunk</span></li>
				<li><strong>Replan and resume</strong> <span>New chunk from the current state</span></li>
			</ol>
			<figcaption>
				<strong>Fig. 4.</strong> Field-of-view recovery. Target loss triggers bounded viewpoint recovery,
				followed by a fresh cloud observation and replanning. If the target stays visible, execution
				continues.
			</figcaption>
		</figure>

		<h2><span>12</span> Optimization IV: Matched Glove/Robot Tactile Sensing</h2>
		<p>
			The glove captures motion and tactile interaction using finger IMUs and fingertip/palm
			force-sensitive sensors. The robot hand also provides tactile sensing for grasp stability,
			contact detection, and slip-aware correction. Where practical, the human glove and robot hand
			should use similar sensing locations and physical quantities. When identical hardware is not
			feasible, both are mapped into a canonical per-finger tactile state
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e17}></div>
			<span class="eq-no">(17)</span>
		</div>
		<p>
			where <em>p</em> is normalized pressure or normal-force intent, <em>ṗ</em> is force change,
			<em>c</em> is contact state, and σ is a slip proxy. Small modality encoders
			<em>g<sub>H</sub></em> and <em>g<sub>R</sub></em> can map glove and robot tactile streams into a
			shared latent space,
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e18}></div>
			<span class="eq-no">(18)</span>
		</div>

		<h2><span>13</span> One-Shot Skill Adaptation</h2>
		<p>
			The one-shot workflow records one high-quality demonstration, adapts a skill, validates it in
			MuJoCo, and deploys it through the robot-app platform. One shot is interpreted as skill adaptation
			on top of a broadly pre-trained manipulation model, not learning a fresh VLM and action expert
			from a single episode. Given a single skill demonstration <em>D<sub>s</sub></em>, a skill encoder
			or lightweight adapter produces
		</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e19}></div>
			<span class="eq-no">(19)</span>
		</div>
		<p>and the action expert predicts</p>
		<div class="eq">
			<div class="eq-tex" data-tex={tex.e11}></div>
			<span class="eq-no">(20)</span>
		</div>
		<p>
			The one-shot trajectory primarily supplies task-specific sub-step ordering, wrist/hand path,
			contact sites, force intent, and appliance-specific spatial relations.
		</p>

		<h2><span>14</span> Simulation-to-Deployment Workflow</h2>
		<p>
			The developer platform imports synchronized sessions, previews synchronization, retargets human
			motion, corrects failed or unreachable retargeted trajectories in simulation, post-trains the
			action expert, and binds the result to a fixed observation/action schema. The same cloud
			task-space action contract is used for MuJoCo and the real robot. In simulation, the same edge
			adapter receives the cloud chunk, resamples it, solves QP IK, and drives the simulated Buildo
			model; on hardware, only the final actuator interface changes.
		</p>
		<p>
			Simulation should randomize object pose, lighting, appliance variants, furniture position, and
			workspace geometry to test robustness. Network certification should inject latency, packet loss,
			delayed action chunks, and target occlusion. Edge-controller tests should additionally vary
			joint-state noise, actuator lag, calibration offsets, and command deadlines.
		</p>

		<figure class="fig fig-wide">
			<div class="flow flow-pipe">
				<div class="node"><strong>1-shot demo</strong><span>Glasses and gloves</span></div>
				<div class="node"><strong>Retarget</strong><span>Human to robot</span></div>
				<div class="node"><strong>MuJoCo</strong><span>Validate and randomize</span></div>
				<div class="node"><strong>Edge adapter</strong><span>Resample and QP IK</span></div>
				<div class="node"><strong>Publish</strong><span>Signed robot app</span></div>
				<div class="node"><strong>Deploy</strong><span>Cloud VLA and edge</span></div>
			</div>
			<figcaption>
				<strong>Fig. 5.</strong> Developer lifecycle. Simulation and the real robot share the same
				cloud task-space action contract and edge-adapter structure.
			</figcaption>
		</figure>

		<h2><span>15</span> Evaluation Protocol and Results</h2>
		<h3>15.1 Core Task and Edge-Control Metrics</h3>
		<p>
			We propose reporting task success rate, collision count, object drops, maximum contact force,
			completion time, cloud inference latency p50/p95, network deadline misses, and recovery attempts.
			The edge adapter should additionally report Cartesian tracking error, IK/QP solve time
			p50/p95/p99, joint-limit activation rate, command deadline misses, solver infeasibility and
			failure count, CAN round-trip latency, and the difference between requested and measured joint
			position. Dexterous tasks should report grasp retention, slip events, fingertip pose error, and
			contact-state accuracy.
		</p>

		<h3>15.1.1 Real-World Benchmark Results</h3>
		<p>
			We evaluate TwoRate-VLA across eight long-horizon dexterous loco-manipulation tasks spanning
			pick-and-place, faucet turning, cart pushing, and serving. The benchmark compares against ACT,
			InternVLA-M1, EgoVLA, H-RDT, π<sub>0.5</sub>, GR00T N1.6, and Diffusion Policy. TwoRate-VLA
			achieves a 90.0% mean success rate across the eight tasks and is the highest-performing method
			on every task in this evaluation.
		</p>

		<figure class="fig">
			<div class="bars" aria-hidden="true">
				<div class="bar-row">
					<span>TwoRate-VLA</span>
					<span class="track"><span class="fill ours" style="width: 90%"></span></span>
					<span class="pct">90.0%</span>
				</div>
				<div class="bar-row">
					<span>GR00T N1.6</span>
					<span class="track"><span class="fill" style="width: 28.8%"></span></span>
					<span class="pct">28.8%</span>
				</div>
			</div>
			<figcaption>
				<strong>Fig. 6.</strong> Real-world task success. TwoRate-VLA, shown against the strongest
				baseline by mean, has a 90.0% mean across Tasks 1–8. GR00T N1.6 reaches 28.8%.
			</figcaption>
		</figure>

		<p>
			<strong>Overall comparison.</strong> Using the values shown in the benchmark, the strongest
			comparison baseline by mean success is GR00T N1.6 at 28.8%. TwoRate-VLA therefore improves
			absolute mean success by 61.3 percentage points and reaches approximately 3.1× the success rate
			of the next-best baseline.
		</p>
		<p>
			<strong>Training-data efficiency.</strong> Under the training-data accounting used for this
			experiment, the comparison baselines were trained with approximately 10× more data than the
			TwoRate-VLA post-training set. The result therefore suggests that the hierarchical cloud/edge
			split and task-space action representation can improve data efficiency in addition to raw task
			success.
		</p>

		<h3>15.2 Optimization Ablations</h3>
		<div class="table-wrap">
			<table>
				<caption>
					<strong>Table 1.</strong> Recommended ablations.
				</caption>
				<thead>
					<tr>
						<th scope="col">Ablation</th>
						<th scope="col">Primary metric</th>
						<th scope="col">Expected trade-off</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Adaptive resolution</td>
						<td>Bytes, tokens, success</td>
						<td>Lower compute without task-detail loss</td>
					</tr>
					<tr>
						<td>Dynamic horizon</td>
						<td>Cloud calls, stale-action duration</td>
						<td>Fewer calls in free space, faster replanning near contact</td>
					</tr>
					<tr>
						<td>Field-of-view recovery</td>
						<td>Reacquisition, resume success</td>
						<td>Fewer blind continuation failures</td>
					</tr>
					<tr>
						<td>Matched tactile</td>
						<td>Slip, force error, transfer</td>
						<td>Reduced tactile domain gap</td>
					</tr>
					<tr>
						<td>QP edge adapter</td>
						<td>End-effector error, solve latency, limit activations</td>
						<td>Deterministic constraint-aware execution</td>
					</tr>
					<tr>
						<td>Measured-state sync</td>
						<td>Joint tracking, recovery after lag</td>
						<td>Reduced model/robot state drift</td>
					</tr>
				</tbody>
			</table>
		</div>

		<h2><span>16</span> Discussion</h2>
		<p>
			<strong>Why the cloud/edge split matters.</strong> The cloud and edge solve different problems.
			The cloud performs broad visual-semantic reasoning and selects task-space behavior; the edge
			solves embodiment mechanics at high rate. This division allows cloud model size to scale
			independently of the onboard compute budget while retaining deterministic local control.
		</p>
		<p>
			<strong>Why QP/IK rather than a learned edge policy.</strong> For the present architecture, the
			edge receives explicit end-effector goals, current robot state, and kinematic constraints. These
			are exactly the variables addressed by differential IK and QP control. Using a deterministic
			solver reduces the amount of learned behavior that must be validated at the 200 Hz execution
			layer, exposes interpretable constraints, and makes sim-to-real debugging more direct. Learned
			residuals remain useful for tactile contact correction, but they are bounded around the solver’s
			task-space reference.
		</p>

		<h2><span>17</span> Conclusion</h2>
		<p>
			We presented a general-purpose two-rate architecture for cloud-edge physical AI, with Buildo as
			the current target embodiment. The cloud VLA produces future task-space behavior at approximately
			20 Hz, while a 200 Hz deterministic edge adapter converts those commands into constrained robot
			execution through interpolation, QP-based differential IK, measured-state feedback, and direct
			actuator references. This replaces a learned edge action model with an interpretable embodiment
			layer grounded in established inverse-kinematics and QP-control methods. The training pipeline
			remains centered on synchronized visual, geometric, and tactile human demonstrations, one-shot
			skill adaptation, and MuJoCo validation. The four proposed optimizations — adaptive edge
			resolution, dynamic action horizon, field-of-view recovery, and matched tactile sensing — target
			cloud inference cost, stale motion, perception loss, and demonstration-to-deployment mismatch.
			The next step is an ablation-driven evaluation of the complete 20 Hz cloud / 200 Hz edge stack in
			MuJoCo and on the physical Buildo platform.
		</p>

		<h2 class="refs-title">References</h2>
		<ol class="refs">
			<li>
				S. Wei, H. Jing, B. Li, et al., “Ψ<sub>0</sub>: An open foundation model towards universal
				humanoid loco-manipulation,” arXiv:2603.12263, 2026.
			</li>
			<li>
				S. Bai, Y. Cai, R. Chen, et al., “Qwen3-VL technical report,” arXiv:2511.21631, 2025.
			</li>
			<li>
				E. Todorov, T. Erez, and Y. Tassa, “MuJoCo: A physics engine for model-based control,” in
				<em>Proc. IEEE/RSJ Int. Conf. Intelligent Robots and Systems (IROS)</em>, 2012, pp. 5026–5033.
			</li>
			<li>
				J. Haviland and P. Corke, “Manipulator differential kinematics: Part I — kinematics, velocity,
				and applications,” <em>IEEE Robotics &amp; Automation Magazine</em>, 2023,
				doi:10.1109/MRA.2023.3270228.
			</li>
			<li>
				O. Kanoun, F. Lamiraux, and P.-B. Wieber, “Kinematic control of redundant manipulators:
				Generalizing the task-priority framework to inequality task,”
				<em>IEEE Trans. Robotics</em>, vol. 27, no. 4, pp. 785–792, 2011, doi:10.1109/TRO.2011.2142450.
			</li>
			<li>
				A. Escande, N. Mansard, and P.-B. Wieber, “Hierarchical quadratic programming: Fast online
				humanoid-robot motion generation,” <em>Int. J. Robotics Research</em>, vol. 33, no. 7, pp.
				1006–1028, 2014, doi:10.1177/0278364914521306.
			</li>
			<li>
				K. Zakka, “Mink: Python inverse kinematics based on MuJoCo,” software, 2026.
				<a href="https://github.com/kevinzakka/mink">https://github.com/kevinzakka/mink</a>
			</li>
			<li>
				Enactic, Inc., “dora-openarm-kinematics: Dora nodes for forward and QP-based differential
				inverse kinematics on OpenArm,” software repository, 2026.
				<a href="https://github.com/enactic/dora-openarm-kinematics"
					>https://github.com/enactic/dora-openarm-kinematics</a
				>
			</li>
		</ol>
	</div>
</article>

<style>
	.paper {
		--paper: #fbfbf9;
		--rule: #1a1a1a;
		--muted: #3d3a36;
		position: relative;
		z-index: 1;
		max-width: 980px;
		margin: 0 auto;
		padding: calc(var(--header-height, 96px) + 36px) 40px 88px;
		color: #1a1a1a;
		font-family: 'Source Serif 4', 'Times New Roman', Times, serif;
		font-size: 16.5px;
		font-weight: 400;
		line-height: 1.48;
		background: var(--paper);
	}

	.mast {
		margin: 0 0 22px;
		padding-bottom: 8px;
		border-bottom: 2px solid var(--rule);
		font-family: 'Source Serif 4', 'Times New Roman', Times, serif;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		text-align: center;
		color: var(--muted);
	}

	.front h1 {
		margin: 8px auto 14px;
		max-width: 46rem;
		font-family: 'Source Serif 4', 'Times New Roman', Times, serif;
		font-size: clamp(26px, 3.2vw, 34px);
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 1.18;
		text-align: center;
		color: #111;
	}

	.authors {
		margin: 0;
		text-align: center;
		font-size: 16px;
		font-weight: 600;
	}

	.affil {
		margin: 2px 0 0;
		text-align: center;
		font-size: 14px;
		font-style: italic;
		color: var(--muted);
	}

	.abstract {
		margin: 26px 0 8px;
		padding: 4px 0 0;
	}

	.abstract h2 {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	.abstract p {
		margin: 0;
		font-size: 15px;
		line-height: 1.5;
		text-align: justify;
		hyphens: auto;
	}

	.cols {
		margin-top: 26px;
		column-count: 2;
		column-gap: 32px;
		column-rule: 1px solid rgba(20, 18, 16, 0.14);
	}

	.cols p,
	.cols li {
		font-size: 14.5px;
		line-height: 1.48;
		text-align: justify;
		hyphens: auto;
	}

	.cols p {
		margin: 0 0 0.72em;
	}

	.cols h2 {
		margin: 1.05em 0 0.4em;
		font-family: 'Source Serif 4', 'Times New Roman', Times, serif;
		font-size: 15.5px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.25;
		text-align: left;
		color: #111;
		break-after: avoid;
	}

	.cols h2 span {
		margin-right: 0.4em;
	}

	.cols h3 {
		margin: 0.85em 0 0.3em;
		font-family: 'Source Serif 4', 'Times New Roman', Times, serif;
		font-size: 14.5px;
		font-weight: 700;
		font-style: italic;
		line-height: 1.3;
		break-after: avoid;
	}

	.contrib {
		margin-bottom: 0.25em !important;
	}

	.cols ul {
		margin: 0 0 0.8em 1.15em;
		padding: 0;
	}

	.cols li {
		margin: 0 0 0.35em;
	}

	.cols code {
		font-family: 'Source Serif 4', 'Times New Roman', Times, serif;
		font-size: 0.95em;
		font-style: italic;
	}

	.eq {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 10px;
		margin: 0.35em 0 0.75em;
		break-inside: avoid;
	}

	.eq-tex {
		min-height: 1.6em;
		overflow-x: auto;
	}

	.eq-tex :global(.katex-display) {
		margin: 0.15em 0;
		text-align: center;
	}

	.eq-no {
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}

	.fig {
		margin: 0.4em 0 1em;
		break-inside: avoid;
	}

	.fig-wide {
		column-span: all;
		margin: 0.8em 0 1.1em;
	}

	.fig figcaption,
	.table-wrap caption {
		margin-top: 8px;
		font-size: 13px;
		line-height: 1.4;
		text-align: left;
		color: #222;
	}

	.fig-note {
		margin: 6px 0 0 !important;
		font-size: 12px !important;
		font-style: italic;
		text-align: center !important;
		color: var(--muted);
	}

	.flow {
		display: grid;
		gap: 10px;
	}

	.flow-3 {
		grid-template-columns: repeat(3, 1fr);
	}

	.flow-pipe {
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	}

	.flow-kicker {
		margin: 0 0 6px !important;
		font-size: 10px !important;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-align: center !important;
		text-transform: uppercase;
	}

	.node {
		margin-bottom: 6px;
		padding: 8px 8px 9px;
		border: 1px solid #222;
		background: #fff;
	}

	.node strong,
	.state strong {
		display: block;
		font-size: 12.5px;
		font-weight: 700;
		line-height: 1.25;
	}

	.node span,
	.state span {
		display: block;
		margin-top: 2px;
		font-size: 11.5px;
		line-height: 1.3;
		color: #333;
	}

	.opt-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}

	.state {
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: step;
	}

	.state li {
		position: relative;
		margin: 0 !important;
		padding: 7px 10px 8px;
		border: 1px solid #222;
		border-bottom: 0;
		text-align: left !important;
		background: #fff;
	}

	.state li:last-child {
		border-bottom: 1px solid #222;
	}

	.bars {
		display: grid;
		gap: 8px;
		padding: 8px 0 2px;
	}

	.bar-row {
		display: grid;
		grid-template-columns: 118px 1fr 52px;
		gap: 8px;
		align-items: center;
		font-size: 12.5px;
	}

	.track {
		display: block;
		height: 14px;
		background: #eceae4;
		border: 1px solid #222;
	}

	.fill {
		display: block;
		height: 100%;
		background: #8d8a84;
	}

	.fill.ours {
		background: #1a1a1a;
	}

	.pct {
		font-variant-numeric: tabular-nums;
		text-align: right;
	}

	.table-wrap {
		margin: 0.4em 0 1em;
		break-inside: avoid;
		column-span: all;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
		line-height: 1.35;
	}

	caption {
		caption-side: bottom;
		text-align: left;
	}

	th,
	td {
		padding: 6px 8px;
		border-top: 1px solid #222;
		border-bottom: 1px solid #222;
		text-align: left;
		vertical-align: top;
	}

	thead th {
		border-bottom: 2px solid #222;
		font-weight: 700;
	}

	.refs-title {
		column-span: all;
		margin-top: 1.4em !important;
		padding-top: 0.7em;
		border-top: 1px solid #222;
	}

	.refs {
		column-span: all;
		margin: 0.4em 0 0;
		padding-left: 1.5em;
	}

	.refs li {
		margin: 0 0 0.55em;
		font-size: 13.5px !important;
		text-align: left !important;
		hyphens: auto;
	}

	.refs a {
		color: #1338a0;
		word-break: break-all;
	}

	@media (max-width: 800px) {
		.paper {
			padding: calc(var(--header-height, 88px) + 24px) 18px 64px;
			font-size: 16px;
		}

		.cols {
			column-count: 1;
			column-rule: 0;
		}

		.flow-3,
		.opt-grid {
			grid-template-columns: 1fr;
		}

		.cols p,
		.abstract p,
		.cols li {
			text-align: left;
			hyphens: manual;
		}

		.bar-row {
			grid-template-columns: 96px 1fr 48px;
		}
	}
</style>
