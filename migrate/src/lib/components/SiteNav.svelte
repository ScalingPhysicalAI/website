<script lang="ts">
	import { resolve } from '$app/paths';
	import JoinUsLink from '$lib/components/JoinUsLink.svelte';

	type Section = '' | 'mission' | 'vision' | 'milestone';

	let { pathname, currentSection }: { pathname: string; currentSection: Section } = $props();

	const isHome = $derived(pathname === '/');
	const isVision = $derived(pathname === '/vision');
	const isRoboDevKit = $derived(pathname === '/robo-dev-kit');

	function activeForAnchor(id: Exclude<Section, ''>) {
		if (!isHome) return false;
		return currentSection === id;
	}
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a class="skip-link" href="#main">Skip to content</a>

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
			<a
				href={resolve('/robo-dev-kit')}
				class:active={isRoboDevKit}
				aria-current={isRoboDevKit ? 'page' : undefined}>Dev Kit</a
			>
		</li>
		<li>
			<a href={resolve('/#milestone')} class:active={activeForAnchor('milestone')}>Milestone</a>
		</li>
		<li>
			<JoinUsLink />
		</li>
	</ul>
</nav>
