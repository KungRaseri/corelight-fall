<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
	const { data } = $props();
</script>

<article
	class="prose prose-invert bg-surface-900 mx-auto mt-5 max-w-3xl rounded-lg px-4 py-10 shadow-lg"
>
	{#if data.post.coverImage}
		<img
			src={data.post.coverImage}
			alt={data.post.title}
			class="mb-6 max-h-80 w-full rounded-lg object-cover shadow"
		/>
	{/if}

	<h1 class="mb-2 text-4xl font-extrabold">{data.post.title}</h1>
	<div class="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
		<span>
			{new Date(data.post.date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}
		</span>
		{#if data.post.author}
			<span>•</span>
			<a
				href={`/blog/author/${encodeURIComponent(data.post.author)}`}
				class="text-primary-400 font-semibold hover:underline"
			>
				{data.post.author}
			</a>
		{/if}
		{#if data.post.tags}
			<span>•</span>
			<div class="flex flex-wrap gap-2">
				{#each data.post.tags
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean) as tag}
					<a
						href={`/blog/tag/${encodeURIComponent(tag)}`}
						class="bg-primary-900 text-primary-200 rounded px-2 py-1 text-xs hover:underline"
					>
						#{tag}
					</a>
				{/each}
			</div>
		{/if}
	</div>

	{@html data.post.html}
</article>
