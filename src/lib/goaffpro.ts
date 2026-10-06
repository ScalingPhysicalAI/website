// GoAffPro's own loader.js sets its attribution cookie scoped to whatever
// domain it runs on. Our product pages live on this site's domain, but the
// cart/checkout the customer is sent to lives on the Shopify domain - a
// separate origin that can't read that cookie. So we capture the referral
// code ourselves and forward it as a `ref` query param on the outbound cart
// link, letting GoAffPro's script (already installed on the Shopify side)
// re-attribute it there exactly as it would for direct traffic.
//
// Param name matches GoAffPro's default referral link style. If the GoAffPro
// dashboard (Program Settings -> Referral Link Configuration) has been
// changed to a different identifier, update REF_PARAM to match.
const REF_PARAM = 'ref';
const STORAGE_KEY = 'goaffpro_ref';

export function captureReferral(url: URL): void {
	if (typeof window === 'undefined') return;
	const ref = url.searchParams.get(REF_PARAM);
	if (!ref) return;
	try {
		localStorage.setItem(STORAGE_KEY, ref);
	} catch {
		// Storage unavailable (private browsing, etc.) - attribution is best-effort.
	}
}

export function getReferral(): string | null {
	if (typeof window === 'undefined') return null;
	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}

export function withReferral(url: string): string {
	const ref = getReferral();
	if (!ref) return url;
	const u = new URL(url);
	u.searchParams.set(REF_PARAM, ref);
	return u.toString();
}
