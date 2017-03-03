'use strict';
import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage, SITE, checkStatus} from './utils';
import {AsyncStorage} from 'react-native';
import {LoginManager} from 'react-native-fbsdk';

export function setTokenInRedux(token, FromAPI = false) {
    if (FromAPI) {
        AsyncStorage.setItem('USER_TOKEN', token)
    }
    return {type: types.SET_TOKEN, token: token}
}

export function removeDeviceNotification(token) {
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}devices/${token}/`, fetchData('DELETE', null, getState().Global.UserToken));
    }
}

export function removeToken(token) {
    return (dispatch) => {
        AsyncStorage.removeItem('USER_TOKEN');
        LoginManager.logOut();
        if (token) dispatch(removeDeviceNotification(token));
        dispatch({type: types.REMOVE_TOKEN});
    };
}

export function login(email, pass) {
    const body = JSON.stringify({username: email, password: pass});
    return dispatch => {
        return fetch(`${API_ENDPOINT}auth/token/`, fetchData('POST', body))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.token) {
                    return dispatch(setTokenInRedux(responseJson.token, true));
                }
                if (responseJson.non_field_errors) {
                    return dispatch({
                        type: types.API_ERROR, error: JSON.stringify({
                            title: 'Incorrect Email or Password',
                            text: 'Please Try Again'
                        })
                    });
                }
            })
            .catch((error) => {
                return dispatch(
                    removeToken()
                );
            }).done();
    }
}


export function getUser(url = `${API_ENDPOINT}user/me/`, refresh = false) {
    return (dispatch, getState) => {
        if (refresh) {
            dispatch(refreshPage());
        }
        return fetch(url, fetchData('GET', null, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.detail)
                    return dispatch(removeToken());
                return dispatch({type: types.LOAD_REQUEST_USER, request_user: responseJson});
            })
            .catch((error) => {
                return dispatch(removeToken());
            }).done();
    }
}


export function resetPassword(email) {
    return (dispatch, getState) => {
        const data = JSON.stringify({email: email});
        return fetch(`${API_ENDPOINT}auth/password/reset/`, fetchData('POST', data))
            .then((response) => {
                if (response.status == 204) {
                    return dispatch({
                        type: types.API_ERROR, error: JSON.stringify({
                            title: 'Reset password sent',
                            text: 'Please check your email for the reset password link'
                        })
                    });
                } else {
                    return dispatch({
                        type: types.API_ERROR, error: JSON.stringify({
                            title: 'Request could not be performed.',
                            text: 'Please try again later.'
                        })
                    });
                }
            }).done();
    }
}

export function register(data) {
    return (dispatch, getState) => {
        let JSONDATA = JSON.stringify(data);
        return fetch(`${API_ENDPOINT}auth/register/`, fetchData('POST', JSONDATA))
            .then(checkStatus)
            .then((responseJson) => {
                let message;
                if (responseJson.email) {
                    message = {
                        title: 'Email verification required',
                        text: 'Please check your email in order to verify your account'
                    };
                    if (responseJson.email.constructor === Array)
                        message = {
                            title: responseJson.email[0],
                            text: 'Please use another email or log into your account.'
                        };
                }
                if (responseJson.username) {
                    if (responseJson.username.constructor === Array)
                        message = {
                            title: responseJson.username[0],
                            text: 'Please use another username or log into your account.'
                        };
                }
                return dispatch({type: types.REGISTER_USER, message: JSON.stringify(message)});
            })
            .catch((error) => {
                console.log(error);
                return dispatch({
                    type: types.API_ERROR, error: JSON.stringify({
                        title: 'Request could not be performed.',
                        text: 'Please try again later.'
                    })
                });
            }).done();
    }
}

export function socialAuth(access_token) {
    return (dispatch, getState) => {
        return fetch(`${SITE}social/register/facebook/?access_token=${access_token}`, fetchData('GET', null))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.token)
                    return dispatch(setTokenInRedux(responseJson.token, true));
            })
            .catch((error) => {
                return dispatch({
                    type: types.API_ERROR, error: JSON.stringify({
                        title: 'Request could not be performed.',
                        text: 'Please try again later.'
                    })
                });
            }).done();
    }
}

export function getNotifications(refresh=false) {
    let url = `${API_ENDPOINT}notifications/`;
    return (dispatch, getState) => {
        return fetch(url, fetchData('GET', null, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.GET_NOTIFICATIONS, response: responseJson, refresh: refresh});
            }).done();
    }
}

export function readNotification(id) {
    const url = `${API_ENDPOINT}notification/${id}/`;
    return (dispatch, getState) => {
        const data = JSON.stringify({unread: false});
        return fetch(url, fetchData('PATCH', data, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.READ_NOTIFICATION, noteId: id});
            })
            .catch((error) => {
                console.log(error);
            }).done();
    }
}


export function clearAPIError() {
    return {type: types.CLEAR_API_ERROR}
}

export function getQuestionnaires(refresh = false) {
    return (dispatch, getState) => {
        let url = `${API_ENDPOINT}training/questionnaires/`;
        if (!refresh && getState().Global.QuestionnairesNext)
            url = getState().Global.QuestionnairesNext;
        return fetch(url, fetchData('GET', null, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.GET_QUESTIONNAIRES, response: responseJson, refresh: refresh});
            })
            .catch((error) => {
                console.log(error);
            }).done();
    }
}

export function createQuestionnaire(data, asyncActions) {
    asyncActions(true);
    let JSONDATA = JSON.stringify(data);
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/questionnaires/`,
            fetchData('POST', JSONDATA, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                asyncActions(false);
                return dispatch({type: types.CREATE_QUESTIONNAIRE, response: responseJson});
            })
            .catch((error) => {
                asyncActions(false);
                console.log(error);
            }).done();
    }
}

export function createWorkout(data, asyncActions) {
    asyncActions(true);
    let JSONDATA = JSON.stringify(data);
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/workouts/`,
            fetchData('POST', JSONDATA, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                asyncActions(false);
                return dispatch({type: types.CREATE_WORKOUT, response: responseJson});
            })
            .catch((error) => {
                asyncActions(false);
                console.log(error);
            }).done();
    }
}