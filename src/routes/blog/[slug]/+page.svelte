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
	<title>STARFORGE — {data.metadata.title}</title>
	<meta name="description" content={data.metadata.excerpt} />
</svelte:head>

<div class="blog-post-page">
	<div class="blog-hero blog-post-hero">
		<div class="hero-scan-lines"></div>
		<div class="blog-hero-content">
			<a href={resolve('/blog/')} class="blog-back">← All updates</a>
			<div class="blog-post-meta">
				<span class="blog-post-meta-date">{formatDate(data.metadata.date)}</span>
				<span class="blog-post-meta-sep"></span>
				<span class="blog-post-meta-author">{data.metadata.author}</span>
			</div>
			<h1 class="blog-post-title">{data.metadata.title}</h1>
			{#if data.metadata.excerpt}
				<p class="blog-post-excerpt-lead">{data.metadata.excerpt}</p>
			{/if}
		</div>
	</div>

	<div class="blog-post-body">
		<article class="blog-post-article">
			{#if data.content}
				{@const Content = data.content}
				<Content />
			{/if}
		</article>
	</div>
</div>
