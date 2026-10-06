<script lang="ts">
	import { env } from '$env/dynamic/public';

	// GoAffPro is opt-in: with no shop key configured this renders nothing, so
	// local/dev builds and forks never register affiliate hits. The loader
	// itself auto-detects `?ref=` on whatever page it's running on and sets its
	// cookie, which is why it needs to load on every page of this storefront,
	// not just the Shopify-hosted cart/checkout.
	const rawKey = (env.PUBLIC_GOAFFPRO_SHOP_KEY ?? '').trim();
	const shopKey = /^[A-Za-z0-9._-]+$/.test(rawKey) ? rawKey : '';
</script>

<svelte:head>
	{#if shopKey}
		<script defer src={`https://api.goaffpro.com/loader.js?shop=${shopKey}`}></script>
	{/if}
</svelte:head>
