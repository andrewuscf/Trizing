import React from 'react';
const CreateClass = require('create-react-class');
import {combineReducers} from 'redux';


import Global from './globalReducers';
import Home from './homeReducers';
import Calendar from './calendarReducers';
import Chat from './chatReducers';
import Feed from './feedReducers';

export default combineReducers({
    Global,
    Home,
    Calendar,
    Chat,
    Feed
});

