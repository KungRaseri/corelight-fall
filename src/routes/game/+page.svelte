<script lang="ts">
	import Recap from '$lib/components/Recap.svelte';
	import PlayerStats from '$lib/components/PlayerStats.svelte';
	import QuickLinks from '$lib/components/QuickLinks.svelte';
	import { playerStats, setPlayerStats } from '$lib/stores/playerStats';

	const { data } = $props();

	// Update player stats on load
	$effect(() => {
		setPlayerStats(data.stats);
	});
</script>

<div class="space-y-8 p-8">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<!-- Recent Activities -->
		<Recap />

		<!-- Player Stats -->
		<PlayerStats />

		<!-- Quick Links -->
		<QuickLinks />
	</div>
</div>
