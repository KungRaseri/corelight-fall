<script lang="ts">
	import Recap from '$lib/components/Recap.svelte';
	import CharacterAttributes from '$lib/components/gameplay/CharacterAttributes.svelte';
	import QuickLinks from '$lib/components/QuickLinks.svelte';
	import { setCharacterAttributes } from '$lib/stores/characterAttributes';

	const { data } = $props();

	// Update character stats on load
	$effect(() => {
		setCharacterAttributes(data.attributes);
	});
</script>

<div class="space-y-8 p-8">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<!-- Character Attributes -->
		<CharacterAttributes />

		<!-- Quick Links -->
		<QuickLinks />

		<!-- Recent Activities -->
		<Recap />
	</div>
</div>
