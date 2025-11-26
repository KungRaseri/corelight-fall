<script lang="ts">
	import QuestList from '$lib/components/gameplay/QuestList.svelte';
	import RelationshipTracker from '$lib/components/gameplay/RelationshipTracker.svelte';
	import FragmentInventory from '$lib/components/gameplay/FragmentInventory.svelte';
	import DialogueInterface from '$lib/components/gameplay/DialogueInterface.svelte';
	
	let showDialogue = $state(false);
	let selectedDialogueId = $state(1); // Default to first dialogue tree
	
	function openDialogue(treeId: number) {
		selectedDialogueId = treeId;
		showDialogue = true;
	}
	
	function closeDialogue() {
		showDialogue = false;
	}
</script>

<svelte:head>
	<title>Component Demo - Corelight Fall</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-2">
			Component Demo
		</h1>
		<p class="text-surface-600 dark:text-surface-400">
			Testing ground for all gameplay components
		</p>
	</div>

	<!-- Dialogue Test Section -->
	<div class="mb-8 card preset-outlined-surface-200-800 bg-surface-50 dark:bg-surface-900 p-6">
		<h2 class="text-2xl font-bold mb-4 text-surface-900 dark:text-surface-100">
			Dialogue System
		</h2>
		<div class="flex gap-3">
			<button 
				class="btn preset-filled-primary flex items-center gap-2"
				onclick={() => openDialogue(1)}
			>
				<span>Test Dialogue #1</span>
			</button>
			<button 
				class="btn preset-filled-secondary flex items-center gap-2"
				onclick={() => openDialogue(2)}
			>
				<span>Test Dialogue #2</span>
			</button>
		</div>
		
		{#if showDialogue}
			<div class="mt-6">
				<DialogueInterface 
					dialogueTreeId={selectedDialogueId}
					onClose={closeDialogue}
				/>
			</div>
		{/if}
	</div>

	<!-- Quests Section -->
	<div class="mb-8">
		<h2 class="text-2xl font-bold mb-4 text-surface-900 dark:text-surface-100">
			Quest System
		</h2>
		<QuestList />
	</div>

	<!-- Relationships Section -->
	<div class="mb-8">
		<h2 class="text-2xl font-bold mb-4 text-surface-900 dark:text-surface-100">
			NPC Relationships
		</h2>
		<RelationshipTracker />
	</div>

	<!-- Fragments Section -->
	<div class="mb-8">
		<h2 class="text-2xl font-bold mb-4 text-surface-900 dark:text-surface-100">
			Fragment Collection
		</h2>
		<FragmentInventory />
	</div>
</div>
