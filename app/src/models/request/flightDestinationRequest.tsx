
import { DatesInput } from "./dateInput";

export class FlightDestinationRequest {
    constructor(
        public departureAirportId: string, // as IATA code?
        public areaToRequest: MapArea,
        public budget: Budget,
        public dates: DatesInput
    ) { }
}

export class Budget {
    constructor(
        public from: number,
        public to: number
    ) { }
}

export class MapArea {
    constructor(
        public lat: number,
        public lng: number,
        public radius: number
    ) { }
}