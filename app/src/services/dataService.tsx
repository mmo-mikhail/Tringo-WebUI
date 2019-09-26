import { callApi } from 'services/apiService';
import { Coordinates } from '../models/request/flightDestinationRequest';

export interface airportLocation {
    TsaAirportCode: string;
    City: string;
    Airport: string;
    AirportCode: string;
    Country: string;
    IsMetro: boolean;
    HasMetro: boolean;
    NearKeyword: string;
    CityAirportName: string;
}

export function fetchLocationData(inputValue: string, callback: (arg?: any) => {}) {
    const method = 'GET';
    const endpoint = process.env.REACT_APP_WEBJET_DEPARTURE_API_URL;
    const url = inputValue ? endpoint!.replace('{0}', inputValue) : inputValue;
    callApi(url, method).then(
        (response: Object[]) => {
            if (!response || !(response.length >= 0)) {
                callback();
            }
            callback(mapLocationData(response as airportLocation[], inputValue));
        },
        () => {
            callback();
        }
    );
}

export function fetchDepartureAirport(inputValue: string, callback: (arg: Coordinates) => void) {
    const method = 'GET';
    const endpoint = process.env.REACT_APP_TRINGO_API;
    const departureURL = process.env.REACT_APP_TRINGO_API_DEPARTURE_URL ? process.env.REACT_APP_TRINGO_API_DEPARTURE_URL : '';
    const url = inputValue ? endpoint!.concat(departureURL).concat(inputValue)
        : inputValue;
    callApi(url, method).then(
        (response: Coordinates) => {
            if (response !== null) {
                callback(response);
            } else {
                callback(new Coordinates(0, 0));
            }
        });
}

export function mapLocationData(data: airportLocation[], inputValue: string) {
    return data
        .filter(d => d.Country.toUpperCase() === process.env.REACT_APP_DEFULT_COUNTRY)
        .map((location: airportLocation) => {
            return {
                city: location.City,
                hasMetro: location.HasMetro,
                value: location.AirportCode,
                // eslint-disable-next-line max-len
                label: `${location.City}, ${location.Country} - ${location.Airport} (${
                    location.IsMetro ? location.AirportCode : location.TsaAirportCode
                })`,
                optionLabel: `${location.City} (${location.Airport})`,
                optionSubLabel: `${location.City}, ${location.Country}`
            };
        })
        .filter(
            f =>
                f.optionLabel.toUpperCase().includes(inputValue.toUpperCase()) ||
                f.optionSubLabel.toUpperCase().includes(inputValue.toUpperCase())
        );
}
