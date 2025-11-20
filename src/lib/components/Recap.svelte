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

<div class="space-y-3">
	{#if recentEvents.length}
		<ul class="space-y-2">
			{#each recentEvents as event}
				<li class="flex items-start gap-3">
					<span class="mt-1 size-2 shrink-0 rounded-full bg-primary-500"></span>
					<span class="text-surface-700 dark:text-surface-300">{event}</span>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-surface-500 dark:text-surface-400">No recent activities found.</p>
	{/if}
</div>






