export interface IDestination {
    lat: number;
    lng: number;
    price: number;
    cityName: string;
    destAirportCode: string;
    personalPriorityIdx: number;
    flightDates: IFlightDates;
}

export interface IFlightDates {
    flightMonthidx: number;
}
