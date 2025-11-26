<script lang="ts">
	import QuestList from '$lib/components/gameplay/QuestList.svelte';
	import RelationshipTracker from '$lib/components/gameplay/RelationshipTracker.svelte';
	import FragmentInventory from '$lib/components/gameplay/FragmentInventory.svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
</script>

<svelte:head>
	<title>Journal - Corelight Fall</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-2">
			Your Journal
		</h1>
		<p class="text-surface-600 dark:text-surface-400">
			Track your quests, relationships, and fragment collection
		</p>
	</div>

	<!-- Tabs Navigation -->
	<Tabs defaultValue="quests">
		<Tabs.Context>
			{#snippet children(api)}
				<Tabs.List class="mb-6">
					<Tabs.Trigger value="quests" class="flex items-center gap-2">
						<span>📜</span>
						<span>Quests</span>
					</Tabs.Trigger>
					<Tabs.Trigger value="relationships" class="flex items-center gap-2">
						<span>👥</span>
						<span>Relationships</span>
					</Tabs.Trigger>
					<Tabs.Trigger value="fragments" class="flex items-center gap-2">
						<span>💎</span>
						<span>Fragments</span>
					</Tabs.Trigger>
					<Tabs.Indicator />
				</Tabs.List>

				<!-- Quests Tab -->
				<Tabs.Content value="quests">
					<QuestList />
				</Tabs.Content>

				<!-- Relationships Tab -->
				<Tabs.Content value="relationships">
					<RelationshipTracker />
				</Tabs.Content>

				<!-- Fragments Tab -->
				<Tabs.Content value="fragments">
					<FragmentInventory />
				</Tabs.Content>
			{/snippet}
		</Tabs.Context>
	</Tabs>
</div>
