import { DatesInput, UncertainDates, Duration } from './dateInput';

export class FlightDestinationRequest {
    constructor(
        public departureAirportId: string, // as IATA
        public areaToRequest: MapArea,
        public budget: Budget,
        public dates: DatesInput
    ) {}

    static createRandom(): FlightDestinationRequest {
        return new FlightDestinationRequest(
            'MEL',
            new MapArea(-12.21, 66.6, 199),
            new Budget(0, 1000),
            new DatesInput(null, null, new UncertainDates(10, Duration.Weekend))
        );
    }
}

export class Budget {
    constructor(public from: number, public to: number) {}
}

export class MapArea {
    constructor(
        public lat: number,
        public lng: number,
        public radius: number
    ) {}
}

export interface IFlightsRequestAction {
    type: string;
    model: FlightDestinationRequest;
}
