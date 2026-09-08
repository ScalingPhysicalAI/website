import { redirect } from '@sveltejs/kit';

// The team page is hidden for now. The component is kept so it can be restored
// by deleting this file; until then every visit lands on the homepage.
export function load() {
	redirect(308, '/');
}
