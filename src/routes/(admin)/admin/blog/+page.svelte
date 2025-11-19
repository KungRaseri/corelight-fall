<script lang="ts">
	import { goto } from '$app/navigation';
	import BlogPostForm from '$lib/components/admin/BlogPostForm.svelte';
	import type { BlogPostFormData } from '$lib/types/BlogPostFormData';
	import { onMount } from 'svelte';
	import { BookOpen, Plus, Edit, Eye, Trash2, Loader } from 'lucide-svelte';

	const { data } = $props();

	let posts = $state<BlogPostFormData[]>([]);
	let showForm = $state(false);
	let editingPost = $state<BlogPostFormData | null>(null);
	let loading = $state(true);
	let error = $state('');

	function addPost() {
		editingPost = {
			id: null,
			title: '',
			slug: '',
			summary: '',
			date: new Date(),
			author: '',
			markdown: '',
			tags: '',
			published: true,
			coverImage: '',
			createdAt: new Date(),
			updatedAt: new Date()
		};
		showForm = true;
	}

	function editPost(post: BlogPostFormData) {
		editingPost = { ...post };
		showForm = true;
	}

	async function savePost(newPost: BlogPostFormData) {
		loading = true;
		error = '';
		const method = newPost.id ? 'PUT' : 'POST';

		const res = await fetch('/api/admin/blog', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newPost)
		});
		let post: BlogPostFormData;
		if (!res.ok) {
			error = 'Failed to save post';
		} else {
			post = (await res.json()).post;
			showForm = false;
			const exists = posts.some((p) => p.id === post.id);
			if (exists) {
				posts = posts.map((p) => (p.id === post.id ? { ...p, ...post } : p));
			} else {
				posts = [post, ...posts];
			}
		}
		loading = false;
	}

	onMount(async () => {
		// Convert string dates to Date objects
		posts = [
			...posts,
			...data.posts.map((p) => ({
				...p,
				date: new Date(p.date),
				createdAt: new Date(p.createdAt),
				updatedAt: new Date(p.updatedAt)
			}))
		];
		loading = false;
	});

	function viewPost(post: BlogPostFormData) {
		goto(`/blog/${post.slug}`);
	}

	function deletePost(post: BlogPostFormData) {
		// Implement delete logic
	}
</script>

<div class="space-y-6 p-8">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<BookOpen class="text-primary-500 dark:text-primary-400 size-8" />
			<h1 class="text-primary-500 dark:text-primary-400 text-3xl font-bold">Blog Management</h1>
		</div>
		{#if !showForm}
			<button class="btn preset-glass-surface-primary flex items-center gap-2" onclick={addPost}>
				<Plus class="size-5" />
				<span>New Post</span>
			</button>
		{/if}
	</div>

	{#if error}
		<div class="card preset-glass-error rounded-xl p-4">
			<p class="text-center font-semibold">{error}</p>
		</div>
	{/if}

	{#if showForm}
		<BlogPostForm
			post={editingPost}
			{loading}
			onSave={savePost}
			onCancel={() => (showForm = false)}
		/>
	{:else if loading}
		<div class="card preset-glass-surface rounded-2xl p-12 text-center">
			<Loader class="text-primary-500 mx-auto mb-4 size-16 animate-spin" />
			<p class="text-surface-600 dark:text-surface-400 text-lg">Loading posts...</p>
		</div>
	{:else}
		<div class="card preset-glass-surface overflow-hidden rounded-2xl shadow-lg">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead
						class="bg-surface-200 dark:bg-surface-800 border-surface-300 dark:border-surface-700 border-b"
					>
						<tr>
							<th
								class="text-surface-900 dark:text-surface-100 px-6 py-4 text-left text-sm font-bold"
								>Title</th
							>
							<th
								class="text-surface-900 dark:text-surface-100 px-6 py-4 text-left text-sm font-bold"
								>Author</th
							>
							<th
								class="text-surface-900 dark:text-surface-100 px-6 py-4 text-left text-sm font-bold"
								>Date</th
							>
							<th
								class="text-surface-900 dark:text-surface-100 px-6 py-4 text-left text-sm font-bold"
								>Status</th
							>
							<th
								class="text-surface-900 dark:text-surface-100 px-6 py-4 text-right text-sm font-bold"
								>Actions</th
							>
						</tr>
					</thead>
					<tbody class="divide-surface-200 dark:divide-surface-700 divide-y">
						{#each posts as post}
							<tr class="hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
								<td class="px-6 py-4">
									<div class="text-surface-900 dark:text-surface-100 font-semibold">
										{post.title}
									</div>
									{#if post.summary}
										<div class="text-surface-600 dark:text-surface-400 line-clamp-1 text-sm">
											{post.summary}
										</div>
									{/if}
								</td>
								<td class="text-surface-700 dark:text-surface-300 px-6 py-4">{post.author}</td>
								<td class="text-surface-700 dark:text-surface-300 px-6 py-4">
									{new Date(post.date).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'short',
										day: '2-digit'
									})}
								</td>
								<td class="px-6 py-4">
									{#if post.published}
										<span class="badge preset-filled-success text-xs">Published</span>
									{:else}
										<span class="badge preset-filled-warning text-xs">Draft</span>
									{/if}
								</td>
								<td class="px-6 py-4">
									<div class="flex justify-end gap-2">
										<button
											class="btn-icon btn-icon-sm hover:preset-tonal-primary"
											onclick={() => editPost(post)}
											title="Edit post"
										>
											<Edit class="size-4" />
										</button>
										<button
											class="btn-icon btn-icon-sm hover:preset-tonal-secondary"
											onclick={() => viewPost(post)}
											title="View post"
										>
											<Eye class="size-4" />
										</button>
										<button
											class="btn-icon btn-icon-sm hover:preset-tonal-error"
											onclick={() => deletePost(post)}
											title="Delete post"
										>
											<Trash2 class="size-4" />
										</button>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="px-6 py-12 text-center">
									<BookOpen class="size-16 mx-auto mb-4 text-surface-400" />
									<p class="text-lg text-surface-600 dark:text-surface-400">No blog posts yet</p>
									<button
										class="btn preset-glass-primary mt-4 flex items-center gap-2 mx-auto"
										onclick={addPost}
									>
										<Plus class="size-5" />
										<span>Create your first post</span>
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
