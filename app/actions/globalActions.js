'use strict';
import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage, SITE, checkStatus} from './utils';
import {AsyncStorage, Platform} from 'react-native';
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
        return fetch(`${API_ENDPOINT}devices/`, fetchData('POST', sendData, getState().Global.UserToken))
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

export function setActiveRoute(routeName) {
    return {type: types.SET_ACTIVE_ROUTE, routeName: routeName}
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
                console.log(error)
                // return dispatch(
                //     removeToken()
                // );
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
                console.log(error)
                // return dispatch(removeToken());
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

export function getNotifications(refresh = false) {
    let url = `${API_ENDPOINT}notifications/`;
    return (dispatch, getState) => {
        if (!refresh && getState().Global.NotificationsNext)
            url = getState().Global.NotificationsNext;
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
                console.log(responseJson)
                asyncActions(false);
                return dispatch({type: types.CREATE_QUESTIONNAIRE, response: responseJson});
            })
            .catch((error) => {
                asyncActions(false);
                console.log(error);
            }).done();
    }
}

export function getSchedules(param = '', refresh = false) {
    let url = `${API_ENDPOINT}training/schedules/${param}`;
    return (dispatch, getState) => {
        if (refresh) {
            dispatch(refreshPage());
        }
        return fetch(url, fetchData('GET', null, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.LOAD_SCHEDULES, response: responseJson, refresh: refresh});
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

export function createSchedule(data, asyncActions) {
    asyncActions(true);
    let JSONDATA = JSON.stringify(data);
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/schedules/`,
            fetchData('POST', JSONDATA, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                asyncActions(false, {routeName: 'EditSchedule', props: {scheduleId: responseJson.id}});
                return dispatch({type: types.CREATE_SCHEDULE, response: responseJson});
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
                dispatch({type: types.CREATE_WORKOUT, response: responseJson});
                return asyncActions(false, {routeName: 'EditWorkout', props: {workoutId: responseJson.id}});
            })
            .catch((error) => {
                asyncActions(false);
                console.log(error);
            }).done();
    }
}


export function addEditWorkoutDay(data, asyncActions = null) {
    if (asyncActions) {
        asyncActions(true);
    }
    let url = `${API_ENDPOINT}training/workout/days/`;
    let method = 'POST';
    if (data.id) {
        url = `${API_ENDPOINT}training/workout/day/${data.id}/`;
        method = 'PATCH';
    }
    return (dispatch, getState) => {
        return fetch(url, fetchData(method, JSON.stringify(data), getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                if (method == 'POST')
                    dispatch({type: types.CREATE_WORKOUT_DAY, response: responseJson});
                else
                    dispatch({type: types.UPDATE_WORKOUT_DAY, response: responseJson});

                if (asyncActions) {
                    return asyncActions(false, {
                        routeName: 'WorkoutDayDetail',
                        props: {workout_day_id: responseJson.id},
                        state: responseJson
                    });
                }
            })
            .catch((error) => {
                if (asyncActions) {
                    asyncActions(false);
                }
                console.log(error);
            }).done();
    }
}

export function addEditExercise(data, asyncActions = null) {
    if (asyncActions) {
        asyncActions(true);
    }
    let url = `${API_ENDPOINT}training/workout/sets/`;
    let method = 'POST';
    if (data.id) {
        url = `${API_ENDPOINT}training/workout/set/${data.id}/`;
        method = 'PATCH';
    }
    return (dispatch, getState) => {
        return fetch(url, fetchData(method, JSON.stringify(data), getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                if (method == 'POST')
                    return dispatch({type: types.ADD_EXERCISE, response: responseJson});
                else
                    return dispatch({type: types.EDIT_EXERCISE, response: responseJson});
            })
            .catch((error) => {
                if (asyncActions) {
                    asyncActions(false);
                }
                console.log(error);
            }).done();
    }
}

export function deleteSet(id) {
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/workout/set/${id}/`,
            fetchData('DELETE', null, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.DELETE_SET, response: responseJson});
            })
            .catch((error) => {
                console.log(error);
            }).done();
    }
}
