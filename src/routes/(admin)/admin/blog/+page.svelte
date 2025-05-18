<script lang="ts">
	import BlogPostForm from '$lib/components/admin/BlogPostForm.svelte';
	import type { BlogPostFormData } from '$lib/types/BlogPostFormData';
	import { onMount } from 'svelte';

	const { data } = $props();

	let posts = $state<BlogPostFormData[]>([]);
	let showForm = $state(false);
	let editingPost = $state<BlogPostFormData | null>(null);
	let loading = $state(true);
	let error = $state('');

	function addNew() {
		editingPost = null;
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
			if (post.id) {
				// Editing: update the post in the array
				posts = posts.map((p) => (p.id === post.id ? { ...p, ...post } : p));
			} else {
				// Creating: add the new post (you may want to get the new id from the response)
				posts = [{ ...post, id: post.id }, ...posts];
			}
		}
		loading = false;
	}

	onMount(async () => {
		posts = [...posts, ...data.posts];
		loading = false;
	});

	function viewPost(post: BlogPostFormData) {
		window.open(`/blog/${post.slug}`, '_blank');
	}

	function deletePost(post: BlogPostFormData) {
		// Implement delete logic
	}
</script>

<h1 class="mb-4 text-2xl font-bold">Blog Admin</h1>

{#if showForm}
	<BlogPostForm
		post={editingPost ?? {
			id: null,
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
		}}
		{loading}
		onSave={savePost}
	/>
	<button class="btn mt-4" onclick={() => (showForm = false)}>Cancel</button>
{:else}
	<button class="btn btn-primary mb-4" onclick={addNew}>Add New Post</button>
	{#if loading}
		<p>Loading...</p>
	{:else}
		<table class="w-full table-auto border-collapse bg-surface-800 rounded shadow">
			<thead>
				<tr>
					<th class="px-3 py-2 text-left">Title</th>
					<th class="px-3 py-2 text-left">Author</th>
					<th class="px-3 py-2 text-left">Date</th>
					<th class="px-3 py-2 text-left">Published</th>
					<th class="px-3 py-2 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each posts as post}
					<tr class="border-t border-surface-700 hover:bg-surface-700 transition">
						<td class="px-3 py-2">{post.title}</td>
						<td class="px-3 py-2">{post.author}</td>
						<td class="px-3 py-2">
							{new Date(post.date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: '2-digit'
							})}
						</td>
						<td class="px-3 py-2">{post.published ? 'Yes' : 'No'}</td>
						<td class="px-3 py-2 flex gap-2">
							<button class="btn btn-xs btn-primary" onclick={() => editPost(post)}>Edit</button>
							<button class="btn btn-xs btn-secondary" onclick={() => viewPost(post)}>View</button>
							<button class="btn btn-xs btn-error" onclick={() => deletePost(post)}>Delete</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
{/if}

{#if error}
	<p class="mt-2 text-red-500">{error}</p>
{/if}
