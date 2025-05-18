<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
	const { data } = $props();
</script>

<article class="prose prose-invert mx-auto max-w-3xl">
	<h1>{data.post.title}</h1>
	<div class="mb-4 text-sm text-gray-400">{data.post.date}</div>
	{@html data.post.content}
</article>
