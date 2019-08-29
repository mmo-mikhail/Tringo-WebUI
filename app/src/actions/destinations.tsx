import { destinationActionType } from './actionTypes';
import { IDestination } from '../models/response/destination';
import {
    FlightDestinationRequest,
    IFlightsRequestAction
} from '../models/request/flightDestinationRequest';

export const fetchDestinationsStart = (
    model: FlightDestinationRequest
): IFlightsRequestAction => {
    return {
        type: destinationActionType.FETCH_DESTINATION_START,
        model
    };
};

export const fetchDestinationsSuccess = (destinations: IDestination[]) => {
    return {
        type: destinationActionType.FETCH_DESTINATION_SUCCESS,
        destinations
    };
};

export const fetchDestinationsFail = (error: string) => {
    return {
        type: destinationActionType.FETCH_DESTINATION_FAIL,
        error
    };
};
