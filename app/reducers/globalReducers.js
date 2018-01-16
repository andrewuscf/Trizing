import * as constants from '../actions/actionTypes';
import _ from 'lodash';
import React from 'react';


const initialState = {
    AppIsReady: false,
    RequestUser: null,
    UserToken: '',
    Refreshing: false,
    Questionnaires: [],
    QuestionnairesNext: null,
    Schedules: [],
    SchedulesNext: null,
    SchedulesLoading: true,
    Error: null
};

export default function AppReducers(state = initialState, action = null) {
    switch (action.type) {
        case constants.NOT_LOGGED_IN:
            return {
                ...state,
                AppIsReady: true,
            };


        case constants.SET_TOKEN:
            return {
                ...state,
                UserToken: action.token,
            };

        case constants.REMOVE_TOKEN:
            return {
                ...state,
                UserToken: null
            };

        case constants.CLEAR_STATE:
            return initialState;

        case constants.CLEAR_ERROR:
            return {
                ...state,
                Error: null,
            };

        case constants.LOAD_REQUEST_USER:
            return {
                ...state,
                RequestUser: action.request_user,
                AppIsReady: true,
                Refreshing: false
            };

        case constants.REFRESHING:
            return {
                ...state,
                Refreshing: true
            };

        case constants.UPDATE_USER:
            return {
                ...state,
                RequestUser: action.request_user
            };

        case constants.UPDATE_PROFILE:
            return {
                ...state,
                RequestUser: {
                    ...state.RequestUser,
                    profile: action.profile
                }
            };

        case constants.GET_QUESTIONNAIRES:
            return {
                ...state,
                Questionnaires: action.refresh ? action.response.results : state.Questionnaires.concat(action.response.results),
                QuestionnairesNext: action.response.next,
                Refreshing: false
            };

        case constants.CREATE_QUESTIONNAIRE:
            return {
                ...state,
                Questionnaires: [
                    action.response,
                    ...state.Questionnaires
                ]
            };

        case constants.LOAD_SCHEDULES:
            return {
                ...state,
                Schedules: (action.refresh) ? action.response.results : state.Schedules.concat(action.response.results),
                Refreshing: false,
                SchedulesLoading: false
            };

        case constants.ADD_SCHEDULES:
            return {
                ...state,
                Schedules: _.uniqBy(state.Schedules.concat(action.schedules), 'id'),
            };

        case constants.REMOVE_SCHEDULE:
            const index = _.findIndex(state.Schedules, {id: action.schedule_id});
            return {
                ...state,
                Schedules: state.Schedules.slice(0, index).concat(state.Schedules.slice(index + 1))
            };

        case constants.DELETE_WORKOUT:
            return {
                ...state,
                Schedules: state.Schedules.map(schedule => {
                    if (schedule.id === action.scheduleId) {
                        const workoutIndex = _.findIndex(schedule.workouts, {id: action.workoutId});
                        return {
                            ...schedule,
                            workouts: schedule.workouts.slice(0, workoutIndex).concat(schedule.workouts.slice(workoutIndex + 1))
                        }
                    }
                    return schedule
                })
            };


        case constants.CREATE_SCHEDULE:
            return {
                ...state,
                Schedules: [
                    action.response,
                    ...state.Schedules
                ]
            };


        case constants.CREATE_WORKOUT:
            return {
                ...state,
                Schedules: state.Schedules.map(schedule =>
                    (schedule.id === action.response.program) ?
                        {
                            ...schedule,
                            workouts: [
                                ...schedule.workouts,
                                action.response
                            ]
                        } : schedule
                )
            };

        case constants.NEW_NOTIFICATION:
            return Object.assign({}, state, {
                RequestUser: state.RequestUser ? {
                    ...state.RequestUser,
                    unread_notifications: true
                } : null
            });

        case constants.API_ERROR:
            return {
                ...state,
                Error: action.error
            };

        default:
            return state
    }
}