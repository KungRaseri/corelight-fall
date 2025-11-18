<script lang="ts">
	import type { BlogPostFormData } from '$lib/types/BlogPostFormData';
	import { onMount } from 'svelte';

	const { post, loading, onSave, onCancel } = $props();

	let error = '';

	let postData = $state<BlogPostFormData>(
		post ?? {
			id: null,
			title: '',
			slug: '',
			summary: '',
			date: '',
			author: '',
			tags: null,
			coverImage: null,
			markdown: '',
			published: false
		}
	);

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSave({ ...postData });
	}

	onMount(() => {
		postData = { ...post };
	});
</script>

<form
	class="bg-surface-800 text-surface-100 mx-auto max-w-2xl space-y-6 rounded-lg p-8 shadow-lg"
	onsubmit={handleSubmit}
>
	<h2 class="mb-2 text-2xl font-bold">{postData.id ? 'Edit Blog Post' : 'New Blog Post'}</h2>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<label class="mb-1 block font-semibold" for="title">Title</label>
			<input class="input w-full" id="title" name="title" bind:value={postData.title} required />
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="slug">Slug</label>
			<input class="input w-full" id="slug" name="slug" bind:value={postData.slug} required />
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="date">Date</label>
			<input
				class="input w-full"
				id="date"
				name="date"
				type="date"
				bind:value={postData.date}
				required
			/>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="author">Author</label>
			<input class="input w-full" id="author" name="author" bind:value={postData.author} />
		</div>
		<div class="md:col-span-2">
			<label class="mb-1 block font-semibold" for="tags">Tags (comma separated)</label>
			<input class="input w-full" id="tags" name="tags" bind:value={postData.tags} />
		</div>
		<div class="md:col-span-2">
			<label class="mb-1 block font-semibold" for="coverImage">Cover Image URL</label>
			<input
				class="input w-full"
				id="coverImage"
				name="coverImage"
				bind:value={postData.coverImage}
			/>
		</div>
	</div>
	<div>
		<label class="mb-1 block font-semibold" for="summary">Summary</label>
		<textarea
			class="input w-full"
			id="summary"
			name="summary"
			bind:value={postData.summary}
			rows="2"
		></textarea>
	</div>
	<div>
		<label class="mb-1 block font-semibold" for="markdown">Markdown Content</label>
		<textarea
			class="input w-full font-mono"
			id="markdown"
			name="markdown"
			bind:value={postData.markdown}
			rows="12"
			required
		></textarea>
	</div>
	<div class="flex items-center gap-3">
		<input
			type="checkbox"
			id="published"
			name="published"
			bind:checked={postData.published}
			class="checkbox"
		/>
		<label class="font-semibold" for="published">Published</label>
	</div>
	{#if error}
		<div class="text-red-500">{error}</div>
	{/if}
	<div class="mt-4 flex gap-4">
		<button class="btn preset-glass-primary" type="submit" disabled={loading}>
			{loading ? 'Saving...' : 'Save Post'}
		</button>
		<button class="btn mt-4" onclick={onCancel}>Cancel</button>
	</div>
</form>






