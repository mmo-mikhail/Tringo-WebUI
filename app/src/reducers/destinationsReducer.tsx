import { destinationActionType } from '../actions/actionTypes';
import { DestinationsState } from 'models/response/destinations';

const initialState = new DestinationsState();

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case destinationActionType.FETCH_DESTINATION_CLEAR:
            return fetchDestinationsClear(state);
        case destinationActionType.FETCH_DESTINATION_START:
            return fetchDestinationsStart(state);
        case destinationActionType.FETCH_DESTINATION_SUCCESS:
            return fetchDestinationsSuccess(state, action);
        case destinationActionType.FETCH_DESTINATION_FAIL:
            return fetchDestinationsFail(state, action);
        default:
            return state;
    }
};

const fetchDestinationsClear = (state: DestinationsState) => state.set('destinations', null).set('isLoading', false);

const fetchDestinationsStart = (state: DestinationsState) => state.set('error', null).set('isLoading', true);

const fetchDestinationsSuccess = (state: DestinationsState, action: any) =>
    state.set('destinations', action.destinations).set('isLoading', false);

const fetchDestinationsFail = (state: DestinationsState, action: any) =>
    state.set('error', action.error).set('isLoading', false);

export default reducer;
