import { put, call } from "redux-saga/effects";

import axios from "./../utils/axious";
import * as destinationAction from "../actions/destinations";

export function* fetchDestinationsSaga() {
    try {
        const response = yield call(axios.get, "/api/v1/flights/GetDestinationPrice", );

        yield put(destinationAction.fetchDestinationsSuccess(response.data));
    } catch (error) {
        yield put(destinationAction.fetchDestinationsFail(error.message));
    }
}