import type { GeometryObject } from 'topojson-specification';
import type { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson'

export type StateCollection = FeatureCollection<Geometry, StateProperties>;
export type CountyCollection = FeatureCollection<Geometry, CountyProperties>;
export type State = Feature<Geometry, StateProperties>;
export type County = Feature<Geometry, CountyProperties>;
export type CD = Feature<Geometry, DistrictProperties>;

export type CDCollection = Feature<Geometry, DistrictProperties>[]

export type QuantizedTopology = {
    type: "Topology";
    bbox: [number, number, number, number];
    transform: {
      scale: [number, number];
      translate: [number, number];
    };
    objects: {
        nation: GeometryObject<GeoJsonProperties>;
        states: GeometryObject<GeoJsonProperties>;
        counties: GeometryObject<GeoJsonProperties>;
    };
    arcs: number[][][];
}

interface DistrictProperties {
    ALAND: number;
    AWATER: number;
    CD119FP: string;
    CDSESSN: string;
    FUNCSTAT: string;
    GEOID: string;
    GEOIDFQ: string;
    INTPTLAT: string;
    INTPTLON: string;
    LSAD: string;
    MTFCC: string;
    NAMELSAD: string;
    STATEFP: string;
}

interface StateProperties {
    abbrev: string;
    code: string;
    name: string;
    type: "state" | "federal district" | "insular area"
}

interface CountyProperties {
    state: string;
    name: string;
}

