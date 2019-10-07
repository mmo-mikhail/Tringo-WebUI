declare global {
    interface Window {
        populateFlight(param: flightSearchParameters): void;
    }
}

export interface flightSearchParameters {
    from?: string;
    fromCity?: string;
    to: string;
    toCity: string;
    tripType: string;
    dateOut: string;
    dateBack: string;
}

export function showModalWidget(params: flightSearchParameters) {
    window.populateFlight(params);
}
