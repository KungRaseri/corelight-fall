<!-- src/routes/blog/+page.svelte -->
<script lang="ts">
	import BlogListPost from '$lib/components/blog/BlogListPost.svelte';
	import { BookOpen } from 'lucide-svelte';

	const { data } = $props();
</script>

<section class="mx-auto max-w-2xl py-8 px-4">
	<h1 class="mb-8 text-center text-4xl font-extrabold tracking-tight">Blog</h1>
	
	{#if data.posts.length === 0}
		<div class="card preset-glass-surface p-12 text-center">
			<div class="flex justify-center mb-4">
				<BookOpen class="size-16 text-surface-500 dark:text-surface-400" />
			</div>
			<h2 class="text-2xl font-bold mb-3 text-surface-900 dark:text-surface-100">
				No Posts Yet
			</h2>
			<p class="text-surface-700 dark:text-surface-300 mb-6 max-w-md mx-auto">
				The blog is currently empty. Check back soon for exciting stories, updates, and insights about Corelight Fall!
			</p>
			<div class="flex gap-4 justify-center">
				<a href="/" class="btn preset-glass-primary">
					Back to Home
				</a>
				<a href="/game" class="btn preset-glass-primary">
					Play Game
				</a>
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-8">
			{#each data.posts as post}
				<BlogListPost {post} />
			{/each}
		</div>
	{/if}
</section>






