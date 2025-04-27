<script lang="ts">
    import * as d3 from 'd3';
	import type { State } from '$lib/types/mapping.ts';
	import { goto } from '$app/navigation';
	import { tooltip } from './tooltip.js';
    import { transform } from '$lib/stores/MapStore.js';
    import { page } from '$app/state';

    const { states } = $props();
    const geoPath = d3.geoPath();
    
    let hoverState: State | null = $state(null);
    let focusState: State | null = $state(null);
    let currentUrl = $state(page.url.pathname);
</script>

<g transform={`translate(${$transform.x} ${$transform.y}) scale(${$transform.k})`}>
    <!-- States -->
    {#each states as state (state.id)}
        <path
            role="button"
            d={geoPath(state)}
            class="geoState"
            fill={focusState?.id === state.id ? 'red' : hoverState?.id === state.id ? '#666' : '#444'}
            stroke="white"
            stroke-width={1/$transform.k}
            onclick={() => goto(`/${state.properties?.code}`)}
            onkeyup={(e) => e.key === 'Enter' ? goto(`/${state.properties?.code}`) : null}
            onmouseover={() => hoverState = state}
            onmouseout={() => hoverState = null}
            onfocus={() => focusState = state}
            onblur={() => focusState = null}
            tabindex={currentUrl.length > 1 ? -1 : Number(state.id)}
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