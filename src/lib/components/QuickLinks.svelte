<script lang="ts">
    import IconInventory from '@lucide/svelte/icons/box';
    import IconMap from '@lucide/svelte/icons/map';
    import IconQuest from '@lucide/svelte/icons/list';
    import IconProfile from '@lucide/svelte/icons/user';
    import IconSettings from '@lucide/svelte/icons/settings';
</script>

<div class="grid grid-cols-2 gap-4 bg-surface-800 p-4 rounded-md">
    <a href="/game/inventory" class="btn btn-outline w-full">
        <IconInventory class="inline-block mr-2" /> Inventory
    </a>
    <a href="/game/map" class="btn btn-outline w-full">
        <IconMap class="inline-block mr-2" /> Map
    </a>
    <a href="/game/quests" class="btn btn-outline w-full">
        <IconQuest class="inline-block mr-2" /> Quests
    </a>
    <a href="/game/profile" class="btn btn-outline w-full">
        <IconProfile class="inline-block mr-2" /> Profile
    </a>
    <a href="/settings" class="btn btn-outline w-full">
        <IconSettings class="inline-block mr-2" /> Settings
    </a>
</div>
