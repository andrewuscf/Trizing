'use strict';

import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage, checkStatus} from './utils';
import RNFetchBlob from 'react-native-fetch-blob'


export function updateProfile(data, asyncActions) {
    return (dispatch, getState) => {
        const url = `${API_ENDPOINT}user/profile/${getState().Global.RequestUser.id}/`.toString();
        const arrayData = [
            {name: 'first_name', data: data.first_name},
            {name: 'last_name', data: data.last_name},
            {name: 'phone_number', data: data.phone_number.toString()},
        ]
        if (data.avatar.uri) {
            arrayData.push({name: 'avatar', filename: 'avatar.jpg', data: data.avatar.data});
        }
        console.log(data)
        return RNFetchBlob.fetch('PATCH', url, {
                Authorization: `Token ${getState().Global.UserToken}`,
                'Content-Type': 'multipart/form-data',
            }, arrayData
        ).uploadProgress((written, total) => {
            asyncActions((written / total));
        }).then((resp) => {
            asyncActions(100);
            asyncActions(0);
            dispatch({type: types.UPDATE_PROFILE, profile: JSON.parse(resp.data)});
        }).catch((err) => {
            console.log(err);
        });
    }
}


export function updateUser(data, profileData = false, asyncActions) {
    let jsondata = JSON.stringify(data);
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}user/${getState().Global.RequestUser.id}/`,
            fetchData('PATCH', jsondata, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.UPDATE_USER, request_user: responseJson});
            }).then(() => {
                if (profileData) {
                    asyncActions(.25);
                    return dispatch(updateProfile(profileData, asyncActions))
                }
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