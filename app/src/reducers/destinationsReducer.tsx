import { destinationActionType } from "../actions/actionTypes";

const reducer = (state = {}, action: any) => {
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

const fetchDestinationsStart = (state: any, action: any) => {
    return Object.assign({}, state, { error: null, isLoading: true });;
};

const fetchDestinationsSuccess = (state: any, action: any) => {
    let copy = Object.assign({}, state, { destinations: action.destinations, isLoading: false });
    return copy;
};

const fetchDestinationsFail = (state: any, action: any) => {
    return Object.assign({}, state, { error: action.error, isLoading: false });
};

export default reducer;