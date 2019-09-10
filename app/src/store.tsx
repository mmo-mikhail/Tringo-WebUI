import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from 'sagas/rootSaga';
import rootReducer from './reducers/rootReducer';

const sagaMiddleware = createSagaMiddleware();

// @ts-ignore
export function configureStore(initialState = {}) {
    const store = createStore(
        rootReducer,
        //initialState,
        applyMiddleware(sagaMiddleware)
    );
    sagaMiddleware.run(rootSaga);
    return store;
}
