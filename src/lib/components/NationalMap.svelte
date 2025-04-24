<script lang="ts">
    import * as d3 from 'd3';
	import type { State } from '$lib/types/mapping.ts';
	import { goto } from '$app/navigation';
    import { mapStore, transformString, strokeWidth } from '$lib/stores/MapStore.js';

    const { states } = $props();

    // Get map data
    const geoPath = d3.geoPath();

    // State management
    let hoveredState: State | null = $state(null);
    let focusState: State | null = $state(null);
    let selectedState: State | null = $state(null);

    function handleStateClick(feature: State) {
        selectedState = feature;
        mapStore.zoomToFeature(feature, $mapStore.fullWidth, $mapStore.fullHeight);
        goto(`/${feature.properties.code}`);
    }

    function handleKeyDown(event: KeyboardEvent, feature: State) {
        event.stopPropagation();
        if(event.key === ' '){
            selectedState = feature;
        }
    }

    function handleKeyUp(event: KeyboardEvent, feature: State) {
        event.stopPropagation();
        if(event.key === ' '){
            selectedState = null;
        } else if(event.key === 'Enter'){
            handleStateClick(feature);
        }
    }
</script>

<svg
    width={$mapStore.fullWidth}
    height={$mapStore.fullHeight}
    viewBox="0 0 {$mapStore.fullWidth} {$mapStore.fullHeight}"
    preserveAspectRatio="xMidYMid meet"
>
    <g transform={$transformString}>
        <!-- States -->
        {#each states as state (state.id)}
            <path
                role="button"
                d={geoPath(state)}
                class="geoState"
                fill={focusState?.id === state?.id  ? 'red' : hoveredState?.id  === state?.id ? '#666' : '#444'}
                stroke="white"
                stroke-width={$strokeWidth}
                onmouseup={() => handleStateClick(state)}
                onkeydown={(e) => handleKeyDown(e, state)}
                onkeyup={(e) => handleKeyUp(e, state)}
                onmouseover={() => hoveredState = state}
                onmouseout={() => hoveredState = null}
                onfocus={() => focusState = state}
                onblur={() => focusState = null}
                tabindex={!selectedState ? Number(state.id) : -1}
            >
                <title>{state?.properties?.name}</title>
            </path>
        {/each}
    </g>
</svg>

<style>
    path {
        cursor: pointer;
        transition: fill 0.2s ease;
    }
    .geoState{
        outline: none !important;
    }
</style>