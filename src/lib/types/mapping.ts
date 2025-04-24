import type { GeometryObject } from 'topojson-specification';
import type { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson'
import type { ZoomTransform } from 'd3-zoom';

export type StateCollection = FeatureCollection<Geometry, StateProperties>;
export type CountyCollection = FeatureCollection<Geometry, CountyProperties>;
export type State = Feature<Geometry, StateProperties>;
export type County = Feature<Geometry, StateProperties>;

export interface QuantizedTopology {
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

export interface MapState {
    currentView: 'national' | 'state' | 'county';
    currentFeature: Feature | null;
    currentTransform: ZoomTransform | null;
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

