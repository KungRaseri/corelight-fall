<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import IconDashboard from '@lucide/svelte/icons/layout-dashboard';
	import IconUsers from '@lucide/svelte/icons/users';
	import IconStats from '@lucide/svelte/icons/bar-chart';
	import IconLogs from '@lucide/svelte/icons/clipboard-list';
	import IconNotebookPen from '@lucide/svelte/icons/notebook-pen';
	import IconSettings from '@lucide/svelte/icons/settings';
	import IconSeed from '@lucide/svelte/icons/database';
	import IconBookOpen from '@lucide/svelte/icons/book-open';
	import IconBoxes from '@lucide/svelte/icons/boxes';
</script>

<div class="bg-surface-900 h-full w-60">
	<Navigation.Rail expanded={true}>
		{#snippet header()}
			<Navigation.Tile labelExpanded="Admin Dashboard" href="/admin">
				<IconDashboard />
			</Navigation.Tile>
		{/snippet}
		{#snippet tiles()}
			<div class="w-full">
				<span class="px-2 text-2xl"> Content </span>
				<hr class="border-surface-950-50 w-3/4" />
			</div>
			<Navigation.Tile labelExpanded="Blog" href="/admin/blog">
				<IconNotebookPen />
			</Navigation.Tile>
			<Navigation.Tile labelExpanded="Story Builder" href="/admin/story-builder">
				<IconBookOpen />
			</Navigation.Tile>
			<Navigation.Tile labelExpanded="Items" href="/admin/item">
				<IconBoxes />
			</Navigation.Tile>
			<div class="w-full">
				<span class="px-2 text-2xl"> Management </span>
				<hr class="border-surface-950-50 w-3/4" />
			</div>
			<Navigation.Tile labelExpanded="Users" href="/admin/user">
				<IconUsers />
			</Navigation.Tile>
			<Navigation.Tile labelExpanded="Stats" href="/admin/stats">
				<IconStats />
			</Navigation.Tile>
			<Navigation.Tile labelExpanded="Logs" href="/admin/log">
				<IconLogs />
			</Navigation.Tile>
			<div class="w-full">
				<span class="px-2 text-2xl"> System </span>
				<hr class="border-surface-950-50 w-3/4" />
			</div>
			<Navigation.Tile labelExpanded="Settings" href="/admin/settings">
				<IconSettings />
			</Navigation.Tile>
			<Navigation.Tile labelExpanded="Seed Data" href="/admin/database">
				<IconSeed />
			</Navigation.Tile>
		{/snippet}
	</Navigation.Rail>
</div>
