import type { PageLoad } from './$types';
import { shopifyStorefrontFetch } from '$lib/shopify/storefront';
import {
	PUBLIC_SHOPIFY_STORE_DOMAIN,
	PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
	PUBLIC_SHOPIFY_API_VERSION
} from '$env/static/public';

const QUERY = `
  query {
    product(handle: "robot-dev-kit") {
      id
      title
      tags
      featuredImage { url altText }
      images(first: 10) { nodes { url altText } }
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      variants(first: 1) {
        nodes {
          id
          availableForSale
          price { amount currencyCode }
        }
      }
      notification: metafield(namespace: "custom", key: "notification") { value }
      origin: metafield(namespace: "custom", key: "origin") { value }
    }
  }
`;

type ProductQueryData = {
	product: {
		id: string;
		title: string;
		tags: string[];
		featuredImage: { url: string; altText: string | null } | null;
		images: { nodes: Array<{ url: string; altText: string | null }> };
		priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
		variants: {
			nodes: Array<{
				id: string;
				availableForSale: boolean;
				price: { amount: string; currencyCode: string };
			}>;
		};
		notification: { value: string } | null;
		origin: { value: string } | null;
	};
};

// Prebook is the primary conversion path across the site, so a Shopify outage must not
// remove this page from the build. On failure the page renders a contact-only fallback.
export const load: PageLoad = async () => {
	try {
		const data = await shopifyStorefrontFetch<ProductQueryData>({
			storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN,
			accessToken: PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
			apiVersion: PUBLIC_SHOPIFY_API_VERSION,
			query: QUERY
		});

		const { product } = data;
		if (!product) {
			return { product: null, variantId: null, storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN };
		}

		const variantId = product.variants.nodes[0]?.id.split('/').pop() ?? null;

		return {
			product,
			variantId,
			storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN
		};
	} catch (err) {
		console.error('[buildo-prebook] Shopify load failed, rendering fallback:', err);
		return { product: null, variantId: null, storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN };
	}
};
