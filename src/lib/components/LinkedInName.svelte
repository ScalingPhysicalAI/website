<script lang="ts">
	let {
		name,
		linkedin,
		x
	}: {
		name: string;
		linkedin?: string;
		x?: string;
	} = $props();
</script>

<span class="name-row">
	{name}
	{#if x}
		<a
			class="social-icon social-icon-x"
			href={x}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="{name} on X"
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.727-8.888L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
				/>
			</svg>
		</a>
	{/if}
	{#if linkedin}
		<a
			class="social-icon social-icon-li"
			href={linkedin}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="{name} on LinkedIn"
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
				/>
			</svg>
		</a>
	{/if}
</span>

<style>
	.name-row {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
	}

	.social-icon {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
		line-height: 0;
	}

	.social-icon svg {
		width: 0.72em;
		height: 0.72em;
		transition: fill 0.2s ease;
	}

	.social-icon-x {
		box-sizing: border-box;
		width: 0.72em;
		height: 0.72em;
		padding: 0.12em;
		background: #000;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s ease;
	}

	.social-icon-x svg {
		width: 100%;
		height: 100%;
		fill: #fff;
	}

	.social-icon-li svg {
		fill: #0a66c2;
	}

	.social-icon-li:hover svg {
		fill: var(--accent, #7a5e0f);
	}

	.social-icon-x:hover {
		background: var(--accent, #7a5e0f);
	}
</style>
