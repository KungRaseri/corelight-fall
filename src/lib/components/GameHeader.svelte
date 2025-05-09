<script lang="ts">
	import type { Player } from '$lib/server/db/types';
	import { player } from '$lib/stores/player';

	let playerData = $state<Player | null>(null);
	$effect(() => {
		player.subscribe((value) => (playerData = value));
	});
</script>

<header class="bg-surface-800 text-surface-100 p-4 shadow-md">
	{#if playerData}
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold">The Corelight Fall</h1>
			<div>
				<span class="text-primary-400">{playerData.username}</span>
				<span class="ml-2">Health: 100%</span>
			</div>
		</div>
	{:else}
		<h1 class="text-2xl font-semibold">The Corelight Fall</h1>
	{/if}
</header>
