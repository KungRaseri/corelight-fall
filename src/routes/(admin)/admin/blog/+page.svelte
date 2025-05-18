<script lang="ts">
	import BlogPostForm from '$lib/components/admin/BlogPostForm.svelte';
	import type { BlogPostFormData } from '$lib/types/BlogPostFormData';
	import { onMount } from 'svelte';

	const { data } = $props();

	let posts = $state<BlogPostFormData[]>([]);
	let showForm = $state(false);
	let editingPost = $state<BlogPostFormData | null>(null);
	let loading = $state(false);
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
	});
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
		<table class="w-full table-auto border">
			<thead>
				<tr>
					<th class="border px-2 py-1">Title</th>
					<th class="border px-2 py-1">Slug</th>
					<th class="border px-2 py-1">Date</th>
					<th class="border px-2 py-1">Published</th>
					<th class="border px-2 py-1">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each posts as post}
					<tr>
						<td class="border px-2 py-1">{post.title}</td>
						<td class="border px-2 py-1">{post.slug}</td>
						<td class="border px-2 py-1">
							{new Date(post.date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: '2-digit'
							})}
						</td>
						<td class="border px-2 py-1">{post.published ? 'Yes' : 'No'}</td>
						<td class="border px-2 py-1">
							<button class="btn btn-xs" onclick={() => editPost(post)}>Edit</button>
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
