<script lang="ts">
	export let recentEvents: string[] = [
		"Completed the quest 'Lost Relic'",
		'Defeated Corrupted Behemoth',
		'Upgraded Facility'
	];
</script>

<div class="bg-surface-400-600 text-surface-900-100 mb-4 rounded-md p-4">
	<h2 class="text-xl font-semibold">Recent Activities</h2>
	{#if recentEvents.length}
		<ul class="mt-2 list-disc pl-6">
			{#each recentEvents as event}
				<li>{event}</li>
			{/each}
		</ul>
	{:else}
		<p>No recent activities found.</p>
	{/if}
</div>
