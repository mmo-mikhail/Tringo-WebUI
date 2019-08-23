
import { DatesInput } from "./dateInput";

export class FlightDestinationRequest {
    departureAirportId: string; // as IATA code?

    areaToRequest: MapArea;

    budget: Budget;

    dates: DatesInput;
}

export class Budget {
    from: number;
    to: number;
}

export class MapArea {
    lat: number;
    lng: number;
    radius: number;
}