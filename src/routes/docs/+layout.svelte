<script lang="ts">
	import './docs.css';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children } = $props();

	const normalizedPath = $derived(page.url.pathname.replace(/\/$/, '') || '/docs');

	type DocsHref =
		| '/docs'
		| '/docs/quickstart'
		| '/docs/ros2-integration'
		| '/docs/api-reference'
		| '/docs/safety-support'
		| '/docs/faq';

	const navGroups: { label: string; items: { href: DocsHref; title: string }[] }[] = [
		{
			label: 'Getting Started',
			items: [
				{ href: '/docs', title: 'Overview' },
				{ href: '/docs/quickstart', title: 'Quickstart' }
			]
		},
		{
			label: 'Guides',
			items: [{ href: '/docs/ros2-integration', title: 'ROS 2 Integration' }]
		},
		{
			label: 'Reference',
			items: [{ href: '/docs/api-reference', title: 'API & SDK Reference' }]
		},
		{
			label: 'Operations',
			items: [{ href: '/docs/safety-support', title: 'Safety & Support' }]
		},
		{
			label: 'Help',
			items: [{ href: '/docs/faq', title: 'FAQ & Troubleshooting' }]
		}
	];

	const flatPages = navGroups.flatMap((group) => group.items);
	const currentIndex = $derived(flatPages.findIndex((item) => item.href === normalizedPath));
	const currentPage = $derived(currentIndex >= 0 ? flatPages[currentIndex] : null);
	const prevPage = $derived(currentIndex > 0 ? flatPages[currentIndex - 1] : null);
	const nextPage = $derived(
		currentIndex >= 0 && currentIndex < flatPages.length - 1 ? flatPages[currentIndex + 1] : null
	);

	// Hand-authored rather than scraped, since the heading set per page is
	// small and fixed — it mirrors each page's own "On this page" anchors.
	type SearchEntry =
		| { kind: 'page'; title: string; base: DocsHref }
		| { kind: 'section'; title: string; base: DocsHref; anchor: string; pageTitle: string };

	const searchIndex: SearchEntry[] = [
		{ kind: 'page', title: 'Overview', base: '/docs' },
		{
			kind: 'section',
			title: 'Documentation',
			base: '/docs',
			anchor: 'sections',
			pageTitle: 'Overview'
		},
		{
			kind: 'section',
			title: 'Getting started',
			base: '/docs',
			anchor: 'start',
			pageTitle: 'Overview'
		},

		{ kind: 'page', title: 'Quickstart', base: '/docs/quickstart' },
		{
			kind: 'section',
			title: 'Before you start',
			base: '/docs/quickstart',
			anchor: 'prereqs',
			pageTitle: 'Quickstart'
		},
		{
			kind: 'section',
			title: 'Connect and check status',
			base: '/docs/quickstart',
			anchor: 'connect',
			pageTitle: 'Quickstart'
		},
		{
			kind: 'section',
			title: 'Your first motion',
			base: '/docs/quickstart',
			anchor: 'first-motion',
			pageTitle: 'Quickstart'
		},

		{ kind: 'page', title: 'ROS 2 Integration', base: '/docs/ros2-integration' },
		{
			kind: 'section',
			title: 'Software stack',
			base: '/docs/ros2-integration',
			anchor: 'stack',
			pageTitle: 'ROS 2 Integration'
		},
		{
			kind: 'section',
			title: 'Robot description',
			base: '/docs/ros2-integration',
			anchor: 'description',
			pageTitle: 'ROS 2 Integration'
		},
		{
			kind: 'section',
			title: 'Coordinate frames',
			base: '/docs/ros2-integration',
			anchor: 'frames',
			pageTitle: 'ROS 2 Integration'
		},
		{
			kind: 'section',
			title: 'Actuator control',
			base: '/docs/ros2-integration',
			anchor: 'control',
			pageTitle: 'ROS 2 Integration'
		},
		{
			kind: 'section',
			title: 'Manipulation: MoveIt 2',
			base: '/docs/ros2-integration',
			anchor: 'moveit',
			pageTitle: 'ROS 2 Integration'
		},
		{
			kind: 'section',
			title: 'Mobile base: Nav2',
			base: '/docs/ros2-integration',
			anchor: 'nav2',
			pageTitle: 'ROS 2 Integration'
		},
		{
			kind: 'section',
			title: 'Simulation',
			base: '/docs/ros2-integration',
			anchor: 'sim',
			pageTitle: 'ROS 2 Integration'
		},

		{ kind: 'page', title: 'API & SDK Reference', base: '/docs/api-reference' },
		{
			kind: 'section',
			title: 'Conventions',
			base: '/docs/api-reference',
			anchor: 'conventions',
			pageTitle: 'API & SDK Reference'
		},
		{
			kind: 'section',
			title: 'Topics',
			base: '/docs/api-reference',
			anchor: 'topics',
			pageTitle: 'API & SDK Reference'
		},
		{
			kind: 'section',
			title: 'Services & actions',
			base: '/docs/api-reference',
			anchor: 'services',
			pageTitle: 'API & SDK Reference'
		},
		{
			kind: 'section',
			title: 'Message definitions',
			base: '/docs/api-reference',
			anchor: 'messages',
			pageTitle: 'API & SDK Reference'
		},
		{
			kind: 'section',
			title: 'SDK quickstart',
			base: '/docs/api-reference',
			anchor: 'sdk',
			pageTitle: 'API & SDK Reference'
		},
		{
			kind: 'section',
			title: 'Parameters & versioning',
			base: '/docs/api-reference',
			anchor: 'params',
			pageTitle: 'API & SDK Reference'
		},

		{ kind: 'page', title: 'Safety & Support', base: '/docs/safety-support' },
		{
			kind: 'section',
			title: 'Safety systems',
			base: '/docs/safety-support',
			anchor: 'safety',
			pageTitle: 'Safety & Support'
		},
		{
			kind: 'section',
			title: 'Diagnostics',
			base: '/docs/safety-support',
			anchor: 'diagnostics',
			pageTitle: 'Safety & Support'
		},
		{
			kind: 'section',
			title: 'Firmware updates',
			base: '/docs/safety-support',
			anchor: 'firmware',
			pageTitle: 'Safety & Support'
		},
		{
			kind: 'section',
			title: 'Support & resources',
			base: '/docs/safety-support',
			anchor: 'support',
			pageTitle: 'Safety & Support'
		},

		{ kind: 'page', title: 'FAQ & Troubleshooting', base: '/docs/faq' },
		{
			kind: 'section',
			title: 'Connectivity',
			base: '/docs/faq',
			anchor: 'connectivity',
			pageTitle: 'FAQ & Troubleshooting'
		},
		{
			kind: 'section',
			title: 'Motion & control',
			base: '/docs/faq',
			anchor: 'motion',
			pageTitle: 'FAQ & Troubleshooting'
		},
		{
			kind: 'section',
			title: 'Simulation',
			base: '/docs/faq',
			anchor: 'sim',
			pageTitle: 'FAQ & Troubleshooting'
		},
		{
			kind: 'section',
			title: 'Firmware & versioning',
			base: '/docs/faq',
			anchor: 'firmware',
			pageTitle: 'FAQ & Troubleshooting'
		}
	];

	function hrefFor(entry: SearchEntry): string {
		const base = resolve(entry.base);
		return entry.kind === 'section' ? `${base}#${entry.anchor}` : base;
	}

	let searchQuery = $state('');
	let searchFocused = $state(false);
	let activeResultIndex = $state(0);
	let searchInputEl: HTMLInputElement | undefined = $state();
	let modKeyLabel = $state('Ctrl');

	const searchResults = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return [];
		const pages = searchIndex.filter((e) => e.kind === 'page' && e.title.toLowerCase().includes(q));
		const sections = searchIndex.filter(
			(e) => e.kind === 'section' && e.title.toLowerCase().includes(q)
		);
		return [...pages, ...sections].slice(0, 8);
	});

	const showResults = $derived(searchFocused && searchQuery.trim().length > 0);

	$effect(() => {
		void searchResults;
		activeResultIndex = 0;
	});

	function closeSearch() {
		searchQuery = '';
		searchFocused = false;
		activeResultIndex = 0;
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeSearch();
			searchInputEl?.blur();
			return;
		}
		if (!searchResults.length) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeResultIndex = (activeResultIndex + 1) % searchResults.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeResultIndex = (activeResultIndex - 1 + searchResults.length) % searchResults.length;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const result = searchResults[activeResultIndex];
			if (result) {
				// hrefFor() always resolves through resolve() internally; the lint
				// rule can't see through the wrapper.
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				goto(hrefFor(result));
				closeSearch();
			}
		}
	}

	function handleGlobalKeydown(e: KeyboardEvent) {
		const target = e.target as HTMLElement | null;
		const isTyping =
			!!target &&
			(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

		if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			searchInputEl?.focus();
			searchInputEl?.select();
		} else if (e.key === '/' && !isTyping) {
			e.preventDefault();
			searchInputEl?.focus();
		}
	}

	let navOpen = $state(false);

	let stopScrollSpy: (() => void) | null = null;

	function setupScrollSpy() {
		stopScrollSpy?.();
		stopScrollSpy = null;

		const headings = Array.from(
			document.querySelectorAll<HTMLElement>('.docs-content :is(h2, h3)[id]')
		);
		const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.docs-toc a'));
		if (!headings.length || !links.length) return;

		const linkByTarget = new Map(links.map((a) => [a.getAttribute('href')?.slice(1), a]));

		let ticking = false;
		const offset = 150;

		function update() {
			ticking = false;
			let activeId: string | null = null;
			for (const heading of headings) {
				if (heading.getBoundingClientRect().top - offset <= 0) {
					activeId = heading.id;
				} else {
					break;
				}
			}
			for (const link of links) link.classList.remove('active');
			if (activeId) linkByTarget.get(activeId)?.classList.add('active');
		}

		function onScroll() {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(update);
		}

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		stopScrollSpy = () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}

	// Code blocks are authored as plain <pre><code> in each page's markup, so
	// the copy button is injected here once per block rather than touching
	// every page.
	function setupCodeCopyButtons() {
		const blocks = document.querySelectorAll<HTMLPreElement>(
			'.docs-content pre:not([data-copy-ready])'
		);
		blocks.forEach((pre) => {
			pre.setAttribute('data-copy-ready', 'true');
			const code = pre.querySelector('code');
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'docs-copy-btn';
			button.textContent = 'Copy';
			button.addEventListener('click', () => {
				const text = code?.textContent ?? pre.textContent ?? '';
				navigator.clipboard
					.writeText(text)
					.then(() => {
						button.textContent = 'Copied';
						button.classList.add('is-copied');
					})
					.catch(() => {
						button.textContent = 'Failed';
					})
					.finally(() => {
						setTimeout(() => {
							button.textContent = 'Copy';
							button.classList.remove('is-copied');
						}, 1600);
					});
			});
			pre.appendChild(button);
		});
	}

	onMount(() => {
		setupScrollSpy();
		setupCodeCopyButtons();
		modKeyLabel = navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl';
		window.addEventListener('keydown', handleGlobalKeydown);
		return () => {
			stopScrollSpy?.();
			window.removeEventListener('keydown', handleGlobalKeydown);
		};
	});

	afterNavigate(() => {
		navOpen = false;
		closeSearch();
		setupScrollSpy();
		setupCodeCopyButtons();
	});
</script>

<div class="docs-shell">
	<div class="docs-mobile-bar">
		<button
			type="button"
			class="docs-nav-toggle"
			aria-expanded={navOpen}
			aria-controls="docs-nav"
			onclick={() => (navOpen = !navOpen)}
		>
			<span class="docs-nav-toggle-icon" aria-hidden="true"></span>
			Menu
		</button>
		<span class="docs-mobile-title">Documentation</span>
	</div>

	{#if navOpen}
		<button
			type="button"
			class="docs-nav-backdrop"
			aria-label="Close menu"
			onclick={() => (navOpen = false)}
		></button>
	{/if}

	<aside class="docs-nav" id="docs-nav" class:open={navOpen} aria-label="Documentation sections">
		<nav class="docs-nav-inner">
			<div class="docs-search">
				<input
					bind:this={searchInputEl}
					bind:value={searchQuery}
					type="search"
					class="docs-search-input"
					placeholder="Search docs"
					role="combobox"
					aria-expanded={showResults}
					aria-controls="docs-search-results"
					aria-autocomplete="list"
					autocomplete="off"
					onkeydown={handleSearchKeydown}
					onfocus={() => (searchFocused = true)}
					onblur={() => setTimeout(() => (searchFocused = false), 120)}
				/>
				{#if !searchFocused && !searchQuery}
					<kbd class="docs-search-kbd">{modKeyLabel} K</kbd>
				{/if}
				{#if showResults}
					{#if searchResults.length > 0}
						<ul class="docs-search-results" id="docs-search-results" role="listbox">
							{#each searchResults as result, i (hrefFor(result))}
								<li role="option" aria-selected={i === activeResultIndex}>
									<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
									<a href={hrefFor(result)} class:active={i === activeResultIndex}>
										<span class="docs-search-result-title">{result.title}</span>
										{#if result.kind === 'section'}
											<span class="docs-search-result-page">{result.pageTitle}</span>
										{/if}
									</a>
								</li>
							{/each}
						</ul>
					{:else}
						<div class="docs-search-empty">No results for "{searchQuery}"</div>
					{/if}
				{/if}
			</div>

			{#each navGroups as group (group.label)}
				<div class="docs-nav-group">
					<span class="docs-nav-group-label">{group.label}</span>
					{#each group.items as item (item.href)}
						<a
							href={resolve(item.href)}
							class:active={normalizedPath === item.href}
							aria-current={normalizedPath === item.href ? 'page' : undefined}>{item.title}</a
						>
					{/each}
				</div>
			{/each}
		</nav>
	</aside>

	<div class="docs-main">
		{#if currentPage}
			<div class="docs-breadcrumb">
				<a href={resolve('/docs')}>Docs</a>
				<span aria-hidden="true">/</span>
				<span>{currentPage.title}</span>
			</div>
		{/if}

		{@render children()}

		<nav class="docs-prevnext" aria-label="Page navigation">
			{#if prevPage}
				<a class="docs-prevnext-link is-prev" href={resolve(prevPage.href)}>
					<span class="docs-prevnext-dir">&larr; Previous</span>
					<span class="docs-prevnext-title">{prevPage.title}</span>
				</a>
			{:else}
				<span></span>
			{/if}
			{#if nextPage}
				<a class="docs-prevnext-link is-next" href={resolve(nextPage.href)}>
					<span class="docs-prevnext-dir">Next &rarr;</span>
					<span class="docs-prevnext-title">{nextPage.title}</span>
				</a>
			{/if}
		</nav>
	</div>
</div>
