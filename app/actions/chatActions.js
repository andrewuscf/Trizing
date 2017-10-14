'use strict';
import RNFetchBlob from 'react-native-fetch-blob';

import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage, checkStatus, setHeaders} from './utils';


export function getChatRooms(refresh = false) {
    let url = `${API_ENDPOINT}social/rooms/`;
    return (dispatch, getState) => {
        if (refresh) dispatch(refreshPage());
        if (!refresh && getState().Chat.RoomsNext)
            url = getState().Chat.RoomsNext;
        return fetch(url, fetchData('GET', null, getState().Global.UserToken))
            .then((response) => response.json())
            .then((responseJson) => {
                return dispatch({type: types.LOAD_ROOMS, response: responseJson, refresh: refresh});
            }).catch((error) => {
                console.log(error);
            });
    }
}

export function sendMessage(data, pushNotification= false) {
    return {type: types.SEND_MESSAGE, message: data, pushNotification};
}

export function createChatRoom(data, asyncActions) {
    asyncActions(true);
    return (dispatch, getState) => {

        return RNFetchBlob.fetch('POST', `${API_ENDPOINT}social/rooms/`,
            setHeaders(getState().Global.UserToken), JSON.stringify(data))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.label) {
                    asyncActions(false, responseJson.label);
                    return dispatch({type: types.CREATE_CHAT_ROOM, response: responseJson});
                } else {
                    asyncActions(false);
                }
            }).catch((error) => {
                asyncActions(false);
                console.log(error.errors)
                return dispatch({type: types.API_ERROR});
            });

    }
}

export function getTeam(refresh = false) {
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}team/`, fetchData('GET', null, getState().Global.UserToken))
            .then((response) => response.json())
            .then((responseJson) => {
                return dispatch({type: types.GET_TEAM, response: responseJson, refresh: refresh});
            })
    }
}