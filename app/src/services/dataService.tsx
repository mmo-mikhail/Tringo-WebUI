import { callApi } from 'services/apiService';

interface airportLocation {
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
            callback(mapLocationData(response as airportLocation[]));
        },
        () => {
            callback();
        }
    );
}

export function mapLocationData(data: airportLocation[]) {
    return data.map((location: airportLocation) => {
        return {
            hasMetro: location.HasMetro,
            value: location.AirportCode,
            // eslint-disable-next-line max-len
            label: `${location.City}, ${location.Country} - ${location.Airport} (${
                location.IsMetro ? location.AirportCode : location.TsaAirportCode
            })`,
            optionLabel: `${location.City} (${location.Airport})`,
            optionSubLabel: `${location.City}, ${location.Country}`
        };
    });
}
