import { takeEvery, all } from 'redux-saga/effects';
import { destinationActionType } from '../actions/actionTypes';
import * as destinationSaga from './destinationSaga';

export function* rootSaga() {
    yield all([
        takeEvery(
            destinationActionType.FETCH_DESTINATION_START,
            destinationSaga.fetchDestinationsSaga
        )
    ]);
}
