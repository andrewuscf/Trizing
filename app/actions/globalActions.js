'use strict';
import * as types from './actionTypes';
import {fetchData, API_ENDPOINT, refreshPage, SITE, checkStatus, setHeaders} from './utils';
import {AsyncStorage, Platform, Alert} from 'react-native';
import {LoginManager} from 'react-native-fbsdk';
import momentTz from 'moment-timezone';
import _ from 'lodash';
import {ImageCache} from "react-native-img-cache";
import RNFetchBlob from 'react-native-fetch-blob';
import {purgeStoredState} from 'redux-persist';


import {getClients, getActiveData} from './homeActions';

export function alertMessage() {
    return (dispatch, getState) => {
        Alert.alert(
            getState().Global.Error ? getState().Global.Error.title : 'Request could not be performed.',
            getState().Global.Error ? getState().Global.Error.text : 'Please try again later.',
            [
                {text: 'OK'},
            ]
        );
    }
}


export function initializeApp() {
    return (dispatch, getState) => {
        AsyncStorage.getItem('USER_TOKEN', (err, result) => {
            if (result) {
                dispatch(setTokenInRedux(result));
            }
            else {
                return purgeStoredState({storage: AsyncStorage}).then(() => {
                    dispatch({type: types.NOT_LOGGED_IN});
                }).catch(() => {
                    console.log('purge of someReducer failed')
                });
            }
        });
    }
}

export function setTokenInRedux(token, FromAPI = false) {
    if (FromAPI) {
        AsyncStorage.setItem('USER_TOKEN', token)
    }
    return {type: types.SET_TOKEN, token: token}
}

export function removeToken() {
    return (dispatch) => {
        AsyncStorage.removeItem('USER_TOKEN');
        return dispatch({type: types.REMOVE_TOKEN}).then(() => purgeStoredState({storage: AsyncStorage}).then(() => {
                LoginManager.logOut();
            }).catch(() => {
                console.log('purge of someReducer failed')
            })
        );
    };
}

export function clearState() {
    return (dispatch) => {
        return dispatch({type: types.CLEAR_STATE}).then(() => purgeStoredState({storage: AsyncStorage}).then(() => {
                ImageCache.get().clear();
            }).catch(() => {
                console.log('purge of someReducer failed')
            })
        );
    };
}

export function login(data, asyncActions) {
    asyncActions(true);
    const body = JSON.stringify(data);
    return dispatch => {

        return RNFetchBlob.fetch('POST', `${API_ENDPOINT}auth/token/`,
            setHeaders(), body).then(checkStatus)
            .then((responseJson) => {
                if (responseJson.token) {
                    return dispatch(setTokenInRedux(responseJson.token, true));
                }
            }).catch((error) => {
                asyncActions(false);
                if (error.errors && error.errors.non_field_errors) {
                    asyncActions(false);
                    return dispatch({
                        type: types.API_ERROR, error: {
                            title: 'Incorrect Email or Password',
                            text: 'Please Try Again'
                        }
                    });
                }
                return dispatch({type: types.API_ERROR});
            });
    }
}


export function getUser(url = `${API_ENDPOINT}user/me/`, refresh = false) {
    return (dispatch, getState) => {
        if (refresh) {
            dispatch(refreshPage());
        }
        const timeZone = momentTz.tz.guess();
        if (timeZone) url += `?timezone=${timeZone}`;

        return RNFetchBlob.fetch('GET', url, setHeaders(getState().Global.UserToken)).then(checkStatus).then((responseJson) => {
            if (responseJson.detail)
                return dispatch(removeToken());
            return dispatch({type: types.LOAD_REQUEST_USER, request_user: responseJson});
        }).catch(() => {
            return dispatch({type: types.API_ERROR});
        });
    }
}


export function resetPassword(data, asyncActions) {
    asyncActions(true);
    return (dispatch, getState) => {
        const JSONData = JSON.stringify(data);

        return RNFetchBlob.fetch('POST', `${API_ENDPOINT}auth/password/reset/`,
            setHeaders(getState().Global.UserToken), JSONData).then(checkStatus)
            .then(() => {
                asyncActions(false);
                return dispatch({
                    type: types.API_ERROR, error: {
                        title: 'Reset password sent',
                        text: 'Please check your email for the reset password link'
                    }
                });
            }).catch(() => {
                asyncActions(false);
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function register(data, asyncActions) {
    asyncActions(true);
    return (dispatch, getState) => {
        let JSONData = JSON.stringify(data);


        return RNFetchBlob.fetch('POST', `${API_ENDPOINT}auth/register/`,
            setHeaders(getState().Global.UserToken), JSONData)
            .then(checkStatus)
            .then((responseJson) => {
                asyncActions(false);
                let message;
                if (responseJson.email) {
                    asyncActions(false, true);
                    message = {
                        title: 'Email verification required',
                        text: 'Please check your email in order to verify your account'
                    };
                }
                return dispatch({type: types.API_ERROR, error: message});
            }).catch((error) => {
                asyncActions(false);
                let message;
                if (error.errors) {
                    if (error.errors.email && error.errors.email.constructor === Array) {
                        message = {
                            title: error.errors.email[0],
                            text: 'Please use another email or log into your account.'
                        };
                    } else if (error.errors.username) {
                        if (error.errors.username.constructor === Array) {
                            message = {
                                title: error.errors.username[0],
                                text: 'Please use another username or log into your account.'
                            };
                        }
                    } else if (error.errors.password) {
                        if (error.errors.password.constructor === Array) {
                            message = {
                                title: error.errors.password[0],
                                text: error.errors.password[1]
                            };
                        }
                    }
                }
                return dispatch({type: types.API_ERROR, error: message});
            });

        // return fetch(`${API_ENDPOINT}auth/register/`, fetchData('POST', JSONDATA))
        //     .then(checkStatus)
        //     .then((responseJson) => {
        //         asyncActions(false);
        //         let message;
        //         console.log(responseJson)
        //         if (responseJson.email) {
        //
        //             asyncActions(false, true);
        //             message = {
        //                 title: 'Email verification required',
        //                 text: 'Please check your email in order to verify your account'
        //             };
        //             if (responseJson.email.constructor === Array)
        //                 message = {
        //                     title: responseJson.email[0],
        //                     text: 'Please use another email or log into your account.'
        //                 };
        //         }
        //         if (responseJson.username) {
        //             if (responseJson.username.constructor === Array)
        //                 message = {
        //                     title: responseJson.username[0],
        //                     text: 'Please use another username or log into your account.'
        //                 };
        //         }
        //         return dispatch({type: types.API_ERROR, error: message});
        //     }).catch((error) => {
        //         asyncActions(false);
        //         console.log(error);
        //         return dispatch({type: types.API_ERROR});
        //     });
    }
}

export function socialAuth(access_token) {
    return (dispatch, getState) => {
        return fetch(`${SITE}social/register/facebook/?access_token=${access_token}`, fetchData('GET', null))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.token)
                    return dispatch(setTokenInRedux(responseJson.token, true));
            }).catch(() => {
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function getNotifications(refresh = false, newNotifications = false) {
    let url = `${API_ENDPOINT}notifications/`;
    return (dispatch, getState) => {
        if (!refresh && getState().Global.NotificationsNext)
            url = getState().Global.NotificationsNext;
        return fetch(url, fetchData('GET', null, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (!responseJson.detail) {
                    if (newNotifications) {
                        _.each(responseJson.results, (notification) => {
                            if (notification.action.verb.toLowerCase().indexOf('joined') != -1
                                && getState().Global.RequestUser.type === 1) {
                                dispatch(getClients(true));
                                return false;
                            } else if (notification.action.action_object.macro_plan_days || notification.action.action_object.workouts) {
                                dispatch(getActiveData());
                                return false;
                            }
                        })
                    }
                    return dispatch({type: types.GET_NOTIFICATIONS, response: responseJson, refresh: refresh});
                }
            }).catch(() => {
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function getNewNotifications() {
    return (dispatch, getState) => {
        dispatch(getNotifications(true, true));
        return dispatch({type: types.NEW_NOTIFICATION});
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
            }).catch(() => {
                return dispatch({type: types.API_ERROR});
            });

    }
}

export function getQuestionnaires(refresh = false) {
    return (dispatch, getState) => {
        let url = `${API_ENDPOINT}training/questionnaires/`;
        if (!refresh && getState().Global.QuestionnairesNext)
            url = getState().Global.QuestionnairesNext;
        return fetch(url, fetchData('GET', null, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                return dispatch({type: types.GET_QUESTIONNAIRES, response: responseJson, refresh: refresh});
            }).catch(() => {
                return dispatch({type: types.API_ERROR});
            });
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
            }).catch(() => {
                asyncActions(false);
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function answerQuestionnaire(data, asyncActions) {
    let JSONDATA = JSON.stringify(data);
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/questionnaires/responses/`,
            fetchData('POST', JSONDATA, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                if (responseJson.id) asyncActions(true);
                return dispatch({type: types.CREATE_QUESTIONNAIRE, response: responseJson});
            }).catch(() => {
                asyncActions(false);
                return dispatch({type: types.API_ERROR});
            });
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
            }).catch((error) => {
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function createSchedule(data, asyncActions) {
    let JSONDATA = JSON.stringify(data);

    let url = `${API_ENDPOINT}training/schedules/`;
    let method = 'POST';
    if (data.id) {
        url = `${API_ENDPOINT}training/schedules/${data.id}/`;
        method = 'PATCH';
    }

    return (dispatch, getState) => {
        return fetch(url, fetchData(method, JSONDATA, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                if (responseJson.id) {
                    asyncActions(true, {routeName: 'EditSchedule', props: {scheduleId: responseJson.id}});
                } else {
                    asyncActions(false);
                }
                return dispatch({type: types.CREATE_SCHEDULE, response: responseJson});
            }).catch(() => {
                asyncActions(false);
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function addSchedules(data) {
    return (dispatch, getState) => {
        return dispatch({type: types.ADD_SCHEDULES, schedules: data});
    }
}

export function removeSchedule(schedule_id) {
    return (dispatch, getState) => {
        return dispatch({type: types.REMOVE_SCHEDULE, schedule_id: schedule_id});
    }
}

export function deleteSchedule(scheduleId, asyncActions) {
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/schedule/${scheduleId}/`,
            fetchData('DELETE', null, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                asyncActions({deleted: responseJson.deleted});
                return dispatch(removeSchedule(scheduleId));
            }).catch(() => {
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function createWorkout(data, asyncActions) {
    let JSONDATA = JSON.stringify(data);
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/workouts/`,
            fetchData('POST', JSONDATA, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                if (responseJson.id) {
                    dispatch({type: types.CREATE_WORKOUT, response: responseJson});
                    return asyncActions(true, {routeName: 'EditWorkout', props: {workout: responseJson}});
                }
                return asyncActions(false);
            }).catch(() => {
                asyncActions(false);
                return dispatch({type: types.API_ERROR});
            });
    }
}


export function addEditWorkoutDay(data, asyncActions = null) {
    let url = `${API_ENDPOINT}training/workout/days/`;
    let method = 'POST';
    if (data.id) {
        url = `${API_ENDPOINT}training/workout/day/${data.id}/`;
        method = 'PATCH';
    }
    return (dispatch, getState) => {
        return fetch(url, fetchData(method, JSON.stringify(data), getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {

                if (responseJson.id) {
                    return asyncActions(true, {
                        newTrainingDay: responseJson,
                        props: {workout_day: responseJson},
                    });
                } else {
                    return asyncActions(false)
                }
            }).catch(() => {
                asyncActions(false);
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function addEditExercise(data, asyncActions) {
    let url = `${API_ENDPOINT}training/workout/sets/`;
    let method = 'POST';
    if (data.id) {
        url = `${API_ENDPOINT}training/workout/set/${data.id}/`;
        method = 'PATCH';
    }
    return (dispatch, getState) => {
        return fetch(url, fetchData(method, JSON.stringify(data), getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {

                if (responseJson.id) {
                    asyncActions(true, responseJson);
                } else {
                    asyncActions(false);
                }
            }).catch(() => {
                asyncActions(false);
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function createSetGroup(data, asyncActions) {
    let url = `${API_ENDPOINT}training/workout/set_groups/`;
    let method = 'POST';
    return (dispatch, getState) => {
        return fetch(url, fetchData(method, JSON.stringify(data), getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {

                if (responseJson.id) {
                    asyncActions(true, responseJson);
                } else {
                    asyncActions(false);
                }
            }).catch(() => {
                asyncActions(false);
                return dispatch({type: types.API_ERROR});
            });
    }
}

// deleteSetGroup

export function deleteSetGroup(id, asyncActions) {
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/workout/set_group/${id}/`,
            fetchData('DELETE', null, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                if (responseJson.id) {
                    asyncActions(true, responseJson);
                } else {
                    asyncActions(false)
                }
            }).catch(() => {
                asyncActions(false);
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function deleteSet(id, asyncActions) {
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/workout/set/${id}/`,
            fetchData('DELETE', null, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                if (responseJson.id) {
                    asyncActions(true, responseJson);
                } else {
                    asyncActions(false)
                }
            }).catch(() => {
                asyncActions(false);
                return dispatch({type: types.API_ERROR});
            });
    }
}


export function deleteWorkout(scheduleId, workoutId) {
    return {type: types.DELETE_WORKOUT, scheduleId, workoutId}
}


// export function addEditMacroLog(data, asyncActions) {
//     let url = `${API_ENDPOINT}training/macros/logs/`;
//     let method = 'POST';
//     if (data.id) {
//         url = `${API_ENDPOINT}training/macro/log/${data.id}/`;
//         method = 'PATCH';
//     }
//     return (dispatch, getState) => {
//         return fetch(url, fetchData(method, JSON.stringify(data), getState().Global.UserToken)).then(checkStatus)
//             .then((responseJson) => {
//             console.log(responseJson)
//                 if (responseJson.id) asyncActions(true);
//                 else asyncActions(false);
//
//                 if (method === 'POST')
//                     return dispatch({type: types.CREATE_MACRO_LOG, response: responseJson});
//                 else
//                     return dispatch({type: types.EDIT_MACRO_LOG, response: responseJson});
//             }).catch((error) => asyncActions(false));
//     }
// }

export function logSets(data, asyncActions) {
    let JSONDATA = JSON.stringify(data);
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/workout/logs/`,
            fetchData('POST', JSONDATA, getState().Global.UserToken)).then(checkStatus)
            .then((responseJson) => {
                if (responseJson.length) {
                    asyncActions(true);
                    return dispatch({type: types.CREATE_WORKOUT_LOG, response: responseJson});
                } else {
                    asyncActions(false)
                }
            }).catch((e) => asyncActions(false));
    }
}


export function activateSchedule(programId) {
    let JSONDATA = JSON.stringify({program: programId});
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/activate/`,
            fetchData('PATCH', JSONDATA, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.id) {
                    return dispatch({type: types.LOAD_REQUEST_USER, request_user: responseJson});
                }
            }).catch(() => {
                return dispatch({type: types.API_ERROR});
            });
    }
}

export function activateMacroPlan(macroPlanId) {
    let JSONDATA = JSON.stringify({macro_plan: macroPlanId});
    return (dispatch, getState) => {
        return fetch(`${API_ENDPOINT}training/activate/`,
            fetchData('PATCH', JSONDATA, getState().Global.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.id) {
                    return dispatch({type: types.LOAD_REQUEST_USER, request_user: responseJson});
                }
            }).catch(() => {
                return dispatch({type: types.API_ERROR});
            });
    }
}