import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import type { PageLoad } from './$types';

// The page moved to /plan. This address was already shared, so it stays as a
// redirect; the prerenderer turns it into a redirect page in the static build.
export const prerender = true;

export const load: PageLoad = () => {
	redirect(308, resolve('/plan'));
};
