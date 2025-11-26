<script lang="ts">
	import { onMount } from 'svelte';
	
	interface SkillCheck {
		skill: string;
		difficulty: number;
		successText: string;
		failureText: string;
	}
	
	interface Choice {
		id: number;
		text: string;
		skillCheck?: SkillCheck;
		isAvailable: boolean;
	}
	
	interface DialogueNode {
		id: number;
		npcId: number;
		npcName: string;
		text: string;
		emotionalTone: string;
		choices: Choice[];
	}
	
	interface DialogueHistory {
		npcName: string;
		text: string;
		choice?: string;
		timestamp: string;
	}
	
	interface Props {
		dialogueTreeId: number;
		onClose?: () => void;
	}
	
	let { dialogueTreeId, onClose }: Props = $props();
	
	let currentNode = $state<DialogueNode | null>(null);
	let history = $state<DialogueHistory[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let processing = $state(false);
	
	async function loadDialogueTree() {
		try {
			loading = true;
			error = null;
			
			const response = await fetch(`/api/dialogue/${dialogueTreeId}`);
			
			if (!response.ok) {
				throw new Error('Failed to load dialogue');
			}
			
			const data = await response.json();
			currentNode = data;
			
			// Add to history
			if (currentNode) {
				history.push({
					npcName: currentNode.npcName,
					text: currentNode.text,
					timestamp: new Date().toISOString()
				});
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}
	
	async function selectChoice(choiceId: number, choiceText: string) {
		if (!currentNode || processing) return;
		
		try {
			processing = true;
			error = null;
			
			const response = await fetch(`/api/dialogue/${dialogueTreeId}/choice`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ choiceId })
			});
			
			if (!response.ok) {
				throw new Error('Failed to process choice');
			}
			
			const data = await response.json();
			
			// Add player choice to history
			history.push({
				npcName: 'You',
				text: choiceText,
				choice: choiceText,
				timestamp: new Date().toISOString()
			});
			
			// Update current node or end dialogue
			if (data.nextNode) {
				currentNode = data.nextNode;
				
				// Add NPC response to history
				history.push({
					npcName: currentNode!.npcName,
					text: currentNode!.text,
					timestamp: new Date().toISOString()
				});
			} else {
				// Dialogue ended
				if (onClose) {
					onClose();
				}
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			processing = false;
		}
	}
	
	function getToneColor(tone: string): string {
		const toneColors: Record<string, string> = {
			friendly: 'text-success-500',
			neutral: 'text-surface-600 dark:text-surface-400',
			hostile: 'text-error-500',
			curious: 'text-tertiary-500',
			concerned: 'text-warning-500',
			grateful: 'text-primary-500'
		};
		
		return toneColors[tone.toLowerCase()] || 'text-surface-600 dark:text-surface-400';
	}
	
	function getDifficultyLabel(difficulty: number): { label: string; color: string } {
		if (difficulty <= 5) return { label: 'Easy', color: 'text-success-500' };
		if (difficulty <= 10) return { label: 'Medium', color: 'text-warning-500' };
		if (difficulty <= 15) return { label: 'Hard', color: 'text-error-500' };
		return { label: 'Very Hard', color: 'text-error-700 dark:text-error-400' };
	}
	
	onMount(() => {
		loadDialogueTree();
	});
</script>

<div class="dialogue-interface bg-surface-50 dark:bg-surface-900 rounded-lg shadow-xl p-6 max-w-3xl mx-auto">
	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-center">
				<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
				<p class="text-surface-600 dark:text-surface-400">Loading dialogue...</p>
			</div>
		</div>
	{:else if error}
		<div class="card preset-outlined-error p-6 text-center">
			<p class="text-error-500 mb-4">⚠️ {error}</p>
			<button 
				class="btn preset-tonal-error"
				onclick={loadDialogueTree}
			>
				Retry
			</button>
		</div>
	{:else if currentNode}
		<!-- Dialogue History -->
		{#if history.length > 1}
			<div class="mb-6 max-h-64 overflow-y-auto space-y-3 p-4 bg-surface-100 dark:bg-surface-800 rounded-lg">
				{#each history.slice(0, -1) as entry}
					<div class="text-sm">
						<span class="font-bold {entry.npcName === 'You' ? 'text-primary-500' : 'text-secondary-500'}">
							{entry.npcName}:
						</span>
						<span class="text-surface-700 dark:text-surface-300 ml-2">
							{entry.text}
						</span>
					</div>
				{/each}
			</div>
		{/if}
		
		<!-- Current NPC Dialogue -->
		<div class="mb-6 p-6 bg-surface-100 dark:bg-surface-800 rounded-lg border-l-4 border-secondary-500">
			<div class="flex items-start gap-4 mb-3">
				<div class="shrink-0 w-12 h-12 rounded-full bg-secondary-500 flex items-center justify-center text-white font-bold text-lg">
					{currentNode.npcName.charAt(0)}
				</div>
				<div class="flex-1">
					<h3 class="text-xl font-bold text-surface-900 dark:text-surface-100 mb-1">
						{currentNode.npcName}
					</h3>
					<span class="text-sm {getToneColor(currentNode.emotionalTone)} italic">
						[{currentNode.emotionalTone}]
					</span>
				</div>
			</div>
			
			<p class="text-surface-800 dark:text-surface-200 text-lg leading-relaxed">
				{currentNode.text}
			</p>
		</div>
		
		<!-- Player Choices -->
		{#if currentNode.choices.length > 0}
			<div class="space-y-3">
				<h4 class="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wide mb-3">
					Your Response:
				</h4>
				
				{#each currentNode.choices as choice}
					<button
						class="w-full text-left p-4 rounded-lg transition-all duration-200 {choice.isAvailable 
							? 'bg-surface-100 dark:bg-surface-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-surface-300 dark:border-surface-700 hover:border-primary-500 cursor-pointer' 
							: 'bg-surface-200 dark:bg-surface-700 border border-surface-400 dark:border-surface-600 opacity-50 cursor-not-allowed'}"
						disabled={!choice.isAvailable || processing}
						onclick={() => selectChoice(choice.id, choice.text)}
					>
						<div class="flex items-start gap-3">
							<span class="text-primary-500 font-bold text-lg">›</span>
							<div class="flex-1">
								<p class="text-surface-900 dark:text-surface-100 mb-2">
									{choice.text}
								</p>
								
								{#if choice.skillCheck}
									<div class="flex items-center gap-2 text-sm">
										<span class="badge preset-filled-tertiary">
											{choice.skillCheck.skill}
										</span>
										<span class="{getDifficultyLabel(choice.skillCheck.difficulty).color} font-semibold">
											{getDifficultyLabel(choice.skillCheck.difficulty).label} ({choice.skillCheck.difficulty})
										</span>
									</div>
								{/if}
								
								{#if !choice.isAvailable}
									<p class="text-error-500 text-sm mt-2">
										⚠️ Requirements not met
									</p>
								{/if}
							</div>
						</div>
					</button>
				{/each}
			</div>
		{:else}
			<!-- No choices = end of dialogue -->
			<div class="text-center py-6">
				<p class="text-surface-600 dark:text-surface-400 mb-4">
					[End of conversation]
				</p>
				{#if onClose}
					<button 
						class="btn preset-filled-primary"
						onclick={onClose}
					>
						Continue
					</button>
				{/if}
			</div>
		{/if}
		
		<!-- Processing Indicator -->
		{#if processing}
			<div class="mt-4 text-center">
				<div class="inline-flex items-center gap-2 text-primary-500">
					<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
					<span class="text-sm">Processing...</span>
				</div>
			</div>
		{/if}
	{/if}
	
	<!-- Close Button -->
	{#if onClose && !loading}
		<div class="mt-6 pt-6 border-t border-surface-300 dark:border-surface-700 text-center">
			<button 
				class="btn preset-outlined"
				onclick={onClose}
				disabled={processing}
			>
				Close Dialogue
			</button>
		</div>
	{/if}
</div>
