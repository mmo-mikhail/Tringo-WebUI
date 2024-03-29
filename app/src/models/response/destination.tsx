export interface IDestination {
    lat: number;
    lng: number;
    price: number;
    cityName: string;
    countryName: string;
    airportName?: string;
    destAirportCode: string;
    personalPriorityIdx: number;
    flightDates: IFlightDates;
}

export interface IFlightDates {
    departureDate: Date;
    returnDate: Date;
}
