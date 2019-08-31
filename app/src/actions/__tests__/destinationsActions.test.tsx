import { destinationActionType } from '../actionTypes';
import { fetchDestinationsStart, fetchDestinationsSuccess, fetchDestinationsFail } from '../destinations';
import { IDestination } from 'models/response/destination';
import { FlightDestinationRequest, IFlightsRequestAction } from '../../models/request/flightDestinationRequest';

describe('Destinaton Actions', () => {
    describe('fetchDestinationsStart', () => {
        it('should return the correct type', () => {
            let flightsRequest = FlightDestinationRequest.createRandom();
            const expectedResult: IFlightsRequestAction = {
                type: destinationActionType.FETCH_DESTINATION_START,
                model: flightsRequest
            };

            expect(fetchDestinationsStart(flightsRequest)).toEqual(expectedResult);
        });
    });

    describe('fetchDestinationsSuccess', () => {
        const testDestinations: IDestination[] = [
            {
                lat: 4322.34,
                lng: 5436.789,
                price: 5432.21,
                cityName: 'CityNameTest',
                personalPriorityIdx: 6
            }
        ];

        it('should return the correct type', () => {
            const expectedResult = {
                type: destinationActionType.FETCH_DESTINATION_SUCCESS,
                destinations: testDestinations
            };

            expect(fetchDestinationsSuccess(testDestinations)).toEqual(expectedResult);
        });
    });

    describe('fetchDestinationsFail', () => {
        it('should return the correct type', () => {
            const testError = 'error';

            const expectedResult = {
                type: destinationActionType.FETCH_DESTINATION_FAIL,
                error: testError
            };

            expect(fetchDestinationsFail(testError)).toEqual(expectedResult);
        });
    });
});
