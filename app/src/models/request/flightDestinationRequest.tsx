import { DatesInput } from './dateInput';

export class BaseFlightDestinationRequest {
    constructor(
        public departureAirportId: string, // as IATA
        public dates: DatesInput
    ) {}

    static createRandom(): FlightDestinationRequest {
        return new FlightDestinationRequest('MEL', MapArea.createRandom(), new Budget(0, 1000), new DatesInput(-1));
    }
}

export class FlightDestinationRequest extends BaseFlightDestinationRequest {
    constructor(
        public departureAirportId: string, // as IATA
        public searchArea: MapArea,
        public budget: Budget | null, // null only when budget is 'any'
        public dates: DatesInput
    ) {
        super(departureAirportId, dates);
    }

    static createRandom(): FlightDestinationRequest {
        return new FlightDestinationRequest('MEL', MapArea.createRandom(), new Budget(0, 1000), new DatesInput(-1));
    }
}

export class Budget {
    constructor(public min: number, public max: number) {}
}

export class MapArea {
    constructor(public nw: Coordinates, public se: Coordinates) {}

    static createRandom(): MapArea {
        return new MapArea(new Coordinates(12.1, 32.2), new Coordinates(52.8, 39.67));
    }
}

export class Coordinates {
    constructor(public lat: number, public lng: number) {}
}

export interface IFlightsRequestAction {
    type: string;
    model: FlightDestinationRequest;
}
