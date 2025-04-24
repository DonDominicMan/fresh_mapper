<script lang="ts">
    import * as d3 from 'd3';
	import type { County, State } from '$lib/types/mapping.ts';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
    import type { Feature } from 'geojson';

    const { data } = $props();
    const { states, allCounties } = data;
    const width = 975;
    const height = 610;

    const geoPath = d3.geoPath();
    let svgElement: SVGSVGElement;
    let zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown>;
    
    let hoverState: State | null = $state(null);
    let selectedState: State | null = $state(null);
    
    let hoverCounty: County | null = $state(null);
    let selectedCounty: County | null = $state(null);

    let transform = $state(d3.zoomIdentity);    
    let transformString = $derived(`
        translate(${transform.x} ${transform.y})
        scale(${transform.k})
    `);

    $effect(() => console.log($state.snapshot({
        hoverCounty,
        hoverState,
        selectedCounty,
        selectedState
    })));


    let counties = $derived(allCounties.filter(( county: County ) => county.properties.state === selectedState?.properties.code));
    
    function handleStateClick(event: MouseEvent, feature: State) {
        event.stopPropagation();
        selectedState = feature;
        zoomTo(feature);
        goto(`/${feature.properties.code}`);
    }

    function handleCountyClick(event: MouseEvent, feature: County) {
        event.stopPropagation();
        selectedCounty = feature;
        zoomTo(feature);
        goto(`/${feature.properties.state}/${feature.id}`);
    }

    function handleKeyUp(event: KeyboardEvent, feature: Feature, level: string="state") {
        event.stopPropagation();
        switch (event.key) {
            case "Enter":
                if(level === "county"){
                    selectedCounty = feature as County;
                    zoomTo(feature);
                    goto(`/${feature?.properties?.state}/${feature.id}`);
                } else {
                    selectedState = feature as State;
                    zoomTo(feature);
                    goto(`/${feature?.properties?.code}`);
                }
                break;
            case "Escape":
                zoomOut();
                break;
            default:
                break;
        }
    }

    onMount(() => {
        // Initialize MOUSEPAD zoom behavior
        zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                transform = event.transform;
            });

        // Apply to SVG
        d3.select(svgElement).call(zoomBehavior);
    });

    function zoomOut(){
        if(selectedCounty && selectedState){
            console.log("Escape from county");
            selectedCounty = null;
            hoverCounty = null;
            zoomTo(selectedState);
            goto(`/${selectedState?.properties.code}`);
        } else if (selectedState) {
            console.log("Escape from state");
            selectedCounty = null;
            hoverCounty = null;
            selectedState = null;
            hoverState = null;
            resetMap();
            goto(`/`);
        }
    }

    function zoomTo(feature: Feature) {
        const [[x0, y0], [x1, y1]] = geoPath.bounds(feature);
        const scale = Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height));
        const translate: [number, number] = [-(x0 + x1) / 2, -(y0 + y1) / 2];
        
        const targetTransform = d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(scale)
            .translate(...translate);

        // Apply with transition
        d3.select(svgElement)
            .transition()
            .duration(2000) // 1 second animation
            .ease(d3.easeCubicInOut) // Smooth easing
            .call(zoomBehavior.transform, targetTransform);
    }

    const resetMap = () => {
        
        const targetTransform = d3.zoomIdentity.scale(1);

        // Apply with transition
        d3.select(svgElement)
            .transition()
            .duration(2000) // 1 second animation
            .ease(d3.easeCubicInOut) // Smooth easing
            .call(zoomBehavior.transform, targetTransform);
    }

</script>

<svg
    bind:this={svgElement}
    width={width}
    height={height}
    viewBox="0 0 {width} {height}"
    preserveAspectRatio="xMidYMid meet"
>
    <g transform={transformString}>
        <!-- States -->
        {#each states as state (state.id)}
            <path
                role="button"
                d={geoPath(state)}
                class="geoState"
                fill={hoverState?.id === state?.id ? '#666' : '#444'}
                stroke="white"
                stroke-width={1 / transform.k}
                onclick={(e) => handleStateClick(e, state)}
                onkeyup={(e) => handleKeyUp(e, state)}
                onmouseover={() => hoverState = state}
                onmouseout={() => hoverState = null}
                onfocus={() => hoverState = state}
                onblur={() => hoverState = null}
                tabindex={!selectedState ? Number(state.id) : selectedState.id === state.id ? 0 : -1}
            >
                <title>{state?.properties?.name}</title>
            </path>
        {/each}
        {#if selectedState}
            {#each counties as county (county.id)}
                <path
                    role="button"
                    d={geoPath(county)}
                    class="geoCounty"
                    fill={hoverCounty?.id === county?.id ? '#666' : '#444'}
                    stroke="white"
                    stroke-width={1/ transform.k}
                    onclick={(e) => handleCountyClick(e, county)}
                    onkeyup={(e) => handleKeyUp(e, county, 'county')}
                    onmouseover={() => hoverCounty = county}
                    onmouseout={() => hoverCounty = null}
                    onfocus={() => hoverCounty = county}
                    onblur={() => hoverCounty = null}
                    tabindex={Number(county.id)}
                >
                    <title>{county?.properties?.name}</title>
                </path>
            {/each}
        {/if}
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
    .geoCounty{
        outline: none !important;
    }
</style>