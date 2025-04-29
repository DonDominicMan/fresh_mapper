<script lang="ts">
    import type { County } from '$lib/types/mapping.ts';
    import * as d3 from 'd3';
	import { goto } from '$app/navigation';
    import { tooltip } from './tooltip.js';
    import { feature, transform } from "$lib/stores/MapStore.js";

    const geoPath = d3.geoPath();
    let { currentState, counties } = $props();

    let hoverCounty: County | null = $state(null);
    let focusCounty: County | null = $state(null);
    let selectedCounty: County | null = $state(null);
    
    const handleCountyClick = (county: County) => {
        selectedCounty = county;
        feature.set(county);
        goto(`/${currentState.properties.code}/${county.id}`);
    }

    const handleKeyUp = (event: KeyboardEvent, county: County) => {
        if(event.key === 'Enter'){
            handleCountyClick(county);
        } else if(event.key === 'Escape'){
            if(selectedCounty){
                selectedCounty = null;
                feature.set(currentState);
                goto(`/${currentState.properties.code}`);
            } else {
                selectedCounty = null;
                feature.set(undefined);
                goto('/');
            }
        }
    }
</script>

<g transform={`translate(${$transform.x} ${$transform.y}) scale(${$transform.k})`}>
    <!-- States -->
    {#each counties as county (county.id)}
        <path
            role="button"
            d={geoPath(county)}
            class="geoCounty"
            fill={focusCounty?.id === county.id ? 'red' : $feature?.id === county.id ? 'blue' : hoverCounty?.id === county.id ? '#32CD32' : '#228B22'}
            stroke="#333"
            stroke-width={1/ $transform.k}
            onclick={() => handleCountyClick(county)}
            onkeyup={(e) => handleKeyUp(e, county)}
            onmouseover={() => hoverCounty = county}
            onmouseout={() => hoverCounty = null}
            onfocus={() => focusCounty = county}
            onblur={() => focusCounty = null}
            tabindex={Number(county.id)}
            data-title={county?.properties?.name}
            use:tooltip
        />
    {/each}
</g>


<style>
    path {
        cursor: pointer;
        transition: fill 0.2s ease;
    }
    .geoCounty{
        outline: none !important;
    }
</style>