'use strict';

import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage, checkStatus} from './utils';


export function getEvents(refresh = false) {
    let url = `${API_ENDPOINT}social/events/`;
    return (dispatch, getState) => {
        if (refresh) dispatch(refreshPage());
        if (!refresh && getState().Calendar.EventsNext)
            url = getState().Calendar.EventsNext;
        return fetch(url, fetchData('GET', null, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.GET_EVENTS, response: responseJson, refresh: refresh});
            }).done();
    }
}

export function addEditEvent(data, asyncActions = null) {
    if (asyncActions) {
        asyncActions(true);
    }
    let url = `${API_ENDPOINT}social/events/`;
    let method = 'POST';
    if (data.id) {
        url = `${API_ENDPOINT}social/event/${data.id}/`;
        method = 'PATCH';
    }
    return (dispatch, getState) => {
        return fetch(url, fetchData(method, JSON.stringify(data), getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                console.log(responseJson)
                if (asyncActions) {
                    asyncActions(false);
                }
                if (method != 'POST')
                    return dispatch({type: types.EDIT_EVENT, response: responseJson});
            })
            .catch((error) => {
                console.log(error);

            })
    }
}