<script lang="ts">
	import { player } from '$lib/stores/player';

	let { children } = $props();
	let playerData;

	$effect(() => {
		player.subscribe((value) => (playerData = value));
	});
</script>

<div class="bg-surface-900 text-surface-100 flex h-full flex-col">
	<main class="flex-1 overflow-auto p-4">
		{@render children()}
	</main>
</div>
