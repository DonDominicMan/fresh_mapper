import type { CountyCollection, QuantizedTopology, StateCollection } from '$lib/types/mapping.ts';
import json_data from "$lib/data/counties-albers-10m-full.json" with { type: "json" };
import { feature } from 'topojson-client';

/** @type {import('./$types').LayoutServerLoad} */
export function load() {    
    const US_QUANITIZED_TOPOLOGY: QuantizedTopology = json_data as unknown as QuantizedTopology;
    const stateCollection: StateCollection = feature(US_QUANITIZED_TOPOLOGY, US_QUANITIZED_TOPOLOGY.objects.states) as StateCollection;
    const countyCollection: CountyCollection = feature(US_QUANITIZED_TOPOLOGY, US_QUANITIZED_TOPOLOGY.objects.counties) as CountyCollection;

    const states = stateCollection.features;
    const allCounties = countyCollection.features;

    return {
        US_QUANITIZED_TOPOLOGY,
        states,
        allCounties
    }
}