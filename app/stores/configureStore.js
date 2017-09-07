import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {autoRehydrate} from 'redux-persist';

import chainMiddleware from './chainMiddleware';
import rootReducer from '../reducers/index';
import effects from '../effects';


export default function configureStore(initialState = {}) {
    return createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(
                chainMiddleware(effects),
                thunk,
            ),
            autoRehydrate()
        )
    );
}