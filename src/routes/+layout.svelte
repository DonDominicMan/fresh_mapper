<script lang="ts">
    import * as d3 from 'd3';
    import type { Feature } from 'geojson';
	import NationalMap from "$lib/components/NationalMap.svelte";
    import { feature, transform } from '$lib/stores/MapStore.js';
	import { onMount } from 'svelte';
	import MapSettings from '$lib/components/MapSettings.svelte';
	import FeatureInfo from '$lib/components/FeatureInfo.svelte';


    let { data, children } = $props();

    const width = 975;
    const height = 610;

    let svg: SVGElement;
    let zoom: d3.ZoomBehavior<SVGElement, unknown>;


    onMount(async () => {
        zoom = d3.zoom<SVGElement, unknown>()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                transform.set(event.transform);
            }
        );
        
        d3.select(svg).call(zoom);
        feature.subscribe((value) => {
            zoomToFeature(value);
        });
    })
    
    const zoomToFeature = (feature?: Feature) => {
        const targetTransform = getTargetTransform(feature);
        // Apply with transition
        if(zoom)
            d3.select(svg)
                .transition()
                .duration(1800)
                .ease(d3.easeCubicInOut)
                .call(zoom.transform, targetTransform);
    }

    const getTargetTransform = (feature?: Feature) => {
        if(!feature){
            return d3.zoomIdentity.scale(1);
        } else {
            const geoPath = d3.geoPath();
            const [[x0, y0], [x1, y1]] = geoPath.bounds(feature);
            const scale = Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height));
            const translate: [number, number] = [-(x0 + x1) / 2, -(y0 + y1) / 2];
            
            return d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(scale)
                .translate(...translate);
        }
    }
</script>

<div id="page-container">
    <!-- <aside id="settings">
        <MapSettings></MapSettings>
    </aside> -->
    
    <main>
        <header>
            <h1>{$feature?.properties?.name || "United States of America"}</h1>
        </header>
        
        <svg
            bind:this={svg}
            width={width}
            height={height}
            style:border="solid 5px blue"
            style:background="#999"
            
            >
            
            <NationalMap states={data.states}></NationalMap>
            {@render children()}
        </svg>

        <h1>More Content To Come...</h1>
        <div class="hidden-content"></div>
    </main>

    <!-- <aside id="feature">
        <FeatureInfo></FeatureInfo>
    </aside> -->
</div>


<style>
    .hidden-content{
        height: 200vh;
    }
    #page-container {
        display: flex;
        position: relative;
    }

    aside {
        width: 100px;
        height: 100vh;
        position: fixed;
        top: 0;
        background: rgba(40, 40, 60, 1);
    }

    #settings {
        left: 0;
    }

    #feature {
        right: 0;
    }


    
</style>