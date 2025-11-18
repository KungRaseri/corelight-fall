<script lang="ts">
	import IconDashboard from 'lucide-svelte/icons/layout-dashboard';
	import IconInventory from 'lucide-svelte/icons/boxes';
	import IconMap from 'lucide-svelte/icons/globe';
	import IconMenu from 'lucide-svelte/icons/menu';
	import IconSettings from 'lucide-svelte/icons/settings';
	import { sidebarExpanded, toggleSidebar } from '$lib/stores/sidebar';

	let expanded = $state(true);
	sidebarExpanded.subscribe((value) => (expanded = value));
</script>

<nav class="bg-surface-900 h-full {expanded ? 'w-60' : 'w-16'} transition-all duration-200 flex flex-col">
	<!-- Header -->
	<div class="p-4 border-b border-surface-700">
		<button 
			onclick={toggleSidebar} 
			class="flex items-center gap-3 hover:bg-surface-800 rounded-lg p-2 transition-colors w-full"
			title="Toggle Menu Width"
		>
			<IconMenu class="size-5" />
			{#if expanded}
				<span class="font-semibold">Menu</span>
			{/if}
		</button>
	</div>

	<!-- Navigation Links -->
	<div class="flex-1 overflow-y-auto p-2">
		<a href="/game" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
			<IconDashboard class="size-5" />
			{#if expanded}
				<span>Dashboard</span>
			{/if}
		</a>
		<a href="/game/inventory" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
			<IconInventory class="size-5" />
			{#if expanded}
				<span>Inventory</span>
			{/if}
		</a>
		<a href="/game/map" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
			<IconMap class="size-5" />
			{#if expanded}
				<span>Map</span>
			{/if}
		</a>
	</div>

	<!-- Footer -->
	<div class="p-2 border-t border-surface-700">
		<a href="/settings" class="flex items-center gap-3 px-3 py-2 hover:bg-surface-800 rounded-lg transition-colors">
			<IconSettings class="size-5" />
			{#if expanded}
				<span>Settings</span>
			{/if}
		</a>
	</div>
</nav>






