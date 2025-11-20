<script lang="ts">
	interface Props {
		name: string;
		appearance: string;
		setName: (v: string) => void;
		setAppearance: (v: string) => void;
	}

	let { name, appearance, setName, setAppearance }: Props = $props();
	
	// Local state that syncs with props
	let localName = $state(name);
	let localAppearance = $state(appearance);
	
	// Update local state when props change
	$effect(() => {
		localName = name;
		localAppearance = appearance;
	});
	
	function handleNameInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		localName = value;
		setName(value);
	}
	
	function handleAppearanceInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		localAppearance = value;
		setAppearance(value);
	}
</script>

<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 mx-auto max-w-md space-y-6 p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-bold text-primary-500 dark:text-primary-400">Character Creation</h2>
		<p class="text-surface-700 dark:text-surface-300 text-sm">
			Choose a name and describe your character's appearance.
		</p>
	</div>

	<label class="label">
		<span class="font-semibold text-surface-900 dark:text-surface-100">Character Name</span>
		<input
			class="input preset-glass-surface mt-2"
			type="text"
			value={localName}
			oninput={handleNameInput}
			required
			maxlength="24"
			placeholder="Enter your character's name"
			aria-label="Character name"
		/>
	</label>

	<label class="label">
		<span class="font-semibold text-surface-900 dark:text-surface-100">Appearance</span>
		<input
			class="input preset-glass-surface mt-2"
			type="text"
			value={localAppearance}
			oninput={handleAppearanceInput}
			maxlength="64"
			placeholder="Brief description (e.g., 'tall, scarred, wearing leather armor')"
			aria-label="Character appearance"
		/>
		<p class="text-surface-500 dark:text-surface-400 mt-1 text-xs">Optional: Describe your character's look</p>
	</label>
</div>






