<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	let {
		pathname,
		notification = null,
		announcement = null
	}: {
		pathname: string;
		notification?: string | null;
		announcement?: { text: string; href: string } | null;
	} = $props();

	const normalizedPath = $derived(pathname !== '/' ? pathname.replace(/\/$/, '') : pathname);
	const isBuildo = $derived(normalizedPath === '/buildo');
	// Individual posts live under /blog/<slug>, so the section stays marked as
	// current while you are reading one.
	const isBlog = $derived(normalizedPath === '/blog' || normalizedPath.startsWith('/blog/'));

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
	{#if announcement}
		<!-- The whole bar is the target rather than a link buried in the sentence,
		     so the hit area is the full width of the screen. -->
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<a
			class="announce-bar"
			href={announcement.href}
			target="_blank"
			rel="noopener noreferrer"
			data-sveltekit-preload-data="off"
		>
			<!-- The arrow stays inside the text flow so that when the sentence wraps
			     on a narrow screen it trails the last word instead of floating off
			     to the side of the block. -->
			<span class="announce-words">{announcement.text}</span><span
				class="announce-arrow"
				aria-hidden="true">↗</span
			>
		</a>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{/if}
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
				<a href="https://portal.starforgerobotics.com">Dev Portal</a>
			</li>
			<li>
				<a href={resolve('/blog')} class:active={isBlog} aria-current={isBlog ? 'page' : undefined}
					>Blog</a
				>
			</li>
		</ul>
	</nav>
</div>

<style>
	/* Sits above the nav in the same fixed header, so it reads as part of the
	   chrome rather than as page content that scrolls away. */
	.announce-bar {
		display: block;
		padding: 11px 24px;
		background: var(--accent);
		color: #fdfaf3;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-align: center;
		text-decoration: none;
		transition: background 0.2s ease;
	}

	.announce-bar:hover {
		background: var(--accent-strong);
	}

	/* A full sentence of letter-spaced caps carrying a permanent underline reads
	   as noise, so the rule is held back for hover and keyboard focus and the
	   arrow does the work of signalling that the bar goes somewhere. */
	.announce-bar:hover .announce-words,
	.announce-bar:focus-visible .announce-words {
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
	}

	.announce-arrow {
		display: inline-block;
		font-size: 1.35em;
		line-height: 1;
		vertical-align: -0.06em;
		margin-left: 5px;
		transition: transform 0.2s ease;
	}

	.announce-bar:hover .announce-arrow {
		transform: translate(2px, -2px);
	}

	@media (max-width: 560px) {
		.announce-bar {
			padding: 10px 16px;
			font-size: 9.5px;
			letter-spacing: 0.12em;
		}
	}

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
