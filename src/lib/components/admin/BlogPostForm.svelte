<script lang="ts">
	import type { BlogPostFormData } from '$lib/types/BlogPostFormData';

	export let post: BlogPostFormData = {
		id: -1,
		title: '',
		slug: '',
		summary: '',
		date: '',
		author: '',
		markdown: '',
		tags: '',
		published: true,
		coverImage: '',
		createdAt: '',
		updatedAt: ''
	};
	export let onSave: (post: BlogPostFormData) => void;
	export let loading = false;

	let error = '';
</script>

<form class="mx-auto max-w-2xl space-y-4" on:submit|preventDefault={() => onSave(post)}>
	<div>
		<label class="block font-semibold" for="title">Title</label>
		<input class="input w-full" id="title" name="title" bind:value={post.title} required />
	</div>
	<div>
		<label class="block font-semibold" for="slug">Slug</label>
		<input class="input w-full" id="slug" name="slug" bind:value={post.slug} required />
	</div>
	<div>
		<label class="block font-semibold" for="summary">Summary</label>
		<textarea class="input w-full" id="summary" name="summary" bind:value={post.summary} rows="2">
		</textarea>
	</div>
	<div>
		<label class="block font-semibold" for="date">Date</label>
		<input class="input w-full" id="date" name="date" type="date" bind:value={post.date} required />
	</div>
	<div>
		<label class="block font-semibold" for="author">Author</label>
		<input class="input w-full" id="author" name="author" bind:value={post.author} />
	</div>
	<div>
		<label class="block font-semibold" for="tags">Tags (comma separated)</label>
		<input class="input w-full" id="tags" name="tags" bind:value={post.tags} />
	</div>
	<div>
		<label class="block font-semibold" for="coverImage">Cover Image URL</label>
		<input class="input w-full" id="coverImage" name="coverImage" bind:value={post.coverImage} />
	</div>
	<div>
		<label class="block font-semibold" for="markdown">Markdown Content</label>
		<textarea
			class="input w-full font-mono"
			id="markdown"
			name="markdown"
			bind:value={post.markdown}
			rows="12"
			required
		></textarea>
	</div>
	<div class="flex items-center gap-2">
		<label class="font-semibold" for="published">Published</label>
		<input type="checkbox" id="published" name="published" bind:checked={post.published} />
	</div>
	{#if error}
		<div class="text-red-500">{error}</div>
	{/if}
	<button class="btn btn-primary" type="submit" disabled={loading}>
		{loading ? 'Saving...' : 'Save Post'}
	</button>
</form>
