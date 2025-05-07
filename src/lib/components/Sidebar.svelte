<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import IconDashboard from '@lucide/svelte/icons/layout-dashboard';
	import IconGames from '@lucide/svelte/icons/gamepad';
	import IconMenu from '@lucide/svelte/icons/menu';
	import IconSettings from '@lucide/svelte/icons/settings';

	let sidebarExpanded = $state(true);
</script>

<Navigation.Rail expanded={sidebarExpanded}>
	{#snippet header()}
		<Navigation.Tile onclick={() => (sidebarExpanded = !sidebarExpanded)} title="Toggle Menu Width">
			<IconMenu />
		</Navigation.Tile>
	{/snippet}

	{#snippet tiles()}
		<Navigation.Tile labelExpanded="Dashboard" href="/">
			<IconDashboard />
		</Navigation.Tile>
		<Navigation.Tile labelExpanded="Game" href="/game">
			<IconGames />
		</Navigation.Tile>
	{/snippet}

	{#snippet footer()}
		<Navigation.Tile labelExpanded="Settings" href="/settings">
			<IconSettings />
		</Navigation.Tile>
	{/snippet}
</Navigation.Rail>
