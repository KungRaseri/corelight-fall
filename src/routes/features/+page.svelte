<script lang="ts">
    import Map from '@lucide/svelte/icons/map';
    import Swords from '@lucide/svelte/icons/swords';
    import Settings from '@lucide/svelte/icons/settings';
    import Users from '@lucide/svelte/icons/users';
</script>

<section class="features py-16 px-8 bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100">
    <div class="max-w-4xl mx-auto space-y-8">
        <!-- Title -->
        <h2 class="text-4xl font-bold text-center">Features</h2>

        <!-- Core Gameplay -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
            <div class="flex items-center gap-4">
                <Map class="h-10 w-10 text-primary-500 dark:text-primary-400" />
                <p><strong>Story-Driven Exploration:</strong> Uncover secrets in a multi-layered vertical world.</p>
            </div>
            <div class="flex items-center gap-4">
                <Swords class="h-10 w-10 text-primary-500 dark:text-primary-400" />
                <p><strong>Dynamic Combat:</strong> Engage corrupted enemies using a mix of tech and magic.</p>
            </div>
            <div class="flex items-center gap-4">
                <Settings class="h-10 w-10 text-primary-500 dark:text-primary-400" />
                <p><strong>Resource Management:</strong> Scavenge and craft to sustain your journey.</p>
            </div>
            <div class="flex items-center gap-4">
                <Users class="h-10 w-10 text-primary-500 dark:text-primary-400" />
                <p><strong>Faction Alignment:</strong> Influence the world through your chosen allegiance.</p>
            </div>
        </div>
    </div>
</section>
