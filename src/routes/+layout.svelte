<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import Analytics from '$lib/components/Analytics.svelte';

	let { children } = $props();

	const normalizedPath = $derived(
		page.url.pathname !== '/' ? page.url.pathname.replace(/\/$/, '') : page.url.pathname
	);

	const bodyClass = $derived(normalizedPath === '/buildo' ? 'page-buildo' : '');
	const rdkNotification = $derived(
		normalizedPath === '/buildo' ? 'designed and assembled in New York City' : null
	);

	$effect(() => {
		document.body.className = bodyClass;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Space+Mono:wght@400;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Analytics />

{#if normalizedPath !== '/deck'}
	<SiteNav pathname={page.url.pathname} notification={rdkNotification} />
{/if}

<main id="main">
	{@render children()}
</main>

{#if normalizedPath !== '/deck'}
	<SiteFooter />
{/if}
