import { departureAirportActionType } from '../actions/actionTypes';
import { DepartureAirportState } from 'models/response/departureAirport';


const initialState = new DepartureAirportState();

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case departureAirportActionType.FETCH_DEPARTUREAIRPORT_CLEAR:
            return fetchDepartureAirportClear(state);
        case departureAirportActionType.FETCH_DEPARTUREAIRPORT_START:
            return fetchDepartureAirportStart(state);
        case departureAirportActionType.FETCH_DEPARTUREAIRPORT_SUCCESS:
            return fetchDepartureAirportSuccess(state, action);
        case departureAirportActionType.FETCH_DEPARTUREAIRPORT_FAIL:
            return fetchDepartureAirportFail(state, action);
        default:
            return state;
    }
};

const fetchDepartureAirportClear = (state: DepartureAirportState) =>
    state.set('lat', null).set('lng', null).set('isLoading', false);

const fetchDepartureAirportStart = (state: DepartureAirportState) => state.set('error', null).set('isLoading', true);

const fetchDepartureAirportSuccess = (state: DepartureAirportState, action: any) =>
    state.set('lat', action.lat).set('lng', action.lng).set('isLoading', false);

const fetchDepartureAirportFail = (state: DepartureAirportState, action: any) =>
    state
        .set('error', action.error)
        .set('lat', null)
        .set('lng', null)
        .set('isLoading', false);

export default reducer;
