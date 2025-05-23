<script lang="ts">
	const { storyline, currentQuest, currentEncounter, availableChoices, onChoose } = $props();

	import IconFlag from '@lucide/svelte/icons/flag';
	import IconStar from '@lucide/svelte/icons/star';
	import IconSword from '@lucide/svelte/icons/sword';
	import IconUsers from '@lucide/svelte/icons/users';
	import IconBookOpen from '@lucide/svelte/icons/book-open';
	import IconPuzzle from '@lucide/svelte/icons/puzzle';
	import IconMap from '@lucide/svelte/icons/map';

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
</script>

<div class="mx-auto max-w-2xl p-6">
	<h1 class="mb-2 flex items-center gap-2 text-2xl font-bold">
		<IconFlag size={20} class="text-rose-500" />
		{storyline.title}
	</h1>
	<p class="text-surface-500 mb-4">{storyline.description}</p>

	<div class="bg-surface-100 mb-6 rounded p-4 shadow">
		<h2 class="mb-1 flex items-center gap-2 text-lg font-semibold">
			{#if currentQuest.isMainQuest}
				<IconStar size={16} class="text-amber-500" />
			{/if}
			{currentQuest.title}
		</h2>
		<p class="mb-2">{currentQuest.description}</p>
	</div>

	<div class="bg-surface-50 mb-6 flex items-center gap-2 rounded p-4 shadow">
		{#if currentEncounter}
			{@const IconEncounter = getEncounterIcon(currentEncounter.type)}
			<IconEncounter size={20} class="text-sky-500" />
		{/if}

		<div>
			<h3 class="font-semibold">{currentEncounter.title}</h3>
			<p>{currentEncounter.description}</p>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		{#each availableChoices as choice}
			<button class="btn btn-primary" onclick={onChoose(choice)}>
				{choice.text}
			</button>
		{/each}
	</div>
</div>
