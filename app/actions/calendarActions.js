'use strict';

import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage, checkStatus} from './utils';


export function getEvents(refresh = false) {
    let url = `${API_ENDPOINT}social/events/`;
    return (dispatch, getState) => {
        if (!refresh && getState().Calendar.EventsNext)
            url = getState().Calendar.EventsNext;
        return fetch(url, fetchData('GET', null, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.GET_EVENTS, response: responseJson, refresh: refresh});
            }).done();
    }
}