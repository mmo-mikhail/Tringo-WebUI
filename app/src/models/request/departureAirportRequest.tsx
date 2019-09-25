export class DepartureAirportRequest {
    constructor(
        public departureAirportId: string // as IATA
    )
    {}
    
    static createRandom(): DepartureAirportRequest {
        return new DepartureAirportRequest('MEL');
    }
}

export interface IDepartureAirportRequestAction {
    type: string;
    model: DepartureAirportRequest;
}