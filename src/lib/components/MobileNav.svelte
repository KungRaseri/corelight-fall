<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import IconDashboard from '@lucide/svelte/icons/layout-dashboard';
	import IconGames from '@lucide/svelte/icons/gamepad';
</script>

<div
	class="bg-surface-900 text-surface-100 border-surface-700 fixed inset-x-0 bottom-0 z-50 border-t"
>
	<Navigation.Bar>
		<Navigation.Tile href="/" labelExpanded="Dashboard">
			<IconDashboard />
		</Navigation.Tile>
		<Navigation.Tile href="/game" labelExpanded="Game">
			<IconGames />
		</Navigation.Tile>
	</Navigation.Bar>
</div>
