type ShopifyGqlError = {
	message: string;
	locations?: { line: number; column: number }[];
	path?: (string | number)[];
	extensions?: Record<string, unknown>;
};

export type ShopifyMoneyV2 = { amount: string; currencyCode: string };

export type RoboDevKitProduct = {
	id: string;
	handle: string;
	title: string;
	description: string;
	seo?: { title?: string | null; description?: string | null } | null;
	featuredImage?: { url: string; altText?: string | null } | null;
	priceRange: {
		minVariantPrice: ShopifyMoneyV2;
		maxVariantPrice: ShopifyMoneyV2;
	};
	variants: {
		nodes: Array<{
			id: string;
			title: string;
			availableForSale: boolean;
			price: ShopifyMoneyV2;
		}>;
	};
};

export async function shopifyStorefrontFetch<TData>({
	storeDomain,
	accessToken,
	apiVersion,
	query,
	variables
}: {
	storeDomain: string;
	accessToken: string;
	apiVersion: string;
	query: string;
	variables?: Record<string, unknown>;
}): Promise<TData> {
	const endpoint = `https://${storeDomain}/api/${apiVersion}/graphql.json`;
	console.log(query)

	const res = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'X-Shopify-Storefront-Access-Token': accessToken
		},
		body: JSON.stringify({ query, variables })
	});

	if (!res.ok) {
		const body = await res.text().catch(() => '');
		throw new Error(`Shopify Storefront API HTTP ${res.status} ${res.statusText}${body ? `: ${body}` : ''}`);
	}

	const json = (await res.json()) as { data?: TData; errors?: ShopifyGqlError[] };
	if (json.errors?.length) {
		throw new Error(`Shopify Storefront API GraphQL error: ${json.errors.map((e) => e.message).join('; ')}`);
	}
	if (!json.data) throw new Error('Shopify Storefront API returned no data');
	return json.data;
}

