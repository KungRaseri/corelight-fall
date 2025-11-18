<script lang="ts">
	import IconDashboard from 'lucide-svelte/icons/layout-dashboard';
	import IconUsers from 'lucide-svelte/icons/users';
	import IconStats from 'lucide-svelte/icons/bar-chart';
	import IconLogs from 'lucide-svelte/icons/clipboard-list';
	import IconNotebookPen from 'lucide-svelte/icons/notebook-pen';
	import IconSettings from 'lucide-svelte/icons/settings';
	import IconSeed from 'lucide-svelte/icons/database';
	import IconBookOpen from 'lucide-svelte/icons/book-open';
	import IconBoxes from 'lucide-svelte/icons/boxes';
</script>

<nav class="bg-surface-900 h-full w-60 flex flex-col">
	<!-- Header -->
	<div class="p-4 border-b border-surface-700">
		<a href="/admin" class="flex items-center gap-3 hover:bg-surface-800 rounded-lg p-2 transition-colors">
			<IconDashboard class="size-5" />
			<span class="font-semibold">Admin Dashboard</span>
		</a>
	</div>

	<!-- Navigation Links -->
	<div class="flex-1 overflow-y-auto p-2">
		<!-- Content Section -->
		<div class="mb-4">
			<div class="px-2 py-1 text-xs font-semibold text-surface-400 uppercase tracking-wider">Content</div>
			<a href="/admin/blog" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
				<IconNotebookPen class="size-5" />
				<span>Blog</span>
			</a>
			<a href="/admin/story-builder" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
				<IconBookOpen class="size-5" />
				<span>Story Builder</span>
			</a>
			<a href="/admin/item" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
				<IconBoxes class="size-5" />
				<span>Items</span>
			</a>
		</div>

		<!-- Management Section -->
		<div class="mb-4">
			<div class="px-2 py-1 text-xs font-semibold text-surface-400 uppercase tracking-wider">Management</div>
			<a href="/admin/user" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
				<IconUsers class="size-5" />
				<span>Users</span>
			</a>
			<a href="/admin/stats" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
				<IconStats class="size-5" />
				<span>Stats</span>
			</a>
			<a href="/admin/log" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
				<IconLogs class="size-5" />
				<span>Logs</span>
			</a>
		</div>

		<!-- System Section -->
		<div>
			<div class="px-2 py-1 text-xs font-semibold text-surface-400 uppercase tracking-wider">System</div>
			<a href="/admin/settings" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
				<IconSettings class="size-5" />
				<span>Settings</span>
			</a>
			<a href="/admin/database" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
				<IconSeed class="size-5" />
				<span>Seed Data</span>
			</a>
		</div>
	</div>
</nav>






