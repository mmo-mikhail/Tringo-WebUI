
import { DatesInput } from "./dateInput";

export class FlightDestinationRequest {
    constructor(
        private departureAirportId: string, // as IATA code?
        private areaToRequest: MapArea,
        private budget: Budget,
        private dates: DatesInput
    ) { }
}

export class Budget {
    constructor(
        private from: number,
        private to: number
    ) { }
}

export class MapArea {
    constructor(
        private lat: number,
        private lng: number,
        private radius: number
    ) { }
}