﻿import { combineReducers } from 'redux';
import destinationsReducer from './destinationsReducer';

class Interface {
    Blah: string = 'sdasda';
    Blah2: string = 'sdasda';
}

export default combineReducers({
    destinationsReducer
});
