<script lang="ts">
	import { onMount } from 'svelte';
	import { setupRevealObserver } from '$lib/utils/reveal';
	import { postsByDate, formatPostDate } from '$lib/data/posts';

	onMount(() => {
		return setupRevealObserver({ threshold: 0.1 });
	});
</script>

<svelte:head>
	<title>Blog - Starforge</title>
	<meta
		name="description"
		content="News and writing from Starforge Robotics on Buildo, physical AI, and the intelligence layer for robotics."
	/>
</svelte:head>

<div class="blog-scan" aria-hidden="true"></div>

<section class="blog">
	<header class="blog-head">
		<span class="section-label">Blog</span>
		<h1 class="blog-title">News &amp; <span>updates</span></h1>
		<p class="blog-intro">
			Announcements and writing on Buildo, physical AI, and the intelligence layer we are building
			for robots.
		</p>
	</header>

	<ul class="blog-list">
		{#each postsByDate as post, i (post.slug)}
			<li class="blog-item reveal" style="transition-delay:{0.06 * i}s">
				<article>
					<div class="blog-meta">
						<span class="blog-category">{post.category}</span>
						<time datetime={post.date}>{formatPostDate(post.date)}</time>
					</div>
					<h2 class="blog-post-title">
						<!-- Built from the slug rather than a typed route so a new post only
						     needs an entry in the post list. -->
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a href="/blog/{post.slug}/">{post.title}</a>
					</h2>
					<p class="blog-dek">{post.dek}</p>
					<span class="blog-more" aria-hidden="true"
						>Read more<span class="blog-more-arrow">→</span></span
					>
				</article>
			</li>
		{/each}
	</ul>
</section>

<style>
	.blog-scan {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 3px,
			rgba(0, 0, 0, 0.036) 3px,
			rgba(0, 0, 0, 0.036) 4px
		);
	}

	.blog {
		position: relative;
		z-index: 1;
		max-width: 860px;
		margin: 0 auto;
		/* Long enough that a single-post list still fills the screen and the
		   footer does not ride up under the heading. */
		min-height: 78vh;
		padding: calc(var(--header-height, 96px) + 44px) 48px 72px;
	}

	.blog-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(34px, 4.6vw, 54px);
		font-weight: 400;
		letter-spacing: 0.04em;
		line-height: 1;
		color: var(--ink);
	}

	.blog-title span {
		color: var(--accent);
	}

	.blog-intro {
		max-width: 54ch;
		margin-top: 16px;
		font-size: clamp(15px, 1.5vw, 17px);
		font-weight: 500;
		line-height: 1.7;
		color: rgba(20, 18, 16, 0.82);
	}

	/* ── LIST ── */
	/* Rules between entries rather than cards: with one post a card would read
	   as a stray box, and the rules scale cleanly as posts are added. */
	.blog-list {
		margin-top: 34px;
		list-style: none;
		border-top: 1px solid var(--border);
	}

	.blog-item {
		border-bottom: 1px solid var(--border);
	}

	.blog-item article {
		padding: 30px 0;
		transition: transform 0.25s ease;
	}

	.blog-item:hover article {
		transform: translateX(4px);
	}

	.blog-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 14px;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.blog-category {
		color: var(--accent);
	}

	.blog-post-title {
		margin-top: 14px;
		font-size: clamp(22px, 2.8vw, 30px);
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: -0.01em;
	}

	.blog-post-title a {
		color: var(--ink);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	/* The heading link is the target, so its hit area is stretched over the whole
	   row and the underline is held for hover rather than sitting there by
	   default on a multi-line title. */
	.blog-post-title a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.blog-item article {
		position: relative;
	}

	.blog-post-title a:hover,
	.blog-item:hover .blog-post-title a {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 5px;
		text-decoration-thickness: 1px;
	}

	.blog-dek {
		max-width: 68ch;
		margin-top: 12px;
		font-size: clamp(15px, 1.5vw, 17px);
		font-weight: 500;
		line-height: 1.65;
		color: var(--text-muted);
	}

	.blog-more {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 18px;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 10.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.blog-more-arrow {
		transition: transform 0.2s ease;
	}

	.blog-item:hover .blog-more-arrow {
		transform: translateX(4px);
	}

	@media (max-width: 760px) {
		.blog {
			padding: calc(var(--header-height, 96px) + 36px) 24px 56px;
		}

		.blog-list {
			margin-top: 36px;
		}
	}
</style>
