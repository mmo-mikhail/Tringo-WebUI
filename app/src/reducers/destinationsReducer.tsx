import { destinationActionType } from '../actions/actionTypes';
import { DestinationsState } from '../models/destinations';

const initialState = new DestinationsState();

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case destinationActionType.FETCH_DESTINATION_START:
            return fetchDestinationsStart(state, action);
        case destinationActionType.FETCH_DESTINATION_SUCCESS:
            return fetchDestinationsSuccess(state, action);
        case destinationActionType.FETCH_DESTINATION_FAIL:
            return fetchDestinationsFail(state, action);
        default:
            return state;
    }
};

const fetchDestinationsStart = (state: DestinationsState, action: any) => {
    return state.set('error', null).set('isLoading', true);
};

const fetchDestinationsSuccess = (state: DestinationsState, action: any) => {
    return state
        .set('destinations', action.destinations)
        .set('isLoading', false);
    //return copy;
};

const fetchDestinationsFail = (state: DestinationsState, action: any) => {
    return state.set('error', action.error).set('isLoading', false);
};

export default reducer;
