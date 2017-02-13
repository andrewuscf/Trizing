import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import chainMiddleware from './chainMiddleware';
import rootReducer from '../reducers';
import effects from '../effects';


export default function configureStore(initialState = {}) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(
            chainMiddleware(effects),
            thunk,
        )
    );
}