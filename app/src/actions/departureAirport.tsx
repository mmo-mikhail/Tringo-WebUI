import { departureAirportActionType } from './actionTypes';
import { IDepartureAirport } from 'models/response/departureAirport';
import { DepartureAirportRequest, IDepartureAirportRequestAction } from '../models/request/departureAirportRequest';

export const fetchDepartureAirportStart = (model: DepartureAirportRequest): IDepartureAirportRequestAction => {
    return {
        type: departureAirportActionType.FETCH_DEPARTUREAIRPORT_START,
        model
    };
};

export const fetchDepartureAirportClear = (model: DepartureAirportRequest): IDepartureAirportRequestAction => {
    return {
        type: departureAirportActionType.FETCH_DEPARTUREAIRPORT_CLEAR,
        model
    };
};

export const fetchDepartureAirportSuccess = (departureAirport: IDepartureAirport) => {
    return {
        type: departureAirportActionType.FETCH_DEPARTUREAIRPORT_SUCCESS,
        departureAirport
    };
};

export const fetchDepartureAirportFail = (error: string) => {
    return {
        type: departureAirportActionType.FETCH_DEPARTUREAIRPORT_FAIL,
        error
    };
};
