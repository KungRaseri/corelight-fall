<script lang="ts">
	interface Props {
		name: string;
		appearance: string;
		setName: (v: string) => void;
		setAppearance: (v: string) => void;
	}

	let { name, appearance, setName, setAppearance }: Props = $props();
</script>

<div class="card bg-surface-100 dark:bg-surface-900 mx-auto max-w-md space-y-4 p-10 text-left">
	<h2 class="h3 mb-4">Character</h2>
	<label class="block">
		<span class="font-semibold">Name</span>
		<input
			class="input w-full"
			value={name}
			oninput={(e) => setName((e.target as HTMLInputElement).value)}
			required
			maxlength="24"
			placeholder="Your character's name"
		/>
	</label>
	<label class="block">
		<span class="font-semibold">Appearance</span>
		<input
			class="input w-full"
			value={appearance}
			oninput={(e) => setAppearance((e.target as HTMLInputElement).value)}
			maxlength="64"
			placeholder="Short description or keywords"
		/>
	</label>
</div>
