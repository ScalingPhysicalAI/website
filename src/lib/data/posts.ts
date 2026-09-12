/** One entry per post. Adding a post means adding a record here and a matching
 *  `src/routes/blog/<slug>/+page.svelte`; the index builds itself from this
 *  list, newest first. */
export type Post = {
	slug: string;
	title: string;
	dek: string;
	/** ISO date, used for both sorting and the displayed dateline. */
	date: string;
	category: string;
};

export const posts: Post[] = [
	{
		slug: 'pre-seed',
		title:
			'Starforge Robotics raises $500,000 pre-seed to build affordable, intelligent humanoid robots',
		dek: "Funding will accelerate the development and deployment of Buildo, Starforge Robotics' $10,000 open-source humanoid robot and physical intelligence platform.",
		date: '2026-09-11',
		category: 'Announcement'
	}
];

/** Newest first, so the list order never depends on the order of the array. */
export const postsByDate: Post[] = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export function formatPostDate(date: string): string {
	// Parsed as UTC and formatted as UTC so the date cannot slide a day either
	// way depending on the reader's timezone.
	return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}
