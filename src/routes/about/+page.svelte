<script lang="ts">
    import Map from '@lucide/svelte/icons/map';
    import Flame from '@lucide/svelte/icons/flame';
    import Settings from '@lucide/svelte/icons/settings';
    import Brain from '@lucide/svelte/icons/brain';
</script>

<section class="about py-16 px-8 bg-surface-100 dark:bg-surface-900 text-surface-900 dark:text-surface-100">
    <div class="max-w-4xl mx-auto space-y-8">
        <!-- Title -->
        <h2 class="text-4xl font-bold text-center">About The Corelight Fall</h2>

        <!-- Introduction -->
        <p class="text-lg text-center">
            The Corelight Fall marks the catastrophic event where divine technology and arcane power collided, shattering civilization. 
            Survivors known as Drifters navigate the fractured world, salvaging relics and battling corrupted entities.
        </p>

        <!-- The World -->
        <h3 class="text-2xl font-semibold">The World of Corelight</h3>
        <p>
            Once a thriving civilization powered by divine fusion technology, the world now lies in ruins. 
            Towering vertical layers of decaying machinery and forgotten temples stretch skyward. 
            As a Drifter, you navigate the remnants, using your divine-tech enhancements to survive the Corelight's corrupted influence.
        </p>

        <!-- Factions -->
        <h3 class="text-2xl font-semibold">Factions of Corelight</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-center gap-4">
                <Flame class="h-8 w-8 text-primary-500 dark:text-primary-400" />
                <p><strong>Cinderlight Conclave:</strong> Seek to reignite the Corelight through ritual and sacrifice.</p>
            </div>
            <div class="flex items-center gap-4">
                <Settings class="h-8 w-8 text-primary-500 dark:text-primary-400" />
                <p><strong>Forgewalkers Union:</strong> Scavengers and engineers aiming to restore lost technology.</p>
            </div>
            <div class="flex items-center gap-4">
                <Map class="h-8 w-8 text-primary-500 dark:text-primary-400" />
                <p><strong>Hollow Creed:</strong> Embrace decay, seeking to accelerate the world’s end.</p>
            </div>
            <div class="flex items-center gap-4">
                <Brain class="h-8 w-8 text-primary-500 dark:text-primary-400" />
                <p><strong>Eidol Archive:</strong> AI-driven collective reconstructing divine blueprints.</p>
            </div>
        </div>
    </div>
</section>
