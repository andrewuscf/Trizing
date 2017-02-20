'use strict';

import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage} from './utils';


export function updateProfile(data, asyncActions) {
    asyncActions(true);
    const headers = {
        'Content-Type': 'multipart/form-data',
    };
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}user/profile/${getState().Global.RequestUser.id}/`,
            fetchData('PATCH', data, getState().Global.UserToken, headers))
            .then((response) => response.json())
            .then((responseJson) => {
                asyncActions(false);
                return dispatch({type: types.UPDATE_PROFILE, profile: responseJson});
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


export function updateUser(data) {
    let jsondata = JSON.stringify(data);
    console.log(jsondata)
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}user/${getState().Global.RequestUser.id}/`,
            fetchData('PATCH', jsondata, getState().Global.UserToken))
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                return dispatch({type: types.UPDATE_USER, request_user: responseJson});
            })
            .catch((error) => {
                console.log(error)
                return dispatch({
                    type: types.API_ERROR, error: JSON.stringify({
                        title: 'Request could not be performed.',
                        text: 'Please try again later.'
                    })
                });
            });
    }
}