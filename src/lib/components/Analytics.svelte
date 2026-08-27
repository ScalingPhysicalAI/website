<script lang="ts">
	import { env } from '$env/dynamic/public';

	// Analytics is opt-in: with nothing configured this renders no script at all,
	// so local builds and forks never report into the production numbers. The
	// provider is a setting rather than a hard-coded vendor because the choice is
	// easy to get wrong the first time and switching should not need a code change.
	const provider = (env.PUBLIC_ANALYTICS_PROVIDER ?? '').trim().toLowerCase();
	const rawSiteId = (env.PUBLIC_ANALYTICS_SITE_ID ?? '').trim();
	const host = (env.PUBLIC_ANALYTICS_HOST ?? '').trim().replace(/\/+$/, '');

	// The id lands in an attribute, and depending on provider it is a UUID, a bare
	// domain or a hex token. Anything outside that shape is treated as misconfigured
	// rather than interpolated, so a malformed value cannot inject markup.
	const siteId = /^[A-Za-z0-9._-]+$/.test(rawSiteId) ? rawSiteId : '';

	type Tracker = { src: string; attrs: Record<string, string> };

	function tracker(): Tracker | null {
		if (!siteId) return null;

		switch (provider) {
			case 'umami':
				return {
					src: `${host || 'https://cloud.umami.is'}/script.js`,
					attrs: { 'data-website-id': siteId }
				};
			case 'plausible':
				return {
					src: `${host || 'https://plausible.io'}/js/script.js`,
					attrs: { 'data-domain': siteId }
				};
			case 'cloudflare':
				return {
					src: 'https://static.cloudflareinsights.com/beacon.min.js',
					attrs: { 'data-cf-beacon': JSON.stringify({ token: siteId }) }
				};
			default:
				return null;
		}
	}

	const t = tracker();
</script>

<svelte:head>
	{#if t}
		<!-- Umami and Plausible both hook the History API, so SvelteKit's client-side
		     navigations are counted without any manual pageview calls. Both also
		     ignore localhost by default. -->
		<script defer src={t.src} {...t.attrs}></script>
	{/if}
</svelte:head>
