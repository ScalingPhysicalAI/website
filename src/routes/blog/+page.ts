import type { PageLoad } from './$types';

interface PostMeta {
	slug: string;
	title: string;
	date: string;
	author: string;
	excerpt: string;
}

export const load: PageLoad = async () => {
	const modules = import.meta.glob('/src/lib/content/blog/*.md', { eager: true });

	const posts: PostMeta[] = Object.entries(modules).map(([path, mod]: [string, any]) => {
		const slug = path.split('/').at(-1)!.replace('.md', '');
		return { slug, ...(mod.metadata as Omit<PostMeta, 'slug'>) };
	});

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
};
