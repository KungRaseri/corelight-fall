<script lang="ts">
	import BlogListPost from '$lib/components/blog/BlogListPost.svelte';

	const { data } = $props();
</script>

<section class="mx-auto max-w-2xl py-8">
	<h1 class="mb-8 text-center text-3xl font-extrabold tracking-tight">
		Posts tagged <span class="text-primary-400">"{data.tag}"</span>
	</h1>
	<div class="flex flex-col gap-8">
		{#each data.posts as post}
			<BlogListPost {post} />
		{/each}
	</div>
</section>
