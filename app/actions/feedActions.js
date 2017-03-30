'use strict';

import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage, checkStatus} from './utils';


export function getFeed(refresh = false) {
    return (dispatch, getState) => {
        let url = `${API_ENDPOINT}social/posts/`;
        if (!refresh && getState().Global.PostsNext)
            url = getState().Global.PostsNext;
        return fetch(url,
            fetchData('GET', null, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.GET_FEED, response: responseJson, refresh: refresh});
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

export function createPost(data) {
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}social/posts/`,
            fetchData('POST', JSON.stringify(data), getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.CREATE_POST, response: responseJson});
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

export function updateLike(post_id, method) {
    return (dispatch, getState) => {
        let url = `${API_ENDPOINT}social/likes/`;
        let data = JSON.stringify({post: post_id});
        if (method == 'DELETE') {
            url =`${API_ENDPOINT}social/like/${post_id}/${getState().Global.RequestUser.id}/`;
            data = null;
        }

        return fetch(url,
            fetchData(method, data, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.deleted)
                    return dispatch({type: types.UNLIKE, like: {post: post_id, user: getState().Global.RequestUser}});
                else
                    return dispatch({
                        type: types.LIKE,
                        like: responseJson
                    });
            })
    }
}