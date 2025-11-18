<script lang="ts">
	import { onMount } from 'svelte';

	const { data } = $props();
	let statsData = $state({
		blogPosts: 0,
		storylines: 0,
		quests: 0,
		encounters: 0,
		users: 0
	});

	onMount(() => {
		statsData = { ...data.statsData };
	});
</script>

<div class="space-y-8 p-8">
	<h1 class="mb-4 text-3xl font-extrabold">Admin Dashboard</h1>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		<div class="bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-lg p-6 shadow">
			<h2 class="mb-2 text-lg font-bold">Total Blog Posts</h2>
			<p class="text-3xl font-extrabold">{statsData.blogPosts}</p>
		</div>
		<div class="bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-lg p-6 shadow">
			<h2 class="mb-2 text-lg font-bold">Storylines</h2>
			<p class="text-3xl font-extrabold">{statsData.storylines}</p>
		</div>
		<div class="bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-lg p-6 shadow">
			<h2 class="mb-2 text-lg font-bold">Quests</h2>
			<p class="text-3xl font-extrabold">{statsData.quests}</p>
		</div>
		<div class="bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-lg p-6 shadow">
			<h2 class="mb-2 text-lg font-bold">Encounters</h2>
			<p class="text-3xl font-extrabold">{statsData.encounters}</p>
		</div>
		<div class="bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-lg p-6 shadow">
			<h2 class="mb-2 text-lg font-bold">Registered Users</h2>
			<p class="text-3xl font-extrabold">{statsData.users}</p>
		</div>
	</div>

	<!-- Quick Links -->
	<div class="mt-10">
		<h2 class="mb-4 text-xl font-bold">Quick Links</h2>
		<div class="flex flex-wrap gap-4">
			<a href="/admin/blog" class="btn preset-filled-primary">Manage Blog</a>
			<a href="/admin/story" class="btn preset-filled-primary">Manage Story</a>
			<a href="/admin/quest" class="btn preset-filled-primary">Manage Quests</a>
			<a href="/admin/encounter" class="btn preset-filled-primary">Manage Encounters</a>
			<a href="/admin/user" class="btn preset-filled-primary">Manage Users</a>
			<a href="/admin/settings" class="btn preset-filled-primary">Settings</a>
		</div>
	</div>

	<!-- Recent Activity (placeholder) -->
	<div class="mt-10">
		<h2 class="mb-4 text-xl font-bold">Recent Activity</h2>
		<ul class="list-inside list-disc space-y-2">
			<li>User <span class="font-semibold">Alice</span> created a new quest.</li>
			<li>Blog post <span class="font-semibold">"Welcome to Corelight Fall"</span> published.</li>
			<li>Encounter <span class="font-semibold">"Forest Ambush"</span> updated.</li>
		</ul>
	</div>
</div>






