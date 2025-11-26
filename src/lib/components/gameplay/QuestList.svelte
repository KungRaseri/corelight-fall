<script lang="ts">
	import { onMount } from 'svelte';
	
	interface QuestObjective {
		id: number;
		description: string;
		completed: boolean;
		progress: number;
		required: number;
	}
	
	interface Quest {
		id: number;
		title: string;
		description: string;
		status: 'available' | 'active' | 'completed' | 'failed';
		tone: string | null;
		summary: string | null;
		objectives: QuestObjective[];
		xpReward: number;
		goldReward: number;
		completedObjectives: number;
		totalObjectives: number;
	}
	
	let quests = $state<Quest[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let selectedFilter = $state<'all' | 'active' | 'completed'>('active');
	
	onMount(async () => {
		await loadQuests();
	});
	
	async function loadQuests() {
		try {
			loading = true;
			const response = await fetch('/api/quests');
			
			if (!response.ok) {
				throw new Error('Failed to load quests');
			}
			
			quests = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
			console.error('Error loading quests:', err);
		} finally {
			loading = false;
		}
	}
	
	const filteredQuests = $derived(() => {
		if (selectedFilter === 'all') return quests;
		if (selectedFilter === 'active') return quests.filter(q => q.status === 'active');
		if (selectedFilter === 'completed') return quests.filter(q => q.status === 'completed');
		return quests;
	});
	
	function getProgressPercentage(quest: Quest): number {
		if (quest.totalObjectives === 0) return 0;
		return Math.round((quest.completedObjectives / quest.totalObjectives) * 100);
	}
	
	function getStatusColor(status: Quest['status']): string {
		switch (status) {
			case 'available': return 'text-surface-600 dark:text-surface-400';
			case 'active': return 'text-primary-500';
			case 'completed': return 'text-success-500';
			case 'failed': return 'text-error-500';
			default: return 'text-surface-700 dark:text-surface-300';
		}
	}
	
	function getStatusBadge(status: Quest['status']): string {
		switch (status) {
			case 'available': return 'preset-tonal-surface';
			case 'active': return 'preset-filled-primary-500';
			case 'completed': return 'preset-filled-success-500';
			case 'failed': return 'preset-filled-error-500';
			default: return 'preset-tonal-surface';
		}
	}
</script>

<div class="w-full space-y-4">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Quests</h2>
		<div class="flex gap-2">
			<button
				class="btn btn-sm {selectedFilter === 'all' ? 'preset-filled-primary-500' : 'preset-tonal'}"
				onclick={() => selectedFilter = 'all'}
			>
				All
			</button>
			<button
				class="btn btn-sm {selectedFilter === 'active' ? 'preset-filled-primary-500' : 'preset-tonal'}"
				onclick={() => selectedFilter = 'active'}
			>
				Active
			</button>
			<button
				class="btn btn-sm {selectedFilter === 'completed' ? 'preset-filled-primary-500' : 'preset-tonal'}"
				onclick={() => selectedFilter = 'completed'}
			>
				Completed
			</button>
		</div>
	</div>

	<!-- Loading State -->
	{#if loading}
		<div class="card preset-tonal-surface p-8 text-center">
			<p class="text-surface-600 dark:text-surface-400">Loading quests...</p>
		</div>
	{/if}

	<!-- Error State -->
	{#if error}
		<div class="card preset-filled-error-500 p-4">
			<p class="text-error-contrast-500">Error: {error}</p>
			<button class="btn preset-tonal mt-2" onclick={loadQuests}>
				Try Again
			</button>
		</div>
	{/if}

	<!-- Quest List -->
	{#if !loading && !error}
		{#if filteredQuests().length === 0}
			<div class="card preset-tonal-surface p-8 text-center">
				<p class="text-surface-600 dark:text-surface-400">
					No {selectedFilter === 'all' ? '' : selectedFilter} quests found.
				</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each filteredQuests() as quest (quest.id)}
					<div class="card preset-outlined-surface-200-800 bg-surface-50 dark:bg-surface-950 p-4 space-y-3">
						<!-- Quest Header -->
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<div class="flex items-center gap-2 mb-1">
									<h3 class="text-xl font-bold text-surface-900 dark:text-surface-100">
										{quest.title}
									</h3>
									<span class="badge {getStatusBadge(quest.status)} text-xs">
										{quest.status}
									</span>
								</div>
								{#if quest.tone}
									<p class="text-sm italic text-surface-600 dark:text-surface-400">
										{quest.tone}
									</p>
								{/if}
							</div>
							<div class="text-right">
								<div class="text-sm font-semibold text-primary-500">
									{quest.xpReward} XP
								</div>
								<div class="text-sm text-surface-600 dark:text-surface-400">
									{quest.goldReward} Gold
								</div>
							</div>
						</div>

						<!-- Quest Description -->
						<p class="text-surface-700 dark:text-surface-300">
							{quest.description}
						</p>

						<!-- Progress Bar (only for active quests) -->
						{#if quest.status === 'active'}
							<div class="space-y-1">
								<div class="flex items-center justify-between text-sm">
									<span class="text-surface-600 dark:text-surface-400">Progress</span>
									<span class="font-semibold text-surface-900 dark:text-surface-100">
										{quest.completedObjectives}/{quest.totalObjectives} objectives
									</span>
								</div>
								<div class="w-full bg-surface-200 dark:bg-surface-800 rounded-full h-2">
									<div
										class="bg-primary-500 h-2 rounded-full transition-all duration-300"
										style="width: {getProgressPercentage(quest)}%"
									></div>
								</div>
							</div>
						{/if}

						<!-- Objectives -->
						{#if quest.objectives.length > 0}
							<div class="space-y-2">
								<h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100">
									Objectives
								</h4>
								<ul class="space-y-1">
									{#each quest.objectives as objective (objective.id)}
										<li class="flex items-start gap-2 text-sm">
											<span class={objective.completed ? 'text-success-500' : 'text-surface-500'}>
												{objective.completed ? '✓' : '○'}
											</span>
											<span class={objective.completed ? 'line-through text-surface-500' : 'text-surface-700 dark:text-surface-300'}>
												{objective.description}
												{#if objective.required > 1}
													<span class="text-surface-600 dark:text-surface-400">
														({objective.progress}/{objective.required})
													</span>
												{/if}
											</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
