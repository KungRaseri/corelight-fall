<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<main class="bg-surface-300-700 space-y-4 p-4">
	<div class="card">
		{data.playerData.id} <br />
		{data.playerData.userId}
	</div>
</main>
