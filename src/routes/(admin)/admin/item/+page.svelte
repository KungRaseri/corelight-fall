<script lang="ts">
	import ItemForm from '$lib/components/admin/ItemForm.svelte';
	import { onMount } from 'svelte';
	import { Package, Plus, Edit, Trash2, Loader } from 'lucide-svelte';

	const { data } = $props();

	interface ItemData {
		id: number | null;
		name: string;
		type: string | null;
		description: string | null;
	}

	let items = $state<ItemData[]>([]);
	let showForm = $state(false);
	let editingItem = $state<ItemData | null>(null);
	let loading = $state(true);
	let error = $state('');

	function addItem() {
		editingItem = {
			id: null,
			name: '',
			type: null,
			description: null
		};
		showForm = true;
	}

	function editItem(item: ItemData) {
		editingItem = { ...item };
		showForm = true;
	}

	async function saveItem(newItem: ItemData) {
		loading = true;
		error = '';
		const method = newItem.id ? 'PUT' : 'POST';

		const res = await fetch('/api/admin/item', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newItem)
		});

		if (!res.ok) {
			error = 'Failed to save item';
		} else {
			const { item } = await res.json();
			showForm = false;
			const exists = items.some((i) => i.id === item.id);
			if (exists) {
				items = items.map((i) => (i.id === item.id ? { ...i, ...item } : i));
			} else {
				items = [...items, item];
			}
		}
		loading = false;
	}

	async function deleteItem(id: number) {
		if (!confirm('Are you sure you want to delete this item?')) return;

		loading = true;
		error = '';

		const res = await fetch('/api/admin/item', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		if (!res.ok) {
			error = 'Failed to delete item';
		} else {
			items = items.filter((i) => i.id !== id);
		}
		loading = false;
	}

	onMount(async () => {
		items = [...data.items];
		loading = false;
	});
</script>

<div class="container mx-auto p-6 space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<Package class="size-8 text-primary-500 dark:text-primary-400" />
			<h1 class="text-3xl font-bold text-primary-500 dark:text-primary-400">Item Management</h1>
		</div>
		<button class="btn preset-glass-surface-primary flex items-center gap-2" onclick={addItem}>
			<Plus class="size-5" />
			<span>New Item</span>
		</button>
	</div>

	{#if error}
		<div class="card preset-filled-error p-4 rounded-xl">
			<p class="text-center font-semibold">{error}</p>
		</div>
	{/if}

	<!-- Form -->
	{#if showForm && editingItem}
		<ItemForm
			item={editingItem}
			onSave={saveItem}
			onCancel={() => {
				showForm = false;
				editingItem = null;
			}}
		/>
	{/if}

	<!-- Items Table -->
	<div class="card preset-glass-surface p-6 rounded-2xl shadow-lg">
		{#if loading}
			<div class="flex justify-center items-center py-12">
				<Loader class="size-8 animate-spin text-primary-500" />
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr class="border-b border-surface-300 dark:border-surface-700">
							<th class="px-6 py-4 text-left font-semibold">ID</th>
							<th class="px-6 py-4 text-left font-semibold">Name</th>
							<th class="px-6 py-4 text-left font-semibold">Type</th>
							<th class="px-6 py-4 text-left font-semibold">Description</th>
							<th class="px-6 py-4 text-right font-semibold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each items as item (item.id)}
							<tr class="border-b border-surface-200 dark:border-surface-800 hover:bg-surface-100 dark:hover:bg-surface-800/50 transition-colors">
								<td class="px-6 py-4 font-mono text-sm">#{item.id}</td>
								<td class="px-6 py-4 font-semibold">{item.name}</td>
								<td class="px-6 py-4">
									{#if item.type}
										<span class="badge preset-tonal text-xs capitalize">{item.type}</span>
									{:else}
										<span class="text-surface-500">—</span>
									{/if}
								</td>
								<td class="px-6 py-4 max-w-md truncate">
									{item.description || '—'}
								</td>
								<td class="px-6 py-4">
									<div class="flex gap-2 justify-end">
										<button
											class="btn-icon btn-icon-sm hover:preset-tonal-primary"
											onclick={() => editItem(item)}
											title="Edit Item"
										>
											<Edit class="size-4" />
										</button>
										<button
											class="btn-icon btn-icon-sm hover:preset-tonal-error"
											onclick={() => item.id && deleteItem(item.id)}
											title="Delete Item"
										>
											<Trash2 class="size-4" />
										</button>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="px-6 py-12 text-center">
									<Package class="size-16 mx-auto mb-4 text-surface-400" />
									<p class="text-xl font-semibold mb-2">No items yet</p>
									<p class="text-surface-600 dark:text-surface-400 mb-4">
										Create your first item to get started
									</p>
									<button class="btn preset-glass-surface-primary flex items-center gap-2 mx-auto" onclick={addItem}>
										<Plus class="size-5" />
										<span>Add Item</span>
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
