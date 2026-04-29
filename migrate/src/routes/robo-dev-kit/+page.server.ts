import { error, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { shopifyStorefrontFetch, type RoboDevKitProduct } from '$lib/shopify/storefront';
import type { Actions } from './$types';

const PRODUCT_HANDLE = 'robo-dev-kit';

function requiredEnv(name: keyof typeof env): string {
	const v = env[name];
	if (!v) throw new Error(`Missing required environment variable: ${String(name)}`);
	return v;
}

export async function load() {
	const storeDomain = requiredEnv('SHOPIFY_STORE_DOMAIN');
	const accessToken = requiredEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN');
	const apiVersion = env.SHOPIFY_API_VERSION ?? '2025-01';

	const data = await shopifyStorefrontFetch<{
		productByHandle: RoboDevKitProduct | null;
	}>({
		storeDomain,
		accessToken,
		apiVersion,
		query: /* GraphQL */ `
			query RoboDevKit($handle: String!) {
				productByHandle(handle: $handle) {
					id
					handle
					title
					description
					seo {
						title
						description
					}
					featuredImage {
						url
						altText
					}
					priceRange {
						minVariantPrice {
							amount
							currencyCode
						}
						maxVariantPrice {
							amount
							currencyCode
						}
					}
					variants(first: 10) {
						nodes {
							id
							title
							availableForSale
							price {
								amount
								currencyCode
							}
						}
					}
				}
			}
		`,
		variables: { handle: PRODUCT_HANDLE }
	});

	return {
		product: data.productByHandle,
		productHandle: PRODUCT_HANDLE
	};
}

export const actions: Actions = {
	addToCart: async ({ request }) => {
		const storeDomain = requiredEnv('SHOPIFY_STORE_DOMAIN');
		const accessToken = requiredEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN');
		const apiVersion = env.SHOPIFY_API_VERSION ?? '2025-01';

		const form = await request.formData();
		const variantId = String(form.get('variantId') ?? '');
		const quantityRaw = String(form.get('quantity') ?? '1');
		const quantity = Math.max(1, Math.min(99, Number.parseInt(quantityRaw, 10) || 1));

		if (!variantId) throw error(400, 'Missing variantId');

		const data = await shopifyStorefrontFetch<{
			cartCreate: {
				cart: { checkoutUrl: string } | null;
				userErrors: Array<{ field: string[] | null; message: string }>;
			};
		}>({
			storeDomain,
			accessToken,
			apiVersion,
			query: /* GraphQL */ `
				mutation CreateCart($lines: [CartLineInput!]!) {
					cartCreate(input: { lines: $lines }) {
						cart {
							checkoutUrl
						}
						userErrors {
							field
							message
						}
					}
				}
			`,
			variables: {
				lines: [{ merchandiseId: variantId, quantity }]
			}
		});

		const userError = data.cartCreate.userErrors?.[0];
		if (userError) throw error(400, userError.message);
		const checkoutUrl = data.cartCreate.cart?.checkoutUrl;
		if (!checkoutUrl) throw error(500, 'Cart created without checkoutUrl');

		throw redirect(303, checkoutUrl);
	}
};

