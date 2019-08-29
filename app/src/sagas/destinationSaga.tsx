import { call, put } from 'redux-saga/effects';

import axios from './../utils/axious';
import * as destinationAction from '../actions/destinations';
import { IFlightsRequestAction } from 'models/request/flightDestinationRequest';

export function* fetchDestinationsSaga(action: IFlightsRequestAction) {
    try {
        const response = yield call(
            // axios.post,
            // '/api/v1/flights/GetDestinationPrice'
            axios.post,
            '/api/v1/flights/GetDestinationPrices', // note the 's' at the end
            action.model
        );

        yield put(destinationAction.fetchDestinationsSuccess(response.data));
    } catch (error) {
        yield put(destinationAction.fetchDestinationsFail(error.message));
    }
}
