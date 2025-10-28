import type { StorylineFormData } from '$lib/types/StorylineFormData';
import { writable } from 'svelte/store';

export const storylines = writable<StorylineFormData[]>([]);
export const selectedStorylineId = writable<number | null>(null);
export const selectedStoryLine = writable<StorylineFormData | null>(null);
