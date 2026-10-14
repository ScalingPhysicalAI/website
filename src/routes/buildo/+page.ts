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
          sellingPlanAllocations(first: 5) {
            nodes {
              sellingPlan {
                id
                name
                description
              }
              priceAdjustments {
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
              }
            }
          }
        }
      }
      origin: metafield(namespace: "custom", key: "origin") { value }
    }
  }
`;

type Money = { amount: string; currencyCode: string };

type ProductQueryData = {
	product: {
		id: string;
		title: string;
		tags: string[];
		featuredImage: { url: string; altText: string | null } | null;
		images: { nodes: Array<{ url: string; altText: string | null }> };
		priceRange: { minVariantPrice: Money };
		variants: {
			nodes: Array<{
				id: string;
				availableForSale: boolean;
				price: Money;
				sellingPlanAllocations: {
					nodes: Array<{
						sellingPlan: { id: string; name: string; description: string | null };
						priceAdjustments: Array<{ price: Money; compareAtPrice: Money }>;
					}>;
				};
			}>;
		};
		origin: { value: string } | null;
	};
};

export type BuildoSellingPlan = {
	id: string;
	name: string;
	description: string | null;
	// Steady-state recurring price (e.g. the $600/mo from the 2nd order onward).
	price: Money;
	compareAtPrice: Money | null;
	// Set only when the first order is priced differently from the recurring
	// price - e.g. Appstle bundles a one-time $1,000 security fee into the
	// first month's charge, so order 1 is $1,600 while every order after is $600.
	firstOrderPrice: Money | null;
};

// Preorder leads the Buildo page and is the primary conversion path across the site,
// so a Shopify outage must not remove the page from the build. On failure the product
// block renders a contact-only fallback and the rest of the page is unaffected.
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
			return {
				product: null,
				variantId: null,
				sellingPlans: [] as BuildoSellingPlan[],
				storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN
			};
		}

		const variant = product.variants.nodes[0];
		const variantId = variant?.id.split('/').pop() ?? null;

		// Appstle creates these as native Shopify selling plans, so the monthly
		// subscription option - and its price - comes straight from the
		// Storefront API rather than being hand-maintained here. Appstle returns
		// one priceAdjustments entry per order count: the first order bundles in
		// a one-time $1,000 security fee, every order after is the plain
		// recurring price - so the *last* entry is the steady-state "/mo" price.
		const sellingPlans: BuildoSellingPlan[] = (variant?.sellingPlanAllocations.nodes ?? []).map(
			(allocation) => {
				const adjustments = allocation.priceAdjustments;
				const recurring = adjustments[adjustments.length - 1] ?? null;
				const firstOrder = adjustments.length > 1 ? adjustments[0] : null;
				return {
					id: allocation.sellingPlan.id.split('/').pop() ?? allocation.sellingPlan.id,
					name: allocation.sellingPlan.name,
					description: allocation.sellingPlan.description,
					price: recurring?.price ?? variant.price,
					compareAtPrice: recurring?.compareAtPrice ?? null,
					firstOrderPrice:
						firstOrder && firstOrder.price.amount !== recurring?.price.amount
							? firstOrder.price
							: null
				};
			}
		);

		return {
			product,
			variantId,
			sellingPlans,
			storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN
		};
	} catch (err) {
		console.error('[buildo] Shopify load failed, rendering fallback:', err);
		return {
			product: null,
			variantId: null,
			sellingPlans: [] as BuildoSellingPlan[],
			storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN
		};
	}
};
