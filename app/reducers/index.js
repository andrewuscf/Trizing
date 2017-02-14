import React from 'react';
import {combineReducers} from 'redux';


import Global from './globalReducers';
import Home from './homeReducers';

export default combineReducers({
    Global,
    Home
});

