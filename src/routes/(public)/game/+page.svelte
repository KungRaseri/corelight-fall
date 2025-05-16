<script lang="ts">
	import Recap from '$lib/components/Recap.svelte';
	import PlayerStats from '$lib/components/CharacterAttributes.svelte';
	import QuickLinks from '$lib/components/QuickLinks.svelte';
	import CharacterAttributes from '$lib/components/CharacterAttributes.svelte';
	import { setCharacterAttributes } from '$lib/stores/characterAttributes';

	const { data } = $props();

	// Update player stats on load
	$effect(() => {
		setCharacterAttributes(data.stats);
	});
</script>

<div class="space-y-8 p-8">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<!-- Recent Activities -->
		<Recap />

		<!-- Player Stats -->
		<CharacterAttributes />

		<!-- Quick Links -->
		<QuickLinks />
	</div>
</div>
