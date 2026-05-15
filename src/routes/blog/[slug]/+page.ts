import { error } from '@sveltejs/kit';
import type { PageLoad, EntryGenerator } from './$types';

const posts = import.meta.glob('/src/lib/content/blog/*.md');

export const entries: EntryGenerator = () => {
	return Object.keys(posts).map((path) => ({
		slug: path.split('/').at(-1)!.replace('.md', '')
	}));
};

export const load: PageLoad = async ({ params }) => {
	const path = `/src/lib/content/blog/${params.slug}.md`;
	if (!posts[path]) throw error(404, 'Post not found');

	const mod = (await posts[path]()) as any;
	return {
		content: mod.default,
		metadata: mod.metadata as Record<string, string>
	};
};
