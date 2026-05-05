<script lang="ts">
	import { resolve } from '$app/paths';
	import JoinUsLink from '$lib/components/JoinUsLink.svelte';
	import { onMount } from 'svelte';

	type Section = '' | 'mission' | 'vision' | 'milestone';

	let { pathname, currentSection, notification = null }: {
		pathname: string;
		currentSection: Section;
		notification?: string | null;
	} = $props();

	const normalizedPath = $derived(pathname !== '/' ? pathname.replace(/\/$/, '') : pathname);
	const isHome = $derived(normalizedPath === '/');
	const isVision = $derived(normalizedPath === '/vision');
function activeForAnchor(id: Exclude<Section, ''>) {
		if (!isHome) return false;
		return currentSection === id;
	}

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
		<a href={resolve('/')} class="nav-logo" aria-label="Starforge home">STARFORGE</a>
		<ul class="nav-links">
			<li>
				<a href={resolve('/#mission')} class:active={activeForAnchor('mission')}>Mission</a>
			</li>
			<li>
				<a
					href={resolve('/vision')}
					class:active={isVision}
					aria-current={isVision ? 'page' : undefined}>Vision</a
				>
			</li>
			<li>
				<a href={resolve('/#milestone')} class:active={activeForAnchor('milestone')}>Milestones</a>
			</li>
			<li>
				<JoinUsLink />
			</li>
		</ul>
	</nav>
</div>
