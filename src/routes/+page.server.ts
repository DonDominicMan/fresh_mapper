import { feature } from 'topojson-client';
import type { StateCollection } from '$lib/types/mapping.ts';

/** @type {import('./$types').PageServerLoad} */
export async function load({parent}) {

    const { US_QUANITIZED_TOPOLOGY } = await parent();
    
    const stateCollection: StateCollection = feature(US_QUANITIZED_TOPOLOGY, US_QUANITIZED_TOPOLOGY.objects.states) as StateCollection;

    const states = stateCollection.features;
    
    return {
        states
    };
}