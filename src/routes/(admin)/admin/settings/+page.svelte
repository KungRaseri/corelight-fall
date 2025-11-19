<script lang="ts">
import { Settings, Save, Database, Shield, Bell, Palette } from 'lucide-svelte';

let settings = $state({
siteName: 'The Corelight Fall',
siteDescription: 'Explore the ruins of a shattered world',
maintenanceMode: false,
allowRegistration: true,
requireEmailVerification: false,
enableNotifications: true,
maxUploadSize: 10,
sessionTimeout: 30,
theme: 'nouveau'
});

let saving = $state(false);
let message = $state('');

async function saveSettings() {
saving = true;
message = '';

try {
// TODO: Implement API call to save settings
await new Promise(resolve => setTimeout(resolve, 1000));
message = 'Settings saved successfully!';
} catch (err) {
message = 'Error saving settings';
} finally {
saving = false;
}
}
</script>

<div class="space-y-6 p-8 max-w-4xl mx-auto">
<div class="flex items-center justify-between">
<h1 class="text-3xl font-bold text-primary-500 dark:text-primary-400 flex items-center gap-3">
<Settings class="size-8" />
Admin Settings
</h1>
<button 
class="btn preset-glass-surface-primary flex items-center gap-2"
onclick={saveSettings}
disabled={saving}
>
<Save class="size-5" />
<span>{saving ? 'Saving...' : 'Save Changes'}</span>
</button>
</div>

{#if message}
<div class="card preset-glass-surface-primary p-4 rounded-xl">
<p class="text-center font-semibold">{message}</p>
</div>
{/if}

<!-- General Settings -->
<div class="card preset-glass-surface p-6 rounded-2xl shadow-lg space-y-6">
<h2 class="text-2xl font-bold flex items-center gap-2">
<Palette class="size-6 text-primary-500 dark:text-primary-400" />
General Settings
</h2>

<label class="label">
<span class="font-semibold">Site Name</span>
<input 
type="text" 
class="input" 
bind:value={settings.siteName}
placeholder="The Corelight Fall"
/>
</label>

<label class="label">
<span class="font-semibold">Site Description</span>
<textarea 
class="textarea" 
bind:value={settings.siteDescription}
placeholder="Site description..."
rows="3"
></textarea>
</label>

<label class="label">
<span class="font-semibold">Default Theme</span>
<select class="select" bind:value={settings.theme}>
<option value="nouveau">Nouveau</option>
<option value="crimson">Crimson</option>
<option value="vintage">Vintage</option>
<option value="terminus">Terminus</option>
</select>
</label>
</div>

<!-- Security Settings -->
<div class="card preset-glass-surface p-6 rounded-2xl shadow-lg space-y-6">
<h2 class="text-2xl font-bold flex items-center gap-2">
<Shield class="size-6 text-primary-500 dark:text-primary-400" />
Security & Access
</h2>

<label class="flex items-center gap-3 cursor-pointer">
<input 
type="checkbox" 
class="checkbox"
bind:checked={settings.maintenanceMode}
/>
<div>
<span class="font-semibold">Maintenance Mode</span>
<p class="text-sm text-surface-600 dark:text-surface-400">Temporarily disable site access for maintenance</p>
</div>
</label>

<label class="flex items-center gap-3 cursor-pointer">
<input 
type="checkbox" 
class="checkbox"
bind:checked={settings.allowRegistration}
/>
<div>
<span class="font-semibold">Allow New Registrations</span>
<p class="text-sm text-surface-600 dark:text-surface-400">Enable or disable user registration</p>
</div>
</label>

<label class="flex items-center gap-3 cursor-pointer">
<input 
type="checkbox" 
class="checkbox"
bind:checked={settings.requireEmailVerification}
/>
<div>
<span class="font-semibold">Require Email Verification</span>
<p class="text-sm text-surface-600 dark:text-surface-400">Users must verify email before accessing the site</p>
</div>
</label>

<label class="label">
<span class="font-semibold">Session Timeout (minutes)</span>
<input 
type="number" 
class="input" 
bind:value={settings.sessionTimeout}
min="5"
max="1440"
/>
</label>
</div>

<!-- System Settings -->
<div class="card preset-glass-surface p-6 rounded-2xl shadow-lg space-y-6">
<h2 class="text-2xl font-bold flex items-center gap-2">
<Database class="size-6 text-primary-500 dark:text-primary-400" />
System Configuration
</h2>

<label class="label">
<span class="font-semibold">Max Upload Size (MB)</span>
<input 
type="number" 
class="input" 
bind:value={settings.maxUploadSize}
min="1"
max="100"
/>
</label>

<label class="flex items-center gap-3 cursor-pointer">
<input 
type="checkbox" 
class="checkbox"
bind:checked={settings.enableNotifications}
/>
<div>
<span class="font-semibold">Enable Notifications</span>
<p class="text-sm text-surface-600 dark:text-surface-400">System-wide notification support</p>
</div>
</label>
</div>

<!-- Actions -->
<div class="flex gap-4 justify-end">
<button class="btn preset-glass-surface">Cancel</button>
<button 
class="btn preset-glass-surface-primary flex items-center gap-2"
onclick={saveSettings}
disabled={saving}
>
<Save class="size-5" />
<span>{saving ? 'Saving...' : 'Save All Settings'}</span>
</button>
</div>
</div>

