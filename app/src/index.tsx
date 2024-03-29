import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tringo from './tringo';
import * as serviceWorker from './serviceWorker';

import State from 'models/state';

// Required for Redux store setup
import { Provider } from 'react-redux';
import { configureStore } from './store';

const initialState = State();
const store = configureStore(initialState);
ReactDOM.render(
    <Provider store={store}>
        <Tringo />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
