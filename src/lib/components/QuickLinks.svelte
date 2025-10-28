<script lang="ts">
	import IconInventory from '@lucide/svelte/icons/box';
	import IconMap from '@lucide/svelte/icons/map';
	import IconQuest from '@lucide/svelte/icons/list';
	import IconProfile from '@lucide/svelte/icons/user';
	import IconSettings from '@lucide/svelte/icons/settings';
</script>

<div class="bg-surface-800 grid grid-cols-2 gap-4 rounded-md p-4">
	<a href="/game/inventory" class="btn btn-outline w-full">
		<IconInventory class="mr-2 inline-block" /> Inventory
	</a>
	<a href="/game/map" class="btn btn-outline w-full">
		<IconMap class="mr-2 inline-block" /> Map
	</a>
	<a href="/game/quests" class="btn btn-outline w-full">
		<IconQuest class="mr-2 inline-block" /> Quests
	</a>
	<a href="/game/profile" class="btn btn-outline w-full">
		<IconProfile class="mr-2 inline-block" /> Profile
	</a>
	<a href="/settings" class="btn btn-outline w-full">
		<IconSettings class="mr-2 inline-block" /> Settings
	</a>
</div>
