<script lang="ts">
	import { Users, UserPlus, Edit, Trash2, Shield, Calendar } from 'lucide-svelte';
	
	const { data } = $props();
</script>

<div class="space-y-6 p-8">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<Users class="size-8 text-primary-500 dark:text-primary-400" />
			<h1 class="text-3xl font-bold text-primary-500 dark:text-primary-400">User Management</h1>
		</div>
		<button class="btn preset-glass-surface-primary flex items-center gap-2">
			<UserPlus class="size-5" />
			<span>Add User</span>
		</button>
	</div>

	{#if data.users.length > 0}
		<div class="card preset-glass-surface rounded-2xl shadow-lg overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-surface-200 dark:bg-surface-800 border-b border-surface-300 dark:border-surface-700">
						<tr>
							<th class="px-6 py-4 text-left text-sm font-bold text-surface-900 dark:text-surface-100">ID</th>
							<th class="px-6 py-4 text-left text-sm font-bold text-surface-900 dark:text-surface-100">Username</th>
							<th class="px-6 py-4 text-left text-sm font-bold text-surface-900 dark:text-surface-100">Created</th>
							<th class="px-6 py-4 text-left text-sm font-bold text-surface-900 dark:text-surface-100">Role</th>
							<th class="px-6 py-4 text-right text-sm font-bold text-surface-900 dark:text-surface-100">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-surface-200 dark:divide-surface-700">
						{#each data.users as user}
							<tr class="hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
								<td class="px-6 py-4 text-surface-700 dark:text-surface-300 font-mono text-sm">
									#{user.id}
								</td>
								<td class="px-6 py-4">
									<div class="font-semibold text-surface-900 dark:text-surface-100">{user.username}</div>
								</td>
								<td class="px-6 py-4 text-surface-700 dark:text-surface-300">
									<div class="flex items-center gap-2">
										<Calendar class="size-4" />
										{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
									</div>
								</td>
								<td class="px-6 py-4">
									{#if user.roleName && user.roleName !== 'None'}
										<div class="flex flex-wrap gap-1">
											{#each user.roleName.split(', ') as role}
												{#if role === 'admin'}
													<span class="badge preset-filled-error text-xs flex items-center gap-1 w-fit">
														<Shield class="size-3" />
														Admin
													</span>
												{:else}
													<span class="badge preset-filled-primary text-xs flex items-center gap-1 w-fit">
														<Shield class="size-3" />
														{role}
													</span>
												{/if}
											{/each}
										</div>
									{:else}
										<span class="badge preset-tonal text-xs">None</span>
									{/if}
								</td>
								<td class="px-6 py-4">
									<div class="flex gap-2 justify-end">
										<button 
											class="btn-icon btn-icon-sm hover:preset-tonal-primary"
											title="Edit user"
										>
											<Edit class="size-4" />
										</button>
										<button 
											class="btn-icon btn-icon-sm hover:preset-tonal-error"
											title="Delete user"
										>
											<Trash2 class="size-4" />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:else}
		<div class="card preset-glass-surface p-12 rounded-2xl text-center">
			<Users class="size-16 mx-auto mb-4 text-surface-400" />
			<p class="text-lg text-surface-600 dark:text-surface-400">No users found</p>
			<button class="btn preset-glass-primary mt-4 flex items-center gap-2 mx-auto">
				<UserPlus class="size-5" />
				<span>Add first user</span>
			</button>
		</div>
	{/if}
</div>






