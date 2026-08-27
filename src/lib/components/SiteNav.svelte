<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	let {
		pathname,
		notification = null
	}: {
		pathname: string;
		notification?: string | null;
	} = $props();

	const normalizedPath = $derived(pathname !== '/' ? pathname.replace(/\/$/, '') : pathname);
	const isBuildo = $derived(normalizedPath === '/buildo');
	const isTeam = $derived(normalizedPath === '/team');

	let headerEl: HTMLDivElement;

	onMount(() => {
		const update = () => {
			document.documentElement.style.setProperty('--header-height', `${headerEl.offsetHeight}px`);
		};
		update();
		const ro = new ResizeObserver(update);
		ro.observe(headerEl);
		return () => ro.disconnect();
	});
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a class="skip-link" href="#main">Skip to content</a>

<div class="site-header" bind:this={headerEl}>
	{#if notification}
		<div class="rdk-notification-bar">{notification}</div>
	{/if}
	<nav aria-label="Primary">
		<a href={resolve('/')} class="nav-logo" aria-label="Starforge home">
			<img src="/assets/logo-wordmark-dark.png" alt="Starforge" class="nav-logo-img" />
		</a>
		<ul class="nav-links">
			<li>
				<a
					href={resolve('/buildo')}
					class:active={isBuildo}
					aria-current={isBuildo ? 'page' : undefined}>Buildo</a
				>
			</li>
			<li>
				<a href={resolve('/team')} class:active={isTeam} aria-current={isTeam ? 'page' : undefined}
					>Team</a
				>
			</li>
			<li>
				<a href="https://portal.starforgerobotics.com">Dev Portal</a>
			</li>
		</ul>
	</nav>
</div>

<style>
	/* Sized to the artwork so the link target has no dead space around it. */
	.nav-logo {
		display: inline-flex;
		align-items: center;
		line-height: 0;
		transition: opacity 0.2s ease;
	}

	.nav-logo:hover {
		opacity: 0.8;
	}

	.nav-logo-img {
		display: block;
		/* This mark is taller than the previous crop (long star points), so the
		   height is a step up to keep the word at a similar size. */
		height: 72px;
		width: auto;
	}

	@media (max-width: 900px) {
		.nav-logo-img {
			height: 52px;
		}
	}

	@media (max-width: 560px) {
		.nav-logo-img {
			height: 40px;
		}
	}
</style>
