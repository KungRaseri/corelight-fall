<script lang="ts">
	const { post } = $props();
</script>

<div
	class="bg-surface-800 hover:bg-surface-700 border-surface-700 flex flex-col gap-6 rounded-lg border p-6 shadow-lg transition md:flex-row"
>
	{#if post.coverImage}
		<img
			src={post.coverImage}
			alt={post.title}
			class="mb-4 h-40 w-full rounded object-cover md:mr-6 md:mb-0 md:w-48"
		/>
	{/if}
	<div class="flex flex-1 flex-col">
		<div class="mb-2 flex items-center justify-between">
			<a
				href={`/blog/author/${encodeURIComponent(post.author)}`}
				class="text-primary-400 font-semibold hover:underline"
			>
				{post.author}
			</a>

			<span class="text-xs text-gray-400"
				>{new Date(post.date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: '2-digit'
				})}</span
			>
		</div>
		<h2 class="mb-2 text-2xl font-bold">{post.title}</h2>
		<p class="mb-3 line-clamp-3 text-gray-300">{post.summary}</p>
		{#if post.tags}
			<div class="mb-3 flex flex-wrap gap-2">
				{#each post.tags
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean) as tag}
					<a
						href={`/blog/tag/${encodeURIComponent(tag)}`}
						class="bg-primary-900 text-primary-200 rounded px-2 py-1 text-xs hover:underline"
					>
						{tag}
					</a>
				{/each}
			</div>
		{/if}
		<a href={`/blog/${post.slug}`} class="btn btn-sm btn-primary mt-auto self-start"> Read more </a>
	</div>
</div>
