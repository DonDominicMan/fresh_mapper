<script lang="ts">
    import * as d3 from 'd3';
    import type { County } from '$lib/types/mapping.ts';
    import { mapStore, transformString, strokeWidth } from '$lib/stores/MapStore.js';

    let { counties } = $props();

    const width = $mapStore.fullWidth;
    const height = $mapStore.fullHeight;

    const geoPath = d3.geoPath();

    let hoverCounty: County | null = $state(null);
    let focusCounty: County | null = $state(null);
    let selectedCounty: County | null = $state(null);

    function handleCountyClick(feature: County) {
        selectedCounty = feature;
    }

    function handleKeyUp(event: KeyboardEvent, feature: County) {
        event.stopPropagation();
        if(event.key === 'Enter'){
            handleCountyClick(feature);
        }
    }
</script>

<svg
    width={width}
    height={height}
    style="overflow: visible;"
>
    <g transform={$transformString}>
        <!-- States -->
        {#each counties as county (county.id)}
            <path
                role="button"
                d={geoPath(county)}
                class="geoCounty"
                fill={selectedCounty?.id === county?.id ? 'blue' : hoverCounty?.id === county?.id ? '#666' : '#444'}
                stroke="white"
                stroke-width={$strokeWidth}
                onclick={() => handleCountyClick(county)}
                onkeyup={(e) => handleKeyUp(e, county)}
                onmouseover={() => hoverCounty = county}
                onmouseout={() => hoverCounty = null}
                onfocus={() => focusCounty = county}
                onblur={() => focusCounty = null}
                tabindex={Number(county.id)}
            >
                <title>{county?.properties?.name}</title>
            </path>
        {/each}
    </g>
</svg>


<style>
    path {
        cursor: pointer;
        transition: fill 0.2s ease;
    }
    .geoCounty{
        outline: none !important;
    }
</style>