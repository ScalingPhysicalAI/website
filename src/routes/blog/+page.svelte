<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>STARFORGE — Updates</title>
	<meta name="description" content="Insights on Physical AI, space manufacturing, and the future of launch infrastructure." />
</svelte:head>

<div class="blog-list-page">
	<div class="blog-hero">
		<div class="hero-scan-lines"></div>
		<div class="blog-hero-content">
			<span class="hero-tag">Starforge — Updates</span>
			<h1 class="hero-title">Updates</h1>
		</div>
	</div>

	<section class="blog-list-section">
		<div class="blog-list-grid">
			{#each data.posts as post}
				<a href={resolve(`/blog/${post.slug}/`)} class="blog-card">
					<div class="blog-card-date">{formatDate(post.date)}</div>
					<h2 class="blog-card-title">{post.title}</h2>
					<p class="blog-card-excerpt">{post.excerpt}</p>
					<div class="blog-card-footer">
						<span class="blog-card-author">{post.author}</span>
						<span class="blog-card-arrow">→</span>
					</div>
				</a>
			{/each}
		</div>
	</section>
</div>
