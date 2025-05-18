<script lang="ts">
	import Recap from '$lib/components/Recap.svelte';
	import CharacterAttributes from '$lib/components/gameplay/CharacterAttributes.svelte';
	// import MapModal from '$lib/components/gameplay/MapModal.svelte';
	// import QuestModal from '$lib/components/gameplay/QuestModal.svelte';
	// import ActivityLogModal from '$lib/components/gameplay/ActivityLogModal.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { character, setCharacterAttributes } from '$lib/stores/character';
	import { onMount } from 'svelte';

	let showCharacter = $state(false);
	let showMap = $state(false);
	let showQuests = $state(false);
	let showLog = $state(false);

	const { data } = $props();

	onMount(() => {
		if (data.character) {
			character.set(data.character);
		}
		if (data.attributes) {
			setCharacterAttributes(data.attributes);
		}
	});
</script>

<div class="space-y-8 p-8">
	<!-- Modal Activation Buttons -->
	<div class="mb-8 flex flex-wrap gap-4">
		<button class="btn btn-primary" onclick={() => (showCharacter = true)}>Character Info</button>
		<button class="btn btn-secondary" onclick={() => (showMap = true)}>Map</button>
		<button class="btn btn-accent" onclick={() => (showQuests = true)}>Quests</button>
		<button class="btn btn-info" onclick={() => (showLog = true)}>Activity Log</button>
	</div>

	<!-- Main Scene Content Area -->
	<div
		class="bg-surface-800 flex min-h-[300px] flex-col items-center justify-center rounded-lg p-6 shadow-lg"
	>
		<!-- Replace this with your actual scene component or logic -->
		<h2 class="mb-2 text-2xl font-bold">Current Scene</h2>
		<p class="text-lg text-gray-300">
			{data.scene?.description ??
				'You are standing at the entrance of a mysterious forest. What will you do next?'}
		</p>
		<!-- You can add scene actions, choices, or visuals here -->
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<!-- Recent Activities -->
		<Recap />
	</div>
</div>

<!-- Modals -->
<Modal open={showCharacter} onClose={() => (showCharacter = false)}>
	<CharacterAttributes />
</Modal>
<!--
<Modal open={showMap} onClose={() => (showMap = false)}>
	<MapModal />
</Modal>
<Modal open={showQuests} onClose={() => (showQuests = false)}>
	<QuestModal />
</Modal>
<Modal open={showLog} onClose={() => (showLog = false)}>
	<ActivityLogModal />
</Modal>
-->
