<script lang="ts">
    import type { County } from '$lib/types/mapping.ts';
    import * as d3 from 'd3';
	import { goto } from '$app/navigation';
    import { tooltip } from './tooltip.js';
    import { transform } from "$lib/stores/MapStore.js";
    import { page } from '$app/state';

    const { counties } = $props();
    const geoPath = d3.geoPath();

    let hoverCounty: County | null = $state(null);
    let focusCounty: County | null = $state(null);
    let currentUrl = $state(page.url.pathname);
    console.log(currentUrl);
</script>

<g transform={`translate(${$transform.x} ${$transform.y}) scale(${$transform.k})`}>
    <!-- States -->
    {#each counties as county (county.id)}
        <path
            role="button"
            d={geoPath(county)}
            class="geoCounty"
            fill={focusCounty?.id === county.id ? 'red' : hoverCounty?.id === county.id ? '#666' : '#444'}
            stroke="white"
            stroke-width={1/ $transform.k}
            onclick={() => goto(`${currentUrl}/${county.id}`)}
            onkeyup={(e) => e.key === 'Enter' ? goto(`${currentUrl}/${county.id}`) : null}
            onmouseover={() => hoverCounty = county}
            onmouseout={() => hoverCounty = null}
            onfocus={() => focusCounty = county}
            onblur={() => focusCounty = null}
            tabindex={currentUrl.split('/').length > 2 ? -1 : Number(county.id)}
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