<script lang="ts">
	import { 
		User, 
		ArrowLeft, 
		Calendar, 
		Sword, 
		Heart, 
		Coins, 
		Star,
		Book,
		MapPin,
		Package,
		Users,
		TrendingUp,
		CheckCircle2,
		Circle,
		RotateCcw,
		Trash2,
		AlertTriangle
	} from 'lucide-svelte';
	import { goto, invalidateAll } from '$app/navigation';

	const { data } = $props();

	let isResettingProgress = $state(false);
	let isDeletingCharacter = $state(false);
	let isResettingAll = $state(false);
	let showConfirmProgress = $state(false);
	let showConfirmCharacter = $state(false);
	let showConfirmAll = $state(false);

	// Group attributes by category
	const attributesByCategory = $derived(() => {
		const grouped: Record<string, any[]> = {};
		for (const attr of data.attributes) {
			if (!grouped[attr.category]) {
				grouped[attr.category] = [];
			}
			grouped[attr.category].push(attr);
		}
		return grouped;
	});

	async function resetStoryProgress() {
		isResettingProgress = true;
		showConfirmProgress = false;

		try {
			const res = await fetch('/api/admin/user/reset-progress', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: data.user.id })
			});

			if (res.ok) {
				alert('Story progress reset successfully!');
				await goto(`/admin/user/${data.user.id}`, { invalidateAll: true });
			} else {
				const error = await res.json();
				alert(`Error: ${error.message || 'Failed to reset progress'}`);
			}
		} catch (err) {
			alert('Failed to reset progress. Please try again.');
		} finally {
			isResettingProgress = false;
		}
	}

	async function deleteCharacter() {
		isDeletingCharacter = true;
		showConfirmCharacter = false;

		try {
			const res = await fetch('/api/admin/user/delete-character', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: data.user.id })
			});

			if (res.ok) {
				alert('Character deleted successfully!');
				await goto(`/admin/user/${data.user.id}`, { invalidateAll: true });
			} else {
				const error = await res.json();
				alert(`Error: ${error.message || 'Failed to delete character'}`);
			}
		} catch (err) {
			alert('Failed to delete character. Please try again.');
		} finally {
			isDeletingCharacter = false;
		}
	}

	async function resetAllData() {
		isResettingAll = true;
		showConfirmAll = false;

		try {
			const res = await fetch('/api/admin/user/reset-all', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: data.user.id })
			});

			if (res.ok) {
				alert('All user game data reset successfully!');
				await goto(`/admin/user/${data.user.id}`, { invalidateAll: true });
			} else {
				const error = await res.json();
				alert(`Error: ${error.message || 'Failed to reset data'}`);
			}
		} catch (err) {
			alert('Failed to reset data. Please try again.');
		} finally {
			isResettingAll = false;
		}
	}
</script>

<div class="space-y-6 p-4 md:p-8">
	<!-- Header with back button -->
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex items-center gap-4">
			<a 
				href="/admin/user" 
				class="btn-icon hover:preset-tonal-surface"
				title="Back to users"
			>
				<ArrowLeft class="size-5" />
			</a>
			<div class="flex items-center gap-3">
				<User class="size-8 text-primary-500 dark:text-primary-400" />
				<h1 class="text-3xl font-bold text-primary-500 dark:text-primary-400">
					{data.user.username}'s Profile
				</h1>
			</div>
		</div>

		<!-- Admin Actions -->
		<div class="flex flex-wrap gap-2">
			{#if data.progress}
				<button
					class="btn preset-tonal-surface flex items-center gap-2"
					onclick={() => showConfirmProgress = true}
					disabled={isResettingProgress}
				>
					<RotateCcw class="size-4" />
					<span>Reset Progress</span>
				</button>
			{/if}
			{#if data.character}
				<button
					class="btn preset-tonal-error flex items-center gap-2"
					onclick={() => showConfirmCharacter = true}
					disabled={isDeletingCharacter}
				>
					<Trash2 class="size-4" />
					<span>Delete Character</span>
				</button>
			{/if}
			{#if data.character || data.progress}
				<button
					class="btn preset-filled-error-500 flex items-center gap-2"
					onclick={() => showConfirmAll = true}
					disabled={isResettingAll}
				>
					<AlertTriangle class="size-4" />
					<span>Reset All Data</span>
				</button>
			{/if}
		</div>
	</div>

	<!-- User Info Card -->
	<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6">
		<h2 class="mb-4 text-2xl font-bold text-primary-500 dark:text-primary-400">User Information</h2>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<div>
				<div class="text-sm text-surface-500 dark:text-surface-400">User ID</div>
				<div class="font-mono text-lg text-surface-900 dark:text-surface-100">#{data.user.id}</div>
			</div>
			<div>
				<div class="text-sm text-surface-500 dark:text-surface-400">Username</div>
				<div class="text-lg font-semibold text-surface-900 dark:text-surface-100">{data.user.username}</div>
			</div>
			<div>
				<div class="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-1">
					<Calendar class="size-4" />
					Joined
				</div>
				<div class="text-lg text-surface-900 dark:text-surface-100">
					{data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : 'N/A'}
				</div>
			</div>
		</div>
	</div>

	{#if data.character}
		<!-- Character Info -->
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6">
			<h2 class="mb-4 text-2xl font-bold text-primary-500 dark:text-primary-400 flex items-center gap-2">
				<Sword class="size-6" />
				Character: {data.character.name}
			</h2>
			
			<!-- Character Stats -->
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
				<div class="card preset-outlined-surface-200-800 p-4">
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-primary-500/10 dark:bg-primary-400/10 p-3">
							<Star class="size-6 text-primary-500 dark:text-primary-400" />
						</div>
						<div>
							<div class="text-sm text-surface-500 dark:text-surface-400">Level</div>
							<div class="text-2xl font-bold text-surface-900 dark:text-surface-100">{data.character.level}</div>
						</div>
					</div>
				</div>

				<div class="card preset-outlined-surface-200-800 p-4">
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-secondary-500/10 dark:bg-secondary-400/10 p-3">
							<TrendingUp class="size-6 text-secondary-500 dark:text-secondary-400" />
						</div>
						<div>
							<div class="text-sm text-surface-500 dark:text-surface-400">XP</div>
							<div class="text-2xl font-bold text-surface-900 dark:text-surface-100">{data.character.xp}</div>
						</div>
					</div>
				</div>

				<div class="card preset-outlined-surface-200-800 p-4">
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-error-500/10 dark:bg-error-400/10 p-3">
							<Heart class="size-6 text-error-500 dark:text-error-400" />
						</div>
						<div>
							<div class="text-sm text-surface-500 dark:text-surface-400">HP</div>
							<div class="text-2xl font-bold text-surface-900 dark:text-surface-100">
								{data.character.hp}/{data.character.maxHp}
							</div>
						</div>
					</div>
				</div>

				<div class="card preset-outlined-surface-200-800 p-4">
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-warning-500/10 dark:bg-warning-400/10 p-3">
							<Coins class="size-6 text-warning-500 dark:text-warning-400" />
						</div>
						<div>
							<div class="text-sm text-surface-500 dark:text-surface-400">Gold</div>
							<div class="text-2xl font-bold text-surface-900 dark:text-surface-100">{data.character.gold}</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Background -->
			{#if data.character.background}
				<div class="mb-4">
					<div class="mb-2 text-sm font-semibold text-surface-700 dark:text-surface-300">Background</div>
					<p class="text-surface-700 dark:text-surface-300">{data.character.background}</p>
				</div>
			{/if}

			<!-- Attributes -->
			{#if data.attributes.length > 0}
				<div>
					<h3 class="mb-3 text-lg font-bold text-surface-900 dark:text-surface-100">Attributes</h3>
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{#each Object.entries(attributesByCategory()) as [category, attrs]}
							<div class="card preset-outlined-surface-200-800 p-4">
								<div class="mb-2 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400">{category}</div>
								<div class="space-y-2">
									{#each attrs as attr}
										<div class="flex items-center justify-between">
											<span class="text-sm text-surface-700 dark:text-surface-300">{attr.name}</span>
											<span class="font-bold text-surface-900 dark:text-surface-100">{attr.value}</span>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Inventory -->
		{#if data.inventory.length > 0}
			<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6">
				<h2 class="mb-4 text-2xl font-bold text-primary-500 dark:text-primary-400 flex items-center gap-2">
					<Package class="size-6" />
					Inventory ({data.inventory.length} items)
				</h2>
				<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
					{#each data.inventory as invItem}
						<div class="card preset-outlined-surface-200-800 p-4">
							<div class="flex items-start justify-between mb-2">
								<div class="flex-1">
									<div class="font-semibold text-surface-900 dark:text-surface-100">{invItem.name}</div>
									<div class="text-xs text-surface-500 dark:text-surface-400">{invItem.type}</div>
								</div>
								{#if invItem.equipped}
									<span class="badge preset-filled-primary-500 text-xs">Equipped</span>
								{/if}
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-surface-600 dark:text-surface-400">Qty: {invItem.quantity}</span>
								<span class="badge preset-tonal text-xs capitalize">{invItem.rarity}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Factions -->
		{#if data.factions.length > 0}
			<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6">
				<h2 class="mb-4 text-2xl font-bold text-primary-500 dark:text-primary-400 flex items-center gap-2">
					<Users class="size-6" />
					Faction Reputation
				</h2>
				<div class="space-y-3">
					{#each data.factions as factionRep}
						<div class="card preset-outlined-surface-200-800 p-4">
							<div class="flex items-center justify-between mb-2">
								<div>
									<div class="font-semibold text-surface-900 dark:text-surface-100">{factionRep.name}</div>
									{#if factionRep.description}
										<div class="text-sm text-surface-600 dark:text-surface-400">{factionRep.description}</div>
									{/if}
								</div>
								<div class="text-right">
									<div class="text-2xl font-bold text-primary-500 dark:text-primary-400">
										{factionRep.reputation}
									</div>
									<div class="text-xs text-surface-500 dark:text-surface-400">Reputation</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<!-- No Character -->
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-12 text-center">
			<Sword class="size-16 mx-auto mb-4 text-surface-400" />
			<h2 class="text-xl font-semibold mb-2 text-surface-700 dark:text-surface-300">No Character Created</h2>
			<p class="text-surface-600 dark:text-surface-400">This user hasn't created a character yet.</p>
		</div>
	{/if}

	<!-- Story Progress -->
	{#if data.progress}
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6">
			<h2 class="mb-4 text-2xl font-bold text-primary-500 dark:text-primary-400 flex items-center gap-2">
				<Book class="size-6" />
				Story Progress
			</h2>

			<div class="space-y-4">
				<!-- Intro Stage -->
				<div>
					<div class="mb-2 text-sm font-semibold text-surface-700 dark:text-surface-300">Introduction Stage</div>
					<div class="flex items-center gap-2">
						{#if data.progress.introStage === 'main_story'}
							<CheckCircle2 class="size-5 text-secondary-500" />
							<span class="text-surface-900 dark:text-surface-100">Completed - In Main Story</span>
						{:else if data.progress.introStage === 'arc_choice'}
							<Circle class="size-5 text-primary-500" />
							<span class="text-surface-900 dark:text-surface-100">At Arc Choice</span>
						{:else if data.progress.introStage === 'story_prologue'}
							<Circle class="size-5 text-primary-500" />
							<span class="text-surface-900 dark:text-surface-100">Reading Story Prologue</span>
						{:else if data.progress.introStage === 'world_intro'}
							<Circle class="size-5 text-primary-500" />
							<span class="text-surface-900 dark:text-surface-100">Reading World Introduction</span>
						{:else}
							<Circle class="size-5 text-surface-400" />
							<span class="text-surface-600 dark:text-surface-400">Not Started</span>
						{/if}
					</div>
				</div>

				<!-- Current Storyline -->
				{#if data.currentStoryline}
					<div class="card preset-outlined-surface-200-800 p-4">
						<div class="mb-1 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400">Current Storyline</div>
						<div class="text-xl font-bold text-surface-900 dark:text-surface-100">{data.currentStoryline.title}</div>
						{#if data.currentStoryline.description}
							<p class="mt-2 text-surface-700 dark:text-surface-300">{data.currentStoryline.description}</p>
						{/if}
					</div>
				{/if}

				<!-- Current Quest -->
				{#if data.currentQuest}
					<div class="card preset-outlined-surface-200-800 p-4">
						<div class="mb-1 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400">Current Quest</div>
						<div class="text-lg font-bold text-surface-900 dark:text-surface-100">{data.currentQuest.title}</div>
						{#if data.currentQuest.description}
							<p class="mt-2 text-surface-700 dark:text-surface-300">{data.currentQuest.description}</p>
						{/if}
					</div>
				{/if}

				<!-- Current Encounter -->
				{#if data.currentEncounter}
					<div class="card preset-outlined-surface-200-800 p-4">
						<div class="mb-1 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 flex items-center gap-2">
							<MapPin class="size-4" />
							Current Encounter
						</div>
						<div class="text-lg font-bold text-surface-900 dark:text-surface-100">{data.currentEncounter.title}</div>
						{#if data.currentEncounter.description}
							<p class="mt-2 text-surface-700 dark:text-surface-300">{data.currentEncounter.description}</p>
						{/if}
						{#if data.currentEncounter.type}
							<div class="mt-3">
								<span class="badge preset-tonal text-xs capitalize">{data.currentEncounter.type}</span>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Last Choice -->
				{#if data.lastChoice}
					<div class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 p-4">
						<div class="mb-1 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400">Last Choice Made</div>
						<div class="text-surface-900 dark:text-surface-100 font-semibold">{data.lastChoice.text}</div>
						{#if data.lastChoice.outcome}
							<p class="mt-2 text-sm text-surface-700 dark:text-surface-300 italic">{data.lastChoice.outcome}</p>
						{/if}
					</div>
				{/if}

				<!-- Progress Timestamps -->
				<div class="grid gap-4 md:grid-cols-2 text-sm">
					<div>
						<span class="text-surface-500 dark:text-surface-400">Started:</span>
						<span class="ml-2 text-surface-900 dark:text-surface-100">
							{data.progress.createdAt ? new Date(data.progress.createdAt).toLocaleString() : 'N/A'}
						</span>
					</div>
					<div>
						<span class="text-surface-500 dark:text-surface-400">Last Updated:</span>
						<span class="ml-2 text-surface-900 dark:text-surface-100">
							{data.progress.updatedAt ? new Date(data.progress.updatedAt).toLocaleString() : 'N/A'}
						</span>
					</div>
				</div>
			</div>
		</div>
	{:else if data.character}
		<!-- No Progress -->
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-12 text-center">
			<Book class="size-16 mx-auto mb-4 text-surface-400" />
			<h2 class="text-xl font-semibold mb-2 text-surface-700 dark:text-surface-300">No Story Progress</h2>
			<p class="text-surface-600 dark:text-surface-400">This player hasn't started their journey yet.</p>
		</div>
	{/if}
</div>

<!-- Confirmation Dialogs -->
{#if showConfirmProgress}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/50 p-4">
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 max-w-md p-6 shadow-2xl">
			<div class="mb-4 flex items-center gap-3">
				<div class="rounded-lg bg-warning-500/10 dark:bg-warning-400/10 p-3">
					<RotateCcw class="size-6 text-warning-500 dark:text-warning-400" />
				</div>
				<h2 class="text-xl font-bold text-surface-900 dark:text-surface-100">Reset Story Progress?</h2>
			</div>
			<p class="mb-6 text-surface-700 dark:text-surface-300">
				This will delete all story progress for {data.user.username}. They will need to start from the world introduction again. Character data and inventory will be preserved.
			</p>
			<div class="flex gap-3 justify-end">
				<button
					class="btn preset-tonal-surface"
					onclick={() => showConfirmProgress = false}
				>
					Cancel
				</button>
				<button
					class="btn preset-filled-warning-500 flex items-center gap-2"
					onclick={resetStoryProgress}
				>
					<RotateCcw class="size-4" />
					<span>Reset Progress</span>
				</button>
			</div>
		</div>
	</div>
{/if}

{#if showConfirmCharacter}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/50 p-4">
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 max-w-md p-6 shadow-2xl">
			<div class="mb-4 flex items-center gap-3">
				<div class="rounded-lg bg-error-500/10 dark:bg-error-400/10 p-3">
					<Trash2 class="size-6 text-error-500 dark:text-error-400" />
				</div>
				<h2 class="text-xl font-bold text-surface-900 dark:text-surface-100">Delete Character?</h2>
			</div>
			<p class="mb-6 text-surface-700 dark:text-surface-300">
				This will permanently delete <span class="font-semibold">{data.character?.name}</span> and all associated data (attributes, inventory, equipment, faction reputation). This action cannot be undone.
			</p>
			<div class="flex gap-3 justify-end">
				<button
					class="btn preset-tonal-surface"
					onclick={() => showConfirmCharacter = false}
				>
					Cancel
				</button>
				<button
					class="btn preset-filled-error-500 flex items-center gap-2"
					onclick={deleteCharacter}
				>
					<Trash2 class="size-4" />
					<span>Delete Character</span>
				</button>
			</div>
		</div>
	</div>
{/if}

{#if showConfirmAll}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/50 p-4">
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 max-w-md p-6 shadow-2xl">
			<div class="mb-4 flex items-center gap-3">
				<div class="rounded-lg bg-error-500/10 dark:bg-error-400/10 p-3">
					<AlertTriangle class="size-6 text-error-500 dark:text-error-400" />
				</div>
				<h2 class="text-xl font-bold text-surface-900 dark:text-surface-100">Reset All Game Data?</h2>
			</div>
			<div class="mb-6 space-y-3">
				<p class="text-surface-700 dark:text-surface-300">
					This will permanently delete ALL game data for {data.user.username}:
				</p>
				<ul class="list-disc list-inside space-y-1 text-surface-700 dark:text-surface-300 text-sm">
					<li>Character and all attributes</li>
					<li>Inventory and equipment</li>
					<li>Story progress</li>
					<li>Faction reputation</li>
				</ul>
				<p class="text-sm font-semibold text-error-500 dark:text-error-400">
					The user will need to complete onboarding again. This action cannot be undone.
				</p>
			</div>
			<div class="flex gap-3 justify-end">
				<button
					class="btn preset-tonal-surface"
					onclick={() => showConfirmAll = false}
				>
					Cancel
				</button>
				<button
					class="btn preset-filled-error-500 flex items-center gap-2"
					onclick={resetAllData}
				>
					<AlertTriangle class="size-4" />
					<span>Reset All Data</span>
				</button>
			</div>
		</div>
	</div>
{/if}
