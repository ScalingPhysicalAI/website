<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	let { children } = $props();

	let currentSection = $state<'' | 'mission' | 'vision' | 'milestone'>('');

	const normalizedPath = $derived(
		page.url.pathname !== '/' ? page.url.pathname.replace(/\/$/, '') : page.url.pathname
	);

	const rdkNotification = $derived(
		normalizedPath === '/robo-dev-kit'
			? ((page.data as Record<string, any>).product?.notification?.value ?? null)
			: null
	);

	function updateCurrentSection() {
		if (page.url.pathname !== '/') return;
		const ids = ['mission', 'vision', 'milestone'] as const;
		let next: typeof currentSection = '';

		for (const id of ids) {
			const el = document.getElementById(id);
			if (!el) continue;
			const top = el.getBoundingClientRect().top + window.scrollY;
			if (window.scrollY >= top - 200) next = id;
		}

		currentSection = next;
	}

	onMount(() => {
		$effect(() => {
			const pathname = normalizedPath;
			const nextClass =
				pathname === '/vision'
					? 'page-vision'
					: pathname === '/robo-dev-kit'
						? 'page-robo-dev-kit'
						: pathname.startsWith('/developer')
							? 'page-developer'
							: pathname.startsWith('/blog')
								? 'page-blog'
								: '';
			document.body.className = nextClass;
		});

		if (typeof window !== 'undefined') {
			updateCurrentSection();
			window.addEventListener('scroll', updateCurrentSection, { passive: true });
		}

		return () => {
			window.removeEventListener('scroll', updateCurrentSection);
		};
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

{#if normalizedPath !== '/deck'}
	<SiteNav pathname={page.url.pathname} {currentSection} notification={rdkNotification} />
{/if}

<main id="main">
	{@render children()}
</main>

{#if normalizedPath !== '/deck'}
	<SiteFooter />
{/if}
