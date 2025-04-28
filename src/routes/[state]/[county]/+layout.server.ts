import type { County } from '$lib/types/mapping.ts';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params, parent}) {    
    const countyId = params.county;
    const { counties } = await parent();
    const county: County | undefined = counties.find(( county: County ) => county.id === countyId);

    return {
        county
    };
}