import type { CDCollection, State } from '$lib/types/mapping.ts';
import shp from 'shpjs';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params, parent}) {
    const stateCode = params.state;
    const { states, allCounties } = await parent();

    const counties = allCounties.filter(( county ) => county.properties.state === stateCode);
    const state: State | undefined = states.find(( state: State ) => state.properties.code === stateCode);
    
    // const censusShpFile = await loadShapefile(`https://www2.census.gov/geo/tiger/TIGER2024/CD/tl_2024_${state?.id}_cd119.zip`) as shp.FeatureCollectionWithFilename;
    // const districts: CDCollection = censusShpFile.features as CDCollection;
    
    return {
        state,
        districts: null,
        counties
    };
}

// async function loadShapefile(zipUrl: string) {
//     const geojson = await shp(zipUrl); // URL to .zip of shapefiles
//     return geojson;
// }