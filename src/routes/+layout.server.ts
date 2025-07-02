import type { CountyCollection, QuantizedTopology, StateCollection } from '$lib/types/mapping.ts';
import json_data from "$lib/data/counties-albers-10m-full.json" with { type: "json" };
import { feature } from 'topojson-client';
// import shp from 'shpjs';  

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {

// Example: Census TIGER shapefile (e.g., congressional districts)
    // const districts = await loadShapefile('https://www2.census.gov/geo/tiger/TIGER2022/CD/tl_2022_us_cd116.zip');

    const US_QUANITIZED_TOPOLOGY: QuantizedTopology = json_data as unknown as QuantizedTopology;
    const stateCollection: StateCollection = feature(US_QUANITIZED_TOPOLOGY, US_QUANITIZED_TOPOLOGY.objects.states) as StateCollection;
    const countyCollection: CountyCollection = feature(US_QUANITIZED_TOPOLOGY, US_QUANITIZED_TOPOLOGY.objects.counties) as CountyCollection;

    const states = stateCollection.features;
    const allCounties = countyCollection.features;

    return {
        // districts,
        US_QUANITIZED_TOPOLOGY,
        states,
        allCounties
    }
}

// async function loadShapefile(zipUrl: string) {
//     const geojson = await shp(zipUrl); // URL to .zip of shapefiles
//     return geojson;
// }