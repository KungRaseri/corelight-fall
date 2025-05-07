<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import IconDashboard from '@lucide/svelte/icons/layout-dashboard';
	import IconGames from '@lucide/svelte/icons/gamepad';
</script>

<Navigation.Bar>
	<Navigation.Tile href="/" labelExpanded="Dashboard">
		<IconDashboard />
	</Navigation.Tile>
	<Navigation.Tile href="/game" labelExpanded="Game">
		<IconGames />
	</Navigation.Tile>
</Navigation.Bar>
