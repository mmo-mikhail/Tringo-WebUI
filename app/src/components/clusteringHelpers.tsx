import { IDestination } from '../models/response/destination';

interface Position {
    lat: () => number;
    lng: () => number;
}

export interface GoogleMarkerIntf {
    position: Position;
    setVisible: (value: boolean) => void;
    destination: IDestination;
}

export interface GoogleClusterIntf {
    getBounds: () => GoogleLatLngBounds;
    getCenter: () => Position;
    markers_: GoogleMarkerIntf[];
    getMarkers: () => GoogleMarkerIntf[];
    minClusterSize_: number;
    clusterIcon_: {
        hide: () => void;
    };
}

export interface GoogleMarkerClustererInf {
    new (map: any, markers: any[], options: any): GoogleMarkerClustererInf;
    clusters_: GoogleClusterIntf[];
    markers_: GoogleMarkerIntf[];
    getMarkers: () => GoogleMarkerIntf[];
    ready_: boolean;
    setMap: (v: any) => void;
    clearMarkers: () => void;
}

export interface GoogleLatLng {
    new (lat: number, lng: number): GoogleLatLng;

    lat: () => number;
    lng: () => number;
}

export interface GoogleLatLngBounds {
    new (sw: GoogleLatLng, nw: GoogleLatLng): GoogleLatLngBounds;

    getNorthEast: () => GoogleLatLng;
    getSouthWest: () => GoogleLatLng;
}
