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
                billingPolicy {
                  ... on SellingPlanRecurringBillingPolicy {
                    interval
                    intervalCount
                  }
                }
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
						sellingPlan: {
							id: string;
							name: string;
							description: string | null;
							billingPolicy: { interval?: string; intervalCount?: number } | null;
						};
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
	// Steady-state recurring price, already expressed per month (e.g. $600/mo
	// for a plan actually billed $1,800 every 3 months).
	price: Money;
	compareAtPrice: Money | null;
	// Set only when the first order is priced differently from the recurring
	// price - e.g. Appstle bundles a one-time $1,000 security fee into the
	// first month's charge, so order 1 is $1,600 while every order after is $600.
	firstOrderPrice: Money | null;
	// Number of months in one billing cycle (e.g. 3 for "every 3 months", 12 for yearly).
	// Used to derive the actual cycle total charged: price * intervalMonths.
	intervalMonths: number;
	// Human label for the billing cadence, e.g. "every 3 months", "yearly".
	billingLabel: string;
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

		// Appstle creates these as native Shopify selling plans, so the subscription
		// options - and their prices - come straight from the Storefront API rather
		// than being hand-maintained here. Appstle returns one priceAdjustments entry
		// per order count: the first order bundles in a one-time security fee, every
		// order after is the plain recurring charge - so the *last* entry is the
		// override price. But the *units* of that override differ from the no-override
		// fallback: when Appstle sets an adjustment, Shopify prices it for the whole
		// billing cycle (e.g. $3,240 billed every 6 months); when there's no adjustment,
		// the plan falls back to the variant's own price, which is already a monthly
		// rate (e.g. $600/mo, billed every 3 months as 600 x 3 = $1,800). Normalize both
		// down to a monthly rate here so the rest of the app only ever deals in "/mo".
		const sellingPlans: BuildoSellingPlan[] = (variant?.sellingPlanAllocations.nodes ?? []).map(
			(allocation) => {
				const adjustments = allocation.priceAdjustments;
				const recurring = adjustments[adjustments.length - 1] ?? null;
				const firstOrder = adjustments.length > 1 ? adjustments[0] : null;

				const policy = allocation.sellingPlan.billingPolicy;
				const intervalCount = policy?.intervalCount ?? 1;
				const intervalMonths =
					policy?.interval === 'YEAR'
						? intervalCount * 12
						: policy?.interval === 'WEEK'
							? Math.max(1, Math.round(intervalCount / 4.345))
							: intervalCount;
				const billingLabel =
					policy?.interval === 'YEAR' && intervalCount === 1
						? 'yearly'
						: `every ${intervalCount} ${(policy?.interval ?? 'MONTH').toLowerCase()}${intervalCount > 1 ? 's' : ''}`;

				// Only an explicit adjustment is priced per full cycle - the variant
				// price fallback is already monthly, so leave it alone.
				const toMonthly = (money: Money): Money =>
					recurring
						? { amount: String(Number(money.amount) / intervalMonths), currencyCode: money.currencyCode }
						: money;

				const price = toMonthly(recurring?.price ?? variant.price);
				const compareAtPrice = recurring?.compareAtPrice ? toMonthly(recurring.compareAtPrice) : null;
				const firstOrderPrice =
					firstOrder && firstOrder.price.amount !== recurring?.price.amount
						? toMonthly(firstOrder.price)
						: null;

				return {
					id: allocation.sellingPlan.id.split('/').pop() ?? allocation.sellingPlan.id,
					name: allocation.sellingPlan.name,
					description: allocation.sellingPlan.description,
					price,
					compareAtPrice,
					firstOrderPrice,
					intervalMonths,
					billingLabel
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
