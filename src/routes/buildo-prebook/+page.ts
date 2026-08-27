import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import type { PageLoad } from './$types';

// Preordering folded into the Buildo page, so this old address points there. The stub
// stays behind so links already shared under the old address keep working; the
// prerenderer turns it into a redirect page in the static build.
export const prerender = true;

export const load: PageLoad = () => {
	redirect(308, resolve('/buildo'));
};
