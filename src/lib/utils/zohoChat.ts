// Hides the global Zoho SalesIQ float button and its GDPR cookie-consent
// banner (both loaded in app.html) while a route is mounted, restoring them
// on navigation away. Returns a cleanup fn.
export function hideZohoChat(): () => void {
	if (typeof window === 'undefined') return () => {};
	const w = window as unknown as { $zoho?: { salesiq?: { ready?: () => void; floatbutton?: { visible?: (state: 'show' | 'hide') => void } } } };

	const applyHideFloatButton = () => w.$zoho?.salesiq?.floatbutton?.visible?.('hide');

	w.$zoho = w.$zoho || {};
	const prevReady = w.$zoho.salesiq?.ready;
	w.$zoho.salesiq = w.$zoho.salesiq || {};
	w.$zoho.salesiq.ready = () => {
		applyHideFloatButton();
		prevReady?.();
	};
	applyHideFloatButton();

	// The GDPR consent banner (#consent_container > #gdpr_banner) is
	// `position: fixed; bottom: 0`, injected async by the Zoho script on
	// first visit. Fixed-position elements repeat on every page when the
	// deck is printed/exported to PDF, so it must be hidden outright rather
	// than left to its own dismiss flow. A MutationObserver catches it
	// whenever it shows up, since Zoho's script load timing isn't ours to
	// control.
	const hideConsentBanner = () => {
		const banner = document.getElementById('consent_container');
		if (banner && banner.style.display !== 'none') banner.style.display = 'none';
	};
	hideConsentBanner();
	const observer = new MutationObserver(hideConsentBanner);
	observer.observe(document.body, { childList: true });

	return () => {
		w.$zoho?.salesiq?.floatbutton?.visible?.('show');
		if (w.$zoho?.salesiq) w.$zoho.salesiq.ready = prevReady;
		observer.disconnect();
		const banner = document.getElementById('consent_container');
		if (banner) banner.style.display = '';
	};
}
