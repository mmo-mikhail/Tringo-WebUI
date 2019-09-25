import { combineReducers } from 'redux';
import destinationsReducer from './destinationsReducer';
import departureAirportReducer from './departureAirportReducer';

export default combineReducers({
    destinationsReducer,
    departureAirportReducer
});
