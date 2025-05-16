<script lang="ts">
	import type { Character } from "$lib/server/db/types";
	import { character } from "$lib/stores/character";

    let characterData = $state<Character | null>(null);

    $effect(() => {
        const unsubscribe = character.subscribe((value) => {
            characterData = value;
        });
        return unsubscribe;
    });
</script>

<div class="bg-surface-800 p-4 rounded-md mb-4">
    <h2 class="text-xl font-semibold">Current Status</h2>
    <!-- <p>Health: {characterData.health ?? 'Unknown'}</p>
    <p>Resources: {characterData.resources ?? 0}</p>
    <p>Location: {characterData.location ?? 'Unknown'}</p> -->
</div>
