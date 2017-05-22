'use strict';

import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage, checkStatus} from './utils';


export function getChatRooms(refresh = false) {
    let url = `${API_ENDPOINT}social/chats/`;
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

export function sendMessage(data) {
    return {type: types.SEND_MESSAGE, response: data};
}

export function createChatRoom(data, asyncActions) {
    asyncActions(true);
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}social/chats/`,
            fetchData('POST', JSON.stringify(data), getState().Global.UserToken))
            .then((response) => response.json())
            .then((responseJson) => {
                asyncActions(false, responseJson.id);
                return dispatch({type: types.CREATE_CHAT_ROOM, response: responseJson});
            })
            .catch((error) => {
                asyncActions(false);
                return dispatch({
                    type: types.API_ERROR, error: JSON.stringify({
                        title: 'Request could not be performed.',
                        text: 'Please try again later.'
                    })
                });
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