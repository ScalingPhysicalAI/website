<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>STARFORGE — Building the compute layer for physical AI</title>
	<meta
		name="description"
		content="Starforge is building the compute layer for physical AI — the intelligence that lets humanoid robots work in the real world."
	/>
</svelte:head>

<section id="hero">
	<div class="hero-bg">
		<div class="hero-scan-lines"></div>
	</div>

	<div class="hero-content">
		<h1 class="hero-title">
			Building the <span>compute layer</span><br />
			for physical AI
		</h1>
		<p class="hero-sub">
			We're building the most capable robot. Meet
			<a class="hero-sub-link" href={resolve('/buildo')}
				>Buildo<span class="hero-sub-arrow" aria-hidden="true">↗</span></a
			>.
		</p>
		<div class="hero-ctas">
			<a href="https://portal.starforgerobotics.com" class="btn-primary">Simulate Buildo</a>
			<a href={resolve('/buildo-prebook')} class="btn-ghost">Prebook</a>
		</div>
	</div>
</section>

<style>
	.hero-sub-link {
		color: var(--accent);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
		white-space: nowrap;
		transition: color 0.2s ease;
	}

	.hero-sub-link:hover {
		color: var(--accent-strong);
	}

	/* inline-block keeps the parent's underline from being drawn under the
	   arrow glyph, which otherwise looks like a struck-through mark. */
	.hero-sub-arrow {
		display: inline-block;
		margin-left: 3px;
		transition: transform 0.2s ease;
	}

	.hero-sub-link:hover .hero-sub-arrow {
		transform: translate(2px, -2px);
	}
</style>
