//import { takeEvery, put, call } from "redux-saga/effects";
import { delay } from "redux-saga/effects";

//function * getDestinationsAsync(){
//    try {
//        const response = yield call(fetch, 'http://localhost:5000/api/v1/flights/GetDestinationPrice');
//        const responseBody = response.json();
//        yield put(setDestinations(responseBody.records))
//    } catch (e) {
//        yield put(getDestinationsFailed(e));
//    }
//};

export function* root() {
    yield delay(100);
};