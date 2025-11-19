<script lang="ts">
	import type { BlogPostFormData } from '$lib/types/BlogPostFormData';
	import { onMount } from 'svelte';
	import { Save, X, FileText, Calendar, User, Tag, Image, AlignLeft } from 'lucide-svelte';

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

<div class="card preset-glass-surface p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
	<form class="space-y-6" onsubmit={handleSubmit}>
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div class="flex items-center gap-3">
				<FileText class="size-8 text-primary-500 dark:text-primary-400" />
				<h2 class="text-3xl font-bold text-primary-500 dark:text-primary-400">
					{postData.id ? 'Edit Blog Post' : 'New Blog Post'}
				</h2>
			</div>
		</div>

		<!-- Title & Slug -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<label class="label">
				<span class="font-semibold mb-2 flex items-center gap-2">
					<FileText class="size-4" />
					Title
				</span>
				<input 
					class="input" 
					id="title" 
					name="title" 
					bind:value={postData.title} 
					placeholder="Enter post title..."
					required 
				/>
			</label>

			<label class="label">
				<span class="font-semibold mb-2 flex items-center gap-2">
					<AlignLeft class="size-4" />
					Slug
				</span>
				<input 
					class="input" 
					id="slug" 
					name="slug" 
					bind:value={postData.slug}
					placeholder="url-friendly-slug"
					required 
				/>
			</label>
		</div>

		<!-- Date & Author -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<label class="label">
				<span class="font-semibold mb-2 flex items-center gap-2">
					<Calendar class="size-4" />
					Date
				</span>
				<input
					class="input"
					id="date"
					name="date"
					type="date"
					bind:value={postData.date}
					required
				/>
			</label>

			<label class="label">
				<span class="font-semibold mb-2 flex items-center gap-2">
					<User class="size-4" />
					Author
				</span>
				<input 
					class="input" 
					id="author" 
					name="author" 
					bind:value={postData.author}
					placeholder="Author name"
				/>
			</label>
		</div>

		<!-- Tags & Cover Image -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<label class="label">
				<span class="font-semibold mb-2 flex items-center gap-2">
					<Tag class="size-4" />
					Tags
				</span>
				<input 
					class="input" 
					id="tags" 
					name="tags" 
					bind:value={postData.tags}
					placeholder="tag1, tag2, tag3"
				/>
				<span class="text-xs text-surface-600 dark:text-surface-400 mt-1">Comma separated</span>
			</label>

			<label class="label">
				<span class="font-semibold mb-2 flex items-center gap-2">
					<Image class="size-4" />
					Cover Image URL
				</span>
				<input
					class="input"
					id="coverImage"
					name="coverImage"
					bind:value={postData.coverImage}
					placeholder="https://example.com/image.jpg"
				/>
			</label>
		</div>

		<!-- Summary -->
		<label class="label">
			<span class="font-semibold mb-2 flex items-center gap-2">
				<AlignLeft class="size-4" />
				Summary
			</span>
			<textarea
				class="textarea"
				id="summary"
				name="summary"
				bind:value={postData.summary}
				rows="3"
				placeholder="Brief summary of the post..."
			></textarea>
		</label>

		<!-- Markdown Content -->
		<label class="label">
			<span class="font-semibold mb-2 flex items-center gap-2">
				<FileText class="size-4" />
				Markdown Content
			</span>
			<textarea
				class="textarea font-mono text-sm"
				id="markdown"
				name="markdown"
				bind:value={postData.markdown}
				rows="16"
				placeholder="# Your markdown content here..."
				required
			></textarea>
		</label>

		<!-- Published Checkbox -->
		<div class="card preset-glass-surface-primary p-4 rounded-xl">
			<label class="flex items-center gap-3 cursor-pointer">
				<input
					type="checkbox"
					id="published"
					name="published"
					bind:checked={postData.published}
					class="checkbox"
				/>
				<div>
					<span class="font-semibold">Publish Post</span>
					<p class="text-sm text-surface-600 dark:text-surface-400">
						Make this post visible to the public
					</p>
				</div>
			</label>
		</div>

		<!-- Error Message -->
		{#if error}
			<div class="card preset-glass-error p-4 rounded-xl">
				<p class="text-center font-semibold">{error}</p>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex gap-4 pt-4">
			<button 
				class="btn preset-glass-surface-primary flex items-center gap-2" 
				type="submit" 
				disabled={loading}
			>
				<Save class="size-5" />
				<span>{loading ? 'Saving...' : 'Save Post'}</span>
			</button>
			<button 
				class="btn preset-glass-surface flex items-center gap-2" 
				type="button"
				onclick={onCancel}
			>
				<X class="size-5" />
				<span>Cancel</span>
			</button>
		</div>
	</form>
</div>






