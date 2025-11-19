<script lang="ts">
	import { FileText, Type, AlignLeft, Save, X } from 'lucide-svelte';

	interface Props {
		item: {
			id: number | null;
			name: string;
			type: string | null;
			description: string | null;
		};
		onSave: (item: typeof item) => void;
		onCancel: () => void;
	}

	let { item, onSave, onCancel }: Props = $props();

	let formData = $state({ ...item });

	function handleSubmit() {
		onSave(formData);
	}
</script>

<div class="card preset-glass-surface p-6 rounded-2xl shadow-lg space-y-6">
	<div class="flex items-center gap-3 mb-6">
		<FileText class="size-6 text-primary-500 dark:text-primary-400" />
		<h2 class="text-2xl font-bold text-primary-500 dark:text-primary-400">
			{formData.id ? 'Edit Item' : 'New Item'}
		</h2>
	</div>

	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
		<!-- Item Name -->
		<label class="label">
			<div class="flex items-center gap-2 mb-2">
				<FileText class="size-4 text-surface-600 dark:text-surface-400" />
				<span class="font-semibold">Name</span>
			</div>
			<input
				type="text"
				class="input"
				placeholder="Healing Potion"
				bind:value={formData.name}
				required
			/>
		</label>

		<!-- Item Type -->
		<label class="label">
			<div class="flex items-center gap-2 mb-2">
				<Type class="size-4 text-surface-600 dark:text-surface-400" />
				<span class="font-semibold">Type</span>
			</div>
			<input
				type="text"
				class="input"
				placeholder="consumable, weapon, armor, quest"
				bind:value={formData.type}
			/>
		</label>

		<!-- Description -->
		<label class="label">
			<div class="flex items-center gap-2 mb-2">
				<AlignLeft class="size-4 text-surface-600 dark:text-surface-400" />
				<span class="font-semibold">Description</span>
			</div>
			<textarea
				class="textarea"
				rows="4"
				placeholder="A healing potion that restores 50 HP..."
				bind:value={formData.description}
			></textarea>
		</label>

		<!-- Action Buttons -->
		<div class="flex gap-4 justify-end pt-4">
			<button type="button" class="btn preset-glass-surface flex items-center gap-2" onclick={onCancel}>
				<X class="size-4" />
				<span>Cancel</span>
			</button>
			<button type="submit" class="btn preset-glass-surface-primary flex items-center gap-2">
				<Save class="size-4" />
				<span>Save Item</span>
			</button>
		</div>
	</form>
</div>
