<script lang="ts">
	import IconDashboard from 'lucide-svelte/icons/layout-dashboard';
	import IconGames from 'lucide-svelte/icons/gamepad';
	import IconInventory from 'lucide-svelte/icons/boxes';
	import IconMap from 'lucide-svelte/icons/globe';
</script>

<nav class="bg-surface-900 text-surface-100 border-surface-700 fixed inset-x-0 bottom-0 z-50 border-t">
	<div class="flex items-center justify-around h-16">
		<a href="/" class="flex flex-col items-center justify-center flex-1 gap-1 hover:bg-surface-800 h-full transition-colors">
			<IconDashboard class="size-5" />
			<span class="text-xs">Dashboard</span>
		</a>
		<a href="/game" class="flex flex-col items-center justify-center flex-1 gap-1 hover:bg-surface-800 h-full transition-colors">
			<IconGames class="size-5" />
			<span class="text-xs">Game</span>
		</a>
		<a href="/game/inventory" class="flex flex-col items-center justify-center flex-1 gap-1 hover:bg-surface-800 h-full transition-colors">
			<IconInventory class="size-5" />
			<span class="text-xs">Inventory</span>
		</a>
		<a href="/game/map" class="flex flex-col items-center justify-center flex-1 gap-1 hover:bg-surface-800 h-full transition-colors">
			<IconMap class="size-5" />
			<span class="text-xs">Map</span>
		</a>
	</div>
</nav>






