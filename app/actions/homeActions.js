'use strict';
import {Platform} from 'react-native';
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
            .catch(() => {
                return dispatch({type: types.API_ERROR});
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
            }).catch(() => {
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function sendRequest(data) {
    let url = `${API_ENDPOINT}requests/`;
    return (dispatch, getState) => {
        return fetch(url, fetchData('POST', JSON.stringify(data), getState().Global.UserToken))
            .then(checkStatus)
            .then((response) => {
                return dispatch({type: types.SEND_REQUEST});
            }).catch(() => {
                return dispatch({type: types.API_ERROR});
            });
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
            }).catch(() => {
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function addWeightLog(response) {
    return {type: types.ADD_WEIGHT_LOG, response}
}

export function addMacroLog(response) {
    return {type: types.ADD_MACRO_LOG, response}
}

export function deleteMacroLog(log) {
    console.log(log)
    return {type: types.DELETE_MACRO_LOG, log}
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

        return RNFetchBlob.fetch('GET', url, setHeaders(getState().Global.UserToken)).then(checkStatus).then((responseJson) => {
            return dispatch({type: types.LOAD_WEIGHT_LOGS, response: responseJson, timeFrame: timeFrame, refresh: refresh});
        }).catch(() => {
            return dispatch({type: types.API_ERROR});
        });

    }
}

export function setDeviceForNotification(token) {
    return (dispatch, getState) => {
        const RequestUser = getState().Global.RequestUser;
        let JSONData = {
            name: `${RequestUser.profile.first_name}-${RequestUser.profile.last_name}-${Platform.OS}`,
            registration_id: token,
            is_active: true,
            type: Platform.OS
        };
        const sendData = JSON.stringify(JSONData);
        return RNFetchBlob.fetch('POST', `${API_ENDPOINT}devices/`,
            setHeaders(getState().Global.UserToken), sendData).then(checkStatus).catch((errorMessage, statusCode) => {
                console.log(errorMessage);
            });
    }
}