<script lang="ts">
import Map from 'lucide-svelte/icons/map';
import Flame from 'lucide-svelte/icons/flame';
import Settings from 'lucide-svelte/icons/settings';
import Brain from 'lucide-svelte/icons/brain';
</script>

<svelte:head>
<title>About | The Corelight Fall</title>
</svelte:head>

<div class="about-page bg-gradient-to-b from-surface-50 to-surface-100 dark:from-surface-950 dark:to-surface-900 min-h-screen">
<!-- Header Section -->
<section class="px-8 py-24">
<div class="mx-auto max-w-4xl space-y-12">
<div class="text-center space-y-6">
<h1 class="text-5xl md:text-6xl font-bold font-heading text-primary-500 dark:text-primary-400">
About The Corelight Fall
</h1>
<p class="text-xl md:text-2xl text-surface-700 dark:text-surface-300 leading-relaxed max-w-3xl mx-auto">
A world where divine technology and arcane power have collided
</p>
</div>

<!-- Introduction Card -->
<div class="card preset-glass-surface p-8 md:p-10 rounded-2xl shadow-xl">
<p class="text-lg text-surface-700 dark:text-surface-300 leading-relaxed">
The Corelight Fall marks the catastrophic event where divine technology and arcane power
collided, shattering civilization. Survivors known as <span class="text-primary-500 dark:text-primary-400 font-semibold">Drifters</span> navigate the fractured world,
salvaging relics and battling corrupted entities.
</p>
</div>
</div>
</section>

<!-- World Section -->
<section class="px-8 py-16 bg-gradient-to-b from-surface-100 to-surface-200 dark:from-surface-900 dark:to-surface-800">
<div class="mx-auto max-w-4xl space-y-8">
<h2 class="text-3xl md:text-4xl font-bold text-center text-primary-500 dark:text-primary-400 mb-8">
The World of Corelight
</h2>

<div class="card preset-glass-surface p-8 md:p-10 rounded-2xl shadow-xl">
<p class="text-lg text-surface-700 dark:text-surface-300 leading-relaxed">
Once a thriving civilization powered by divine fusion technology, the world now lies in ruins.
Towering vertical layers of decaying machinery and forgotten temples stretch skyward. As a
Drifter, you navigate the remnants, using your divine-tech enhancements to survive the
Corelight''s corrupted influence.
</p>
</div>
</div>
</section>

<!-- Factions Section -->
<section class="px-8 py-16">
<div class="mx-auto max-w-6xl space-y-12">
<h2 class="text-3xl md:text-4xl font-bold text-center text-primary-500 dark:text-primary-400">
Factions of Corelight
</h2>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<!-- Cinderlight Conclave -->
<div class="card preset-glass-surface-primary p-8 rounded-2xl shadow-lg transition-all duration-300">
<div class="flex items-start gap-4 mb-4">
<div class="preset-glass-primary p-4 rounded-full shadow-md">
<Flame class="size-8" />
</div>
<div>
<h3 class="text-2xl font-bold font-heading text-primary-500 dark:text-primary-400">Cinderlight Conclave</h3>
<p class="text-sm text-surface-600 dark:text-surface-400">Ritual and Sacrifice</p>
</div>
</div>
<p class="text-surface-700 dark:text-surface-300 leading-relaxed">
Seek to reignite the Corelight through ritual and sacrifice. They believe that only through
a great offering can the divine power be restored and civilization rebuilt.
</p>
</div>

<!-- Forgewalkers Union -->
<div class="card preset-glass-surface-primary p-8 rounded-2xl shadow-lg transition-all duration-300">
<div class="flex items-start gap-4 mb-4">
<div class="preset-glass-primary p-4 rounded-full shadow-md">
<Settings class="size-8" />
</div>
<div>
<h3 class="text-2xl font-bold font-heading text-primary-500 dark:text-primary-400">Forgewalkers Union</h3>
<p class="text-sm text-surface-600 dark:text-surface-400">Engineering and Restoration</p>
</div>
</div>
<p class="text-surface-700 dark:text-surface-300 leading-relaxed">
Scavengers and engineers aiming to restore lost technology. They work tirelessly to understand
and rebuild the divine-tech systems that once powered the world.
</p>
</div>

<!-- Hollow Creed -->
<div class="card preset-glass-surface-primary p-8 rounded-2xl shadow-lg transition-all duration-300">
<div class="flex items-start gap-4 mb-4">
<div class="preset-glass-primary p-4 rounded-full shadow-md">
<Map class="size-8" />
</div>
<div>
<h3 class="text-2xl font-bold font-heading text-primary-500 dark:text-primary-400">Hollow Creed</h3>
<p class="text-sm text-surface-600 dark:text-surface-400">Embrace Decay</p>
</div>
</div>
<p class="text-surface-700 dark:text-surface-300 leading-relaxed">
Embrace decay, seeking to accelerate the world''s end. They believe the fall was inevitable
and that resisting it only prolongs suffering.
</p>
</div>

<!-- Eidol Archive -->
<div class="card preset-glass-surface-primary p-8 rounded-2xl shadow-lg transition-all duration-300">
<div class="flex items-start gap-4 mb-4">
<div class="preset-glass-primary p-4 rounded-full shadow-md">
<Brain class="size-8" />
</div>
<div>
<h3 class="text-2xl font-bold font-heading text-primary-500 dark:text-primary-400">Eidol Archive</h3>
<p class="text-sm text-surface-600 dark:text-surface-400">AI-Driven Collective</p>
</div>
</div>
<p class="text-surface-700 dark:text-surface-300 leading-relaxed">
AI-driven collective reconstructing divine blueprints. They preserve knowledge and work
methodically to decode the secrets of the Corelight.
</p>
</div>
</div>

<!-- Call to Action -->
<div class="text-center mt-12">
<a href="/auth/register" class="btn preset-glass-surface-primary flex items-center gap-2 mx-auto w-fit px-6 py-3 text-lg rounded-xl shadow-lg">
<span>Choose Your Path</span>
</a>
</div>
</div>
</section>
</div>
