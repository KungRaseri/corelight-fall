<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import IconDashboard from '@lucide/svelte/icons/layout-dashboard';
	import IconGames from '@lucide/svelte/icons/gamepad';
	import IconInventory from '@lucide/svelte/icons/boxes';
	import IconMap from '@lucide/svelte/icons/globe';
</script>

<div
	class="bg-surface-900 text-surface-100 border-surface-700 fixed inset-x-0 bottom-0 z-50 border-t"
>
	<Navigation.Bar>
		<Navigation.Tile labelExpanded="Dashboard" href="/">
			<IconDashboard />
		</Navigation.Tile>
		<Navigation.Tile labelExpanded="Game" href="/game">
			<IconGames />
		</Navigation.Tile>
		<Navigation.Tile labelExpanded="Inventory" href="/game/inventory">
			<IconInventory />
		</Navigation.Tile>
		<Navigation.Tile labelExpanded="Map" href="/game/map">
			<IconMap />
		</Navigation.Tile>
	</Navigation.Bar>
</div>






