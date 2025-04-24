// src/lib/stores/mapStore.ts
import type { MapState } from '$lib/types/mapping.js';
import { writable } from 'svelte/store';

// Writable store instance
export const mapStore = writable<MapState>({
    currentView: 'national',
    currentFeature: null,
    transitionInProgress: false
});