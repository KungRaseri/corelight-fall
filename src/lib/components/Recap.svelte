<script lang="ts">
	interface Props {
		recentEvents?: string[];
	}

	let { recentEvents = [
		"Completed the quest 'Lost Relic'",
		'Defeated Corrupted Behemoth',
		'Upgraded Facility'
	] }: Props = $props();
</script>

<div class="bg-surface-400 dark:bg-surface-600 text-surface-900 dark:text-surface-100 mb-4 rounded-md p-4">
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






