'use strict';

import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage, checkStatus, setHeaders} from './utils';
import RNFetchBlob from 'react-native-fetch-blob';
import moment from 'moment';


export function getClients(refresh = false) {
    let url = `${API_ENDPOINT}clients/`;
    return (dispatch, getState) => {
        if (refresh) {
            dispatch(refreshPage());
        }
        return fetch(url, fetchData('GET', null, getState().Global.UserToken))
            .then(checkStatus)
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
            .then(checkStatus)
            .then((response) => {
                return dispatch({type: types.DELETE_CLIENT, clientId: clientId});
            })
    }
}

export function sendRequest(data) {
    let url = `${API_ENDPOINT}requests/`;
    return (dispatch, getState) => {
        return fetch(url, fetchData('POST', JSON.stringify(data), getState().Global.UserToken))
            .then(checkStatus)
            .then((response) => {
                return dispatch({type: types.SEND_REQUEST});
            })
    }
}

export function getActiveData(date, refresh) {
    return (dispatch, getState) => {
        if (refresh) {
            dispatch(refreshPage());
        }
        let url = `${API_ENDPOINT}user/active/${getState().Global.RequestUser.id}/?for_date=${date}`;
        return fetch(url, fetchData('GET', null, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.LOAD_ACTIVE_DATA, response: {...responseJson, date: date}});
            })
    }
}

export function addWeightLog(response) {
    return {type: types.ADD_WEIGHT_LOG, response}
}

export function addMacroLog(response) {
    return {type: types.ADD_MACRO_LOG, response}
}

export function getWeightLogs(timeFrame, refresh) {
    return (dispatch, getState) => {
        let url = `${API_ENDPOINT}training/weight/logs/`;
        const today = moment();
        if (timeFrame === "month") {
            url += `?start_date=${today.subtract(1, 'month').format("YYYY-MM-DD")}`;
        } else if (timeFrame === "three_months") {
            url += `?start_date=${today.subtract(3, 'month').format("YYYY-MM-DD")}`;
        } else if (timeFrame === "year") {
            url += `?start_date=${today.subtract(1, 'year').format("YYYY-MM-DD")}`;
        }

        return RNFetchBlob.fetch('GET', url, setHeaders(getState().Global.UserToken)).then((res) => {
            let responseJson = res.json();
            return dispatch({type: types.LOAD_WEIGHT_LOGS, response: responseJson, timeFrame: timeFrame, refresh: refresh});
        }).catch((errorMessage, statusCode) => {
            console.log(errorMessage);
        });

    }
}