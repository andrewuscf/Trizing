'use strict';

import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage} from './utils';


export function getClients(refresh = false) {
    let url = `${API_ENDPOINT}clients/`;
    return (dispatch, getState) => {
        if (refresh) {
            dispatch(refreshPage());
        }
        return fetch(url, fetchData('GET', null, getState().Global.UserToken))
            .then((response) => response.json())
            .then((responseJson) => {
                return dispatch({type: types.LOAD_CLIENTS, response: responseJson, refresh: refresh});
            })
            .catch((error) => {
                return dispatch({
                    type: types.API_ERROR, error: JSON.stringify({
                        title: 'Request could not be performed.',
                        text: 'Please try again later.'
                    })
                });
            });
    }
}

export function removeClient(clientId) {
    let url = `${API_ENDPOINT}client/${clientId}/`;
    return (dispatch, getState) => {
        return fetch(url, fetchData('DELETE', null, getState().Global.UserToken))
            .then((response) => {
                return dispatch({type: types.DELETE_CLIENT, clientId: clientId});
            })
    }
}

export function sendRequest(data) {
    let url = `${API_ENDPOINT}requests/`;
    return (dispatch, getState) => {
        return fetch(url, fetchData('POST', JSON.stringify(data), getState().Global.UserToken))
            .then((response) => {
                return dispatch({type: types.SEND_REQUEST});
            })
    }
}