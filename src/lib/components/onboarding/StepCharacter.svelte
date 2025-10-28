<script lang="ts">
	export let name: string;
	export let appearance: string;
	export let setName: (v: string) => void;
	export let setAppearance: (v: string) => void;
</script>

<div class="card bg-surface-100-900 mx-auto max-w-md space-y-4 p-10 text-left">
	<h2 class="h3 mb-4">Character</h2>
	<label class="block">
		<span class="font-semibold">Name</span>
		<input
			class="input w-full"
			value={name}
			on:input={(e) => setName((e.target as HTMLInputElement).value)}
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
			on:input={(e) => setAppearance((e.target as HTMLInputElement).value)}
			maxlength="64"
			placeholder="Short description or keywords"
		/>
	</label>
</div>
