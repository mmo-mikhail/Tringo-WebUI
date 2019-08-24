export function googleZoomToKms(zoomLevel: number) {
    return (40000 / (2 ^ zoomLevel)) * 2.2; // looks similar to, but not idea if correct
}
