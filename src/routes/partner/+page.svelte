<script lang="ts">
	let companyName = $state('');
	let signerName = $state('');
	let signerTitle = $state('');
	let email = $state('');

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let hasSignature = $state(false);
	let drawing = false;

	let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	function setupCanvas(node: HTMLCanvasElement) {
		canvas = node;
		const context = node.getContext('2d');
		if (!context) return;
		ctx = context;
		const resize = () => {
			const rect = node.getBoundingClientRect();
			const ratio = window.devicePixelRatio || 1;
			const prev = hasSignature ? node.toDataURL('image/png') : null;
			node.width = rect.width * ratio;
			node.height = rect.height * ratio;
			context.scale(ratio, ratio);
			context.lineWidth = 2;
			context.lineCap = 'round';
			context.strokeStyle = '#141210';
			if (prev) {
				const img = new Image();
				img.onload = () => context.drawImage(img, 0, 0, rect.width, rect.height);
				img.src = prev;
			}
		};
		resize();
		window.addEventListener('resize', resize);
		return {
			destroy() {
				window.removeEventListener('resize', resize);
			}
		};
	}

	function pointerPos(e: PointerEvent) {
		const rect = canvas.getBoundingClientRect();
		return { x: e.clientX - rect.left, y: e.clientY - rect.top };
	}

	function startDraw(e: PointerEvent) {
		if (!ctx) return;
		drawing = true;
		hasSignature = true;
		const { x, y } = pointerPos(e);
		ctx.beginPath();
		ctx.moveTo(x, y);
	}

	function draw(e: PointerEvent) {
		if (!drawing || !ctx) return;
		const { x, y } = pointerPos(e);
		ctx.lineTo(x, y);
		ctx.stroke();
	}

	function stopDraw() {
		drawing = false;
	}

	function clearSignature() {
		if (!ctx || !canvas) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		hasSignature = false;
	}

	const canSubmit = $derived(
		companyName.trim() &&
			signerName.trim() &&
			signerTitle.trim() &&
			email.trim() &&
			hasSignature &&
			status !== 'submitting'
	);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!canSubmit || !canvas) return;
		status = 'submitting';
		errorMessage = '';
		try {
			const res = await fetch('/api/partner-agreement', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					companyName: companyName.trim(),
					signerName: signerName.trim(),
					signerTitle: signerTitle.trim(),
					email: email.trim(),
					signatureDataUrl: canvas.toDataURL('image/png')
				})
			});
			const result = await res.json();
			if (!res.ok) throw new Error(result.error || 'Submission failed.');
			status = 'success';
		} catch (err) {
			status = 'error';
			errorMessage = err instanceof Error ? err.message : 'Submission failed.';
		}
	}
</script>

<svelte:head>
	<title>Become a Buildo Creators Partner | StarForge Robotics</title>
	<meta
		name="description"
		content="Sign the Buildo Creators partner agreement and letter of intent to start collecting skill data for StarForge humanoid robots."
	/>
</svelte:head>

<section id="partner-hero" class="partner-hero">
	<span class="section-label">Buildo Creators · Partnership</span>
	<h1 class="section-title">Become a <span>partner</span></h1>
	<p class="section-body">
		Sign the Robotics Skill Data Collection and Revenue Sharing Agreement and the Strategic
		Deployment Partner LOI below. We'll countersign and follow up by email once our team has
		reviewed your submission.
	</p>
</section>

{#if status === 'success'}
	<section class="partner-form-section">
		<div class="partner-success">
			<h2 class="section-title" style="margin-bottom: 12px;">Signed and sent</h2>
			<p class="section-body">
				Thanks, {signerName}. Your signed copies are on their way to our team. We'll be in touch
				at {email} once StarForge has countersigned.
			</p>
		</div>
	</section>
{:else}
	<section class="partner-form-section">
		<form class="partner-form" onsubmit={handleSubmit}>
			<div class="partner-field">
				<label for="companyName">Company / legal name</label>
				<input id="companyName" type="text" bind:value={companyName} autocomplete="organization" required />
			</div>
			<div class="partner-row">
				<div class="partner-field">
					<label for="signerName">Your full name</label>
					<input id="signerName" type="text" bind:value={signerName} autocomplete="name" required />
				</div>
				<div class="partner-field">
					<label for="signerTitle">Your title</label>
					<input id="signerTitle" type="text" bind:value={signerTitle} autocomplete="organization-title" required />
				</div>
			</div>
			<div class="partner-field">
				<label for="email">Email</label>
				<input id="email" type="email" bind:value={email} autocomplete="email" required />
			</div>

			<div class="partner-field">
				<span class="partner-sign-label">Signature</span>
				<div class="partner-signature-pad">
					<canvas
						use:setupCanvas
						onpointerdown={startDraw}
						onpointermove={draw}
						onpointerup={stopDraw}
						onpointerleave={stopDraw}
						aria-label="Draw your signature"
					></canvas>
					{#if !hasSignature}
						<span class="partner-sign-placeholder">Sign here</span>
					{/if}
				</div>
				<button type="button" class="btn-ghost partner-clear" onclick={clearSignature}>Clear</button>
			</div>

			{#if status === 'error'}
				<p class="partner-error">{errorMessage}</p>
			{/if}

			<button type="submit" class="btn-primary" disabled={!canSubmit}>
				{status === 'submitting' ? 'Sending…' : 'Sign and send'}
			</button>
			<p class="partner-note">
				StarForge's own signature is left blank on both documents for us to countersign after
				review.
			</p>
		</form>
	</section>
{/if}

<style>
	.partner-hero {
		padding-top: calc(var(--header-height, 96px) + 64px);
		max-width: 760px;
	}

	.partner-form-section {
		padding-top: 0;
		max-width: 640px;
	}

	.partner-form {
		display: flex;
		flex-direction: column;
		gap: 24px;
		border: 2px solid var(--border);
		padding: 40px;
		background: rgba(20, 18, 16, 0.022);
	}

	.partner-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	.partner-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.partner-field label,
	.partner-sign-label {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.partner-field input {
		font-family: 'Barlow', sans-serif;
		font-size: 15px;
		font-weight: 500;
		color: var(--ink);
		background: var(--bg);
		border: 2px solid var(--border);
		padding: 12px 14px;
	}

	.partner-field input:focus {
		outline: none;
		border-color: var(--accent);
	}

	.partner-signature-pad {
		position: relative;
		border: 2px solid var(--border-strong);
		background: var(--bg);
		height: 160px;
		touch-action: none;
	}

	.partner-signature-pad canvas {
		width: 100%;
		height: 100%;
		display: block;
		cursor: crosshair;
	}

	.partner-sign-placeholder {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Mono', monospace;
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted);
		pointer-events: none;
	}

	.partner-clear {
		align-self: flex-start;
		padding: 8px 16px;
	}

	.partner-error {
		font-family: 'Space Mono', monospace;
		font-size: 12px;
		color: #b3261e;
	}

	.partner-note {
		font-size: 12px;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.partner-success {
		border: 2px solid var(--border);
		padding: 40px;
		background: rgba(20, 18, 16, 0.022);
	}

	@media (max-width: 560px) {
		.partner-row {
			grid-template-columns: 1fr;
		}
		.partner-form {
			padding: 24px;
		}
	}
</style>
