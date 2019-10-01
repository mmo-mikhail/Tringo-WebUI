
const OFFSET = 268435456;
const RADIUS = 85445659.4471; /* $offset / pi() */


function lonToX($lon: number) {
	return Math.round(OFFSET + RADIUS * $lon * Math.PI / 180);
}

function latToY($lat : number) {
	return Math.round(OFFSET - RADIUS *
		Math.log((1 + Math.sin($lat * Math.PI / 180)) /
			(1 - Math.sin($lat * Math.PI / 180))) / 2);
}

export function pixelDistance($lat1: number, $lon1: number, $lat2: number, $lon2: number, $zoom: number) {
	const $x1 = lonToX($lon1);
	const $y1 = latToY($lat1);

	const $x2 = lonToX($lon2);
	const $y2 = latToY($lat2);

	return Math.sqrt(Math.pow(($x1 - $x2), 2) + Math.pow(($y1 - $y2), 2)) >> (21 - $zoom);
}