import { destinationActionType } from './actionTypes';
import { IDestination } from '../models/destination';

export const fetchDestinationsStart = () => {
    return {
        type: destinationActionType.FETCH_DESTINATION_START
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
