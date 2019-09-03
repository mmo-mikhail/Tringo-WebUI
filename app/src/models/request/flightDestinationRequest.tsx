import { DatesInput, UncertainDates, Duration } from './dateInput';

export class FlightDestinationRequest {
    constructor(
        public departureAirportId: string, // as IATA
        public searchArea: MapArea,
        public budget: Budget,
        public dates: DatesInput
    ) {}

    static createRandom(): FlightDestinationRequest {
        return new FlightDestinationRequest(
            'MEL',
            MapArea.createRandom(),
            new Budget(0, 1000),
            new DatesInput(null, null, new UncertainDates(10, Duration.Weekend))
        );
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
