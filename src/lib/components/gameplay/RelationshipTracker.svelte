<script lang="ts">
	import { onMount } from 'svelte';
	
	interface NpcRelationship {
		npcId: number;
		npcName: string;
		npcTitle: string | null;
		relationshipLevel: number;
		relationshipStatus: string;
		totalInteractions: number;
		lastInteractionAt: string | null;
	}
	
	let relationships = $state<NpcRelationship[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	
	onMount(async () => {
		await loadRelationships();
	});
	
	async function loadRelationships() {
		try {
			loading = true;
			const response = await fetch('/api/relationships');
			
			if (!response.ok) {
				throw new Error('Failed to load relationships');
			}
			
			relationships = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
			console.error('Error loading relationships:', err);
		} finally {
			loading = false;
		}
	}
	
	function getRelationshipColor(status: string): string {
		const statusLower = status.toLowerCase();
		if (statusLower.includes('enemies') || statusLower.includes('hostile')) return 'text-error-500';
		if (statusLower.includes('unfriendly') || statusLower.includes('suspicious')) return 'text-warning-500';
		if (statusLower.includes('neutral') || statusLower.includes('stranger')) return 'text-surface-500';
		if (statusLower.includes('friendly') || statusLower.includes('acquaintance')) return 'text-primary-500';
		if (statusLower.includes('trusted') || statusLower.includes('friend')) return 'text-success-500';
		if (statusLower.includes('devoted') || statusLower.includes('beloved')) return 'text-success-600';
		return 'text-surface-500';
	}
	
	function getRelationshipBarColor(status: string): string {
		const statusLower = status.toLowerCase();
		if (statusLower.includes('enemies') || statusLower.includes('hostile')) return 'bg-error-500';
		if (statusLower.includes('unfriendly') || statusLower.includes('suspicious')) return 'bg-warning-500';
		if (statusLower.includes('neutral') || statusLower.includes('stranger')) return 'bg-surface-500';
		if (statusLower.includes('friendly') || statusLower.includes('acquaintance')) return 'bg-primary-500';
		if (statusLower.includes('trusted') || statusLower.includes('friend')) return 'bg-success-500';
		if (statusLower.includes('devoted') || statusLower.includes('beloved')) return 'bg-success-600';
		return 'bg-surface-500';
	}
	
	function getRelationshipPercentage(level: number): number {
		// Convert -100 to 100 range to 0-100 percentage
		return ((level + 100) / 200) * 100;
	}
	
	function formatLastInteraction(dateString: string | null): string {
		if (!dateString) return 'Never';
		
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);
		
		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
		if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
		if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
		return date.toLocaleDateString();
	}
</script>

<div class="w-full space-y-4">
	<!-- Header -->
	<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Relationships</h2>

	<!-- Loading State -->
	{#if loading}
		<div class="card preset-tonal-surface p-8 text-center">
			<p class="text-surface-600 dark:text-surface-400">Loading relationships...</p>
		</div>
	{/if}

	<!-- Error State -->
	{#if error}
		<div class="card preset-filled-error-500 p-4">
			<p class="text-error-contrast-500">Error: {error}</p>
			<button class="btn preset-tonal mt-2" onclick={loadRelationships}>
				Try Again
			</button>
		</div>
	{/if}

	<!-- Relationship List -->
	{#if !loading && !error}
		{#if relationships.length === 0}
			<div class="card preset-tonal-surface p-8 text-center">
				<p class="text-surface-600 dark:text-surface-400">
					You haven't met anyone yet. Explore the world to meet NPCs!
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each relationships as relationship (relationship.npcId)}
					<div class="card preset-outlined-surface-200-800 bg-surface-50 dark:bg-surface-950 p-4 space-y-3">
						<!-- NPC Header -->
						<div class="flex items-start justify-between">
							<div>
								<h3 class="text-lg font-bold text-surface-900 dark:text-surface-100">
									{relationship.npcName}
								</h3>
								{#if relationship.npcTitle}
									<p class="text-sm text-surface-600 dark:text-surface-400">
										{relationship.npcTitle}
									</p>
								{/if}
							</div>
							<span class="badge preset-tonal-surface text-xs">
								{relationship.totalInteractions} interaction{relationship.totalInteractions !== 1 ? 's' : ''}
							</span>
						</div>

						<!-- Relationship Status -->
						<div class="space-y-2">
							<div class="flex items-center justify-between text-sm">
								<span class="text-surface-600 dark:text-surface-400">Status</span>
								<span class="font-semibold {getRelationshipColor(relationship.relationshipStatus)}">
									{relationship.relationshipStatus}
								</span>
							</div>
							
							<!-- Relationship Bar -->
							<div class="w-full bg-surface-200 dark:bg-surface-800 rounded-full h-2 overflow-hidden">
								<div
									class="{getRelationshipBarColor(relationship.relationshipStatus)} h-2 transition-all duration-300"
									style="width: {getRelationshipPercentage(relationship.relationshipLevel)}%"
								></div>
							</div>
							
							<div class="flex items-center justify-between text-xs text-surface-500">
								<span>-100</span>
								<span class="font-semibold">{relationship.relationshipLevel}</span>
								<span>+100</span>
							</div>
						</div>

						<!-- Last Interaction -->
						<div class="text-sm text-surface-600 dark:text-surface-400">
							Last interaction: {formatLastInteraction(relationship.lastInteractionAt)}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
