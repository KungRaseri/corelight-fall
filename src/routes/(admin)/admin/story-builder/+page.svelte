<script lang="ts">
	import { storylines, selectedStorylineId, selectedStoryLine } from '$lib/stores/storyline';
	import StorylineForm from '$lib/components/admin/StorylineForm.svelte';
	import QuestForm from '$lib/components/admin/QuestForm.svelte';
	import EncounterForm from '$lib/components/admin/EncounterForm.svelte';
	import ChoiceForm from '$lib/components/admin/ChoiceForm.svelte';
	import type { StorylineFormData } from '$lib/types/StorylineFormData';
	import type { QuestFormData } from '$lib/types/QuestFormData';
	import type { EncounterFormData } from '$lib/types/EncounterFormData.js';
	import type { ChoiceFormData } from '$lib/types/ChoiceFormData.js';

	import IconStar from '@lucide/svelte/icons/star';
	import IconPlus from '@lucide/svelte/icons/plus';
	import IconEdit from '@lucide/svelte/icons/pencil';
	import IconFlag from '@lucide/svelte/icons/flag';
	import IconMap from '@lucide/svelte/icons/map';
	import IconGitBranch from '@lucide/svelte/icons/git-branch';
	import IconSword from '@lucide/svelte/icons/sword';
	import IconUsers from '@lucide/svelte/icons/users';
	import IconBookOpen from '@lucide/svelte/icons/book-open';
	import IconPuzzle from '@lucide/svelte/icons/puzzle';
	import IconTrash from '@lucide/svelte/icons/trash';

	const { data } = $props();

	// Initialize store with server data
	storylines.set(data.storylines);

	let creating = $state(false);
	let loadingTree = $state(false);
	let error = $state('');

	let editingQuest: QuestFormData | null = $state(null);
	let editingEncounter: EncounterFormData | null = $state(null);
	let editingChoice: ChoiceFormData | null = $state(null);

	function clearInlineEditing() {
		creating = false;
		editingQuest = null;
		editingEncounter = null;
		editingChoice = null;
	}

	// Fetch the full tree for a storyline
	async function loadStorylineTree(id: number | null) {
		if (!id) throw new Error('Storyline ID is required');
		loadingTree = true;
		error = '';
		const res = await fetch(`/api/admin/storyline/${id}/tree`);
		if (res.ok) {
			selectedStoryLine.set(await res.json());
		} else {
			error = 'Failed to load storyline tree';
		}
		loadingTree = false;
	}

	function selectStoryline(id: number | null) {
		if (!id) throw new Error('Storyline ID is required');
		clearInlineEditing();

		selectedStorylineId.set(id);
		loadStorylineTree(id);
	}

	async function handleStorylineCreated(data: StorylineFormData) {
		selectedStorylineId.set(data.id);
		creating = false;

		const res = await fetch('/api/admin/storyline', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});

		if (!res.ok) {
			error = 'Failed to create storyline';
			return;
		}
		const result = await res.json();

		await loadStorylineTree(result.storyline.id);
		storylines.update((list) => [...list, result.storyline]);
	}

	async function handleQuestSave(data: QuestFormData) {
		const res = await fetch('/api/admin/quest', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});

		if (!res.ok) {
			error = 'Failed to save quest';
			return;
		}

		const result = await res.json();

		selectedStoryLine.update((tree) => {
			if (!tree) return tree;
			if (!tree.quests) tree.quests = [];
			const idx = tree.quests.findIndex((q) => q.id === result.quest.id);
			if (idx >= 0) tree.quests[idx] = result.quest;
			else tree.quests = [...tree.quests, result.quest];
			return tree;
		});

		editingQuest = null;
	}

	async function handleEncounterSave(data: EncounterFormData) {
		const res = await fetch('/api/admin/encounter', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});

		if (!res.ok) {
			error = 'Failed to save encounter';
			return;
		}

		const result = await res.json();

		selectedStoryLine.update((tree) => {
			if (!tree || !tree.quests) return tree;
			const questIdx = tree.quests.findIndex((q) => q.id === data.questId);
			if (questIdx === -1) return tree;

			const questCopy = { ...tree.quests[questIdx] };
			const encounters = questCopy.encounters ? [...questCopy.encounters] : [];
			const idx = encounters.findIndex((e) => e.id === result.encounter.id);
			if (idx >= 0) encounters[idx] = result.encounter;
			else encounters.push(result.encounter);
			questCopy.encounters = encounters;

			const quests = [...tree.quests];
			quests[questIdx] = questCopy;

			return { ...tree, quests };
		});

		editingEncounter = null;
	}

	async function handleChoiceSave(data: ChoiceFormData) {
		const res = await fetch('/api/admin/choice', {
			method: 'POST',
		 headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});

		if (!res.ok) {
			error = 'Failed to save choice';
			return;
		}

		const result = await res.json();

		selectedStoryLine.update((tree) => {
			if (!tree || !tree.quests) return tree;
			// Find the quest containing this encounter
			const questIdx = tree.quests.findIndex(
				(q) => q.encounters && q.encounters.some((e) => e.id === data.encounterId)
			);
			if (questIdx === -1) return tree;

			const questCopy = { ...tree.quests[questIdx] };
			const encounters = questCopy.encounters ? [...questCopy.encounters] : [];
			const encounterIdx = encounters.findIndex((e) => e.id === data.encounterId);
			if (encounterIdx === -1) return tree;

			const encounterCopy = { ...encounters[encounterIdx] };
			const choices = encounterCopy.choices ? [...encounterCopy.choices] : [];
			const choiceIdx = choices.findIndex((c) => c.id === result.choice.id);
			if (choiceIdx >= 0) choices[choiceIdx] = result.choice;
			else choices.push(result.choice);
			encounterCopy.choices = choices;

			encounters[encounterIdx] = encounterCopy;
			questCopy.encounters = encounters;

			const quests = [...tree.quests];
			quests[questIdx] = questCopy;

			return { ...tree, quests };
		});

		editingChoice = null;
	}

	// Helper to pick icon based on encounter type
	function getEncounterIcon(type: string | undefined) {
		switch (type) {
			case 'combat':
				return IconSword;
			case 'dialogue':
				return IconUsers;
			case 'story':
				return IconBookOpen;
			case 'puzzle':
				return IconPuzzle;
			default:
				return IconMap;
		}
	}

	// Example delete handlers (implement API calls as needed)
	async function deleteStoryline(id: number | null) {
		if (!id) return;
		if (!confirm('Delete this storyline?')) return;
		await fetch(`/api/admin/storyline/${id}`, { method: 'DELETE' });
		storylines.update((list) => list.filter((s) => s.id !== id));
		if ($selectedStorylineId === id) {
			selectedStorylineId.set(null);
			selectedStoryLine.set(null);
		}
	}

	async function deleteQuest(id: number | null) {
		if (!id) return;
		if (!confirm('Delete this quest?')) return;
		await fetch(`/api/admin/quest/${id}`, { method: 'DELETE' });
		selectedStoryLine.update((tree) => {
			if (!tree) return tree;
			tree.quests = tree.quests?.filter((q) => q.id !== id) ?? [];
			return { ...tree };
		});
	}

	async function deleteEncounter(questId: number | null, encounterId: number | null) {
		if (!questId || !encounterId) return;
		if (!confirm('Delete this encounter?')) return;
		await fetch(`/api/admin/encounter/${encounterId}`, { method: 'DELETE' });
		selectedStoryLine.update((tree) => {
			if (!tree) return tree;
			const quest = tree.quests?.find((q) => q.id === questId);
			if (quest) quest.encounters = quest.encounters?.filter((e) => e.id !== encounterId) ?? [];
			return { ...tree };
		});
	}

	async function deleteChoice(encounterId: number | null, choiceId: number | null) {
		if (!encounterId || !choiceId) return;
		if (!confirm('Delete this choice?')) return;
		await fetch(`/api/admin/choice/${choiceId}`, { method: 'DELETE' });
		selectedStoryLine.update((tree) => {
			if (!tree) return tree;
			for (const quest of tree.quests ?? []) {
				const encounter = quest.encounters?.find((e) => e.id === encounterId);
				if (encounter) encounter.choices = encounter.choices?.filter((c) => c.id !== choiceId) ?? [];
			}
			return { ...tree };
		});
	}
</script>

<div class="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:flex-row">
	<!-- Sidebar: Storylines -->
	<aside class="bg-surface-100-900 flex w-full flex-col rounded-lg p-4 shadow md:w-1/4">
		<div class="mb-2 flex items-center justify-between">
			<h2 class="text-lg font-bold">Storylines</h2>
			<button
				class="btn btn-xs btn-success flex items-center gap-1"
				onclick={() => {
					clearInlineEditing();
					selectedStorylineId.set(null); // Clear the selected storyline
					creating = true;
				}}
				title="Add Storyline"
			>
				<IconPlus size={16} />
			</button>
		</div>
		<ul class="flex-1 space-y-1 overflow-y-auto">
			{#each $storylines as s}
				<li class="flex items-center gap-2">
					<button
						class="hover:bg-primary-100/30 w-full rounded px-2 py-1 text-left transition
                            {$selectedStorylineId === s.id ? 'bg-primary-100 font-semibold' : ''}"
						onclick={() => selectStoryline(s.id)}
					>
						{#if s.isMain}
							<IconStar class="mr-2 text-amber-500"></IconStar>
						{/if}
						<span>{s.title}</span>
					</button>
					<button class="btn btn-xs btn-error" title="Delete Storyline" onclick={() => deleteStoryline(s.id)}>
						<IconTrash size={14} />
					</button>
				</li>
			{/each}
		</ul>
	</aside>

	<!-- Main Panel -->
	<main class="flex flex-1 flex-col gap-4">
		{#if creating}
			<div class="mt-2">
				<StorylineForm
					storyline={null}
					loading={false}
					onSave={handleStorylineCreated}
					onCancel={clearInlineEditing}
				/>
			</div>
		{/if}
		{#if !$selectedStorylineId}
			<div class="text-surface-500 mt-16 text-center">
				<p>Select a storyline to begin editing.</p>
			</div>
		{:else if loadingTree}
			<div class="flex h-32 items-center justify-center">
				<p>Loading...</p>
			</div>
		{:else if error}
			<p class="text-red-500">{error}</p>
		{:else if $selectedStoryLine}
			<div class="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
				<div>
					<h2 class="mb-1 text-2xl font-bold">{$selectedStoryLine.title}</h2>
					<p class="text-surface-500">{$selectedStoryLine.description}</p>
				</div>
				<div class="mt-2 flex gap-2 md:mt-0">
					<button
						class="btn btn-primary flex items-center gap-1"
						onclick={() => {
							clearInlineEditing();
							editingQuest = {
								id: null,
								storylineId: $selectedStoryLine.id,
								title: '',
								description: '',
								order: $selectedStoryLine.quests?.length ?? 0,
								isMainQuest: false,
								encounters: [],
								createdAt: new Date(),
								updatedAt: new Date()
							};
						}}
						title="Add Quest"
					>
						<IconPlus size={18} />
					</button>
				</div>
			</div>
			<!-- Hierarchical Outline -->
			<div class="flex flex-col gap-4 md:flex-row">
				<!-- Outline Panel -->
				<div class="w-full md:w-1/2">
					<ul>
						{#each $selectedStoryLine.quests ?? [] as quest}
							<li class="mb-4">
								<div class="flex items-center gap-2">
									<!-- Quest icon and main quest star -->
									<span title="Quest"><IconFlag size={16} class="text-emerald-500" /></span>
									{#if quest.isMainQuest}
										<span title="Main Quest"><IconStar size={14} class="text-amber-500" /></span>
									{/if}
									<span class="font-semibold">{quest.title}</span>
									<button
										class="btn btn-xs btn-secondary flex items-center"
										onclick={() => {
											clearInlineEditing();
											editingQuest = quest;
										}}
										title="Edit Quest"
									>
										<IconEdit size={16} />
									</button>
									<button
										class="btn btn-xs btn-error flex items-center"
										title="Delete Quest"
										onclick={() => deleteQuest(quest.id)}
									>
										<IconTrash size={16} />
									</button>
									<button
										class="btn btn-xs btn-primary flex items-center"
										onclick={() => {
											clearInlineEditing();
											editingEncounter = {
												id: null,
												questId: quest.id,
												title: '',
												description: '',
												type: '',
												order: quest.encounters?.length ?? 0,
												choices: [],
												createdAt: new Date(),
												updatedAt: new Date()
											};
										}}
										title="Add Encounter"
									>
										<IconPlus size={16} />
									</button>
								</div>
								<ul class="mt-1 ml-6">
									{#each quest.encounters ?? [] as encounter}
										{@const IconEncounter = getEncounterIcon(encounter.type)}
										<li class="mb-2">
											<div class="flex items-center gap-2">
												<!-- Encounter icon based on type -->
												<span
													title={encounter.type
														? `${encounter.type.charAt(0).toUpperCase() + encounter.type.slice(1)} Encounter`
														: 'Encounter'}
												>
													<IconEncounter size={15} class="text-sky-500" />
												</span>

												<span>{encounter.title}</span>
												<button
													class="btn btn-xs btn-secondary flex items-center"
													onclick={() => {
														clearInlineEditing();
														editingEncounter = encounter;
													}}
													title="Edit Encounter"
												>
													<IconEdit size={16} />
												</button>
												<button
													class="btn btn-xs btn-error flex items-center"
													title="Delete Encounter"
													onclick={() => deleteEncounter(quest.id, encounter.id)}
												>
													<IconTrash size={16} />
												</button>
												<button
													class="btn btn-xs btn-primary flex items-center"
													onclick={() => {
														clearInlineEditing();
														editingChoice = {
															id: null,
															encounterId: encounter.id,
															text: '',
															nextEncounterId: null,
															outcome: '',
															order: encounter.choices?.length ?? 0,
															createdAt: new Date(),
															updatedAt: new Date()
														};
													}}
													title="Add Choice"
												>
													<IconPlus size={16} />
												</button>
											</div>
											<ul class="mt-1 ml-6">
												{#each encounter.choices ?? [] as choice}
													<li class="mb-1 flex items-center gap-2">
														<!-- Choice icon -->
														<span title="Choice"
															><IconGitBranch size={14} class="text-amber-500" /></span
														>
														<span>{choice.text}</span>
														<button
															class="btn btn-xs btn-secondary flex items-center"
															onclick={() => {
																clearInlineEditing();
																editingChoice = choice;
															}}
															title="Edit Choice"
														>
															<IconEdit size={16} />
														</button>
														<button
															class="btn btn-xs btn-error flex items-center"
															title="Delete Choice"
															onclick={() => deleteChoice(encounter.id, choice.id)}
														>
															<IconTrash size={16} />
														</button>
													</li>
												{/each}
											</ul>
										</li>
									{/each}
								</ul>
							</li>
						{/each}
					</ul>
				</div>
				<!-- Form Panel -->
				<div class="w-full md:w-1/2">
					{#if editingQuest}
						{#key editingQuest?.id ?? 'new'}
							<div class="mb-4 flex items-center gap-2 border-b pb-2">
								{#if editingQuest.id}
									<span class="text-surface-500 text-xs">Editing</span>
								{:else}
									<span class="text-surface-500 text-xs">New</span>
								{/if}
								<span class="font-bold tracking-wide text-emerald-500 uppercase">Quest</span>
							</div>
							<QuestForm
								loading={false}
								quest={editingQuest}
								onSave={handleQuestSave}
								onCancel={() => (editingQuest = null)}
							/>
						{/key}
					{:else if editingEncounter}
						{#key editingEncounter?.id ?? 'new'}
							<div class="mb-4 flex items-center gap-2 border-b pb-2">
								{#if editingEncounter.id}
									<span class="text-surface-500 text-xs">Editing</span>
								{:else}
									<span class="text-surface-500 text-xs">New</span>
								{/if}
								<span class="font-bold tracking-wide text-sky-500 uppercase">Encounter</span>
								{#if editingEncounter.questId}
									<span class="text-surface-400 text-xs"
										>for Quest ID {editingEncounter.questId}</span
									>
								{/if}
							</div>
							<EncounterForm
								loading={false}
								encounter={editingEncounter}
								quests={$selectedStoryLine.quests ?? []}
								onSave={handleEncounterSave}
								onCancel={() => (editingEncounter = null)}
							/>
						{/key}
					{:else if editingChoice}
						{#key editingChoice?.id ?? 'new'}
							<div class="mb-4 flex items-center gap-2 border-b pb-2">
								{#if editingChoice.id}
									<span class="text-surface-500 text-xs">Editing</span>
								{:else}
									<span class="text-surface-500 text-xs">New</span>
								{/if}
								<span class="font-bold tracking-wide text-emerald-500 uppercase">Choice</span>
								{#if editingChoice.encounterId}
									<span class="text-surface-400 text-xs"
										>for Encounter ID {editingChoice.encounterId}</span
									>
								{/if}
							</div>
							<ChoiceForm
								loading={false}
								choice={editingChoice}
								encounters={$selectedStoryLine.quests?.flatMap((q) => q.encounters ?? []) ?? []}
								onSave={handleChoiceSave}
								onCancel={() => (editingChoice = null)}
							/>
						{/key}
					{:else}
						<div class="text-surface-400 mt-8 text-center">Select or add an item to edit.</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div>
