import { all, takeLatest } from 'redux-saga/effects';
import { destinationActionType } from '../actions/actionTypes';
import * as destinationSaga from './cachedDestinationSaga';

export function* rootSaga() {
    yield all([takeLatest(destinationActionType.FETCH_DESTINATION_START, destinationSaga.fetchDestinationsSaga)]);
}
