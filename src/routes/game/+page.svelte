<script lang="ts">
	import Recap from '$lib/components/Recap.svelte';
	import Status from '$lib/components/Status.svelte';
	import QuickLinks from '$lib/components/QuickLinks.svelte';
	import { player } from '$lib/stores/player';
	import type { Player } from '$lib/server/db/types';

	let playerData = $state<Player | null>(null);

	$effect(() => {
		const unsubscribe = player.subscribe((value) => {
			playerData = value;
		});
		return unsubscribe;
	});
</script>

<div class="p-8">
	<h1 class="mb-4 text-3xl font-bold">Welcome back, {playerData?.username}!</h1>

	<section class="mb-6">
		<Recap />
	</section>

	<section class="mb-6">
		<Status />
	</section>

	<section>
		<QuickLinks />
	</section>
</div>
