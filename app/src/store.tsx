import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { root } from 'sagas/rootSaga';
import rootReducer from './reducers/rootReducer';

const sagaMiddleware = createSagaMiddleware();

export function configureStore(initialState = {}) {
    var store = createStore(
        rootReducer,
        //initialState,
        applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(root);
    return store;
}