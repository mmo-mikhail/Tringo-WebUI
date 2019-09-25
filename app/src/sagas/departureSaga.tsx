import { call, put } from 'redux-saga/effects';

import axios from 'utils/axious';
import * as departureAirportAction from 'actions/departureAirport';
import { IDepartureAirportRequestAction } from 'models/request/departureAirportRequest';

export function* fetchDepartureAirportSaga(action: IDepartureAirportRequestAction) {
    if (!action.model.departureAirportId) {
        yield put(departureAirportAction.fetchDepartureAirportClear(action.model));
    }
    
    try {
        const response = yield call(
            axios.post,
            '/api/v1/airports/GetAirportCoordinates', // note the 's' at the end
            action.model
        );
        yield put(departureAirportAction.fetchDepartureAirportSuccess(response.data));
    } catch (error) {
        yield put(departureAirportAction.fetchDepartureAirportFail(error.message));
    }
}
