<script lang="ts">
    import * as d3 from 'd3';
	import type { State } from '$lib/types/mapping.ts';
	import { goto } from '$app/navigation';
	import { tooltip } from './tooltip.js';
    import { feature, transform } from '$lib/stores/MapStore.js';
	import { onMount } from 'svelte';

    const { states } = $props();
    const geoPath = d3.geoPath();
    
    let hoverState: State | null = $state(null);
    let focusState: State | null = $state(null);
    let selectedState: State | null = $state(null);

    const handleStateClick = (state: State) => {
        selectedState = state;
        feature.set(state);
        goto(`/${state.properties?.code}`);
    }

    onMount(() => {
        feature.subscribe((value) => !value ? selectedState = null : null)
    })
</script>

<g transform={`translate(${$transform.x} ${$transform.y}) scale(${$transform.k})`}>
    <!-- States -->
    {#each states as state (state.id)}
        <path
            role="button"
            d={geoPath(state)}
            class="geoState"
            fill={focusState?.id === state.id ? 'red' : hoverState?.id === state.id ? '#32CD32' : '#228B22'}
            stroke="#333"
            stroke-width={1/$transform.k}
            onclick={() => handleStateClick(state)}
            onkeyup={(e) => e.key === 'Enter' ? handleStateClick(state) : null}
            onmouseover={() => hoverState = state}
            onmouseout={() => hoverState = null}
            onfocus={() => focusState = state}
            onblur={() => focusState = null}
            tabindex={!selectedState ? Number(state.id) : -1}
            data-title={state?.properties?.name}
            use:tooltip
        />
    {/each}
</g>

<style>
    path {
        cursor: pointer;
        transition: fill 0.2s ease;
    }
    .geoState{
        outline: none !important;
    }
</style>