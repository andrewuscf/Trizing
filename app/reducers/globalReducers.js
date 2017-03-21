import * as constants from '../actions/actionTypes';
import _ from 'lodash';
import React from 'react';
import moment from 'moment';


const initialState = {
    RequestUser: null,
    UserToken: '',
    Route: null,
    Refreshing: false,
    Error: null,
    Questionnaires: [],
    QuestionnairesNext: null,
    Workouts: [],
    WorkoutsNext: null,
};

export default function AppReducers(state = initialState, action = null) {
    switch (action.type) {
        case constants.SET_TOKEN:
            return {
                ...state,
                UserToken: action.token,
                Error: null
            };

        case constants.REMOVE_TOKEN:
            return {};

        case constants.SET_ACTIVE_ROUTE:
            return {
                ...state,
                Route: action.routeName
            };

        case constants.LOAD_REQUEST_USER:
            return {
                ...state,
                RequestUser: action.request_user
            };

        case constants.REFRESHING:
            return {
                ...state,
                Refreshing: true
            };

        case constants.API_ERROR:
            return {
                ...state,
                Error: action.error
            };

        case constants.REGISTER_USER:
            return {
                ...state,
                Error: action.message
            };

        case constants.CLEAR_API_ERROR:
            return {
                ...state,
                Error: null
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

        case constants.LOAD_WORKOUTS:
            return {
                ...state,
                Workouts: (action.refresh) ? action.response.results : state.Workouts.concat(action.response.results),
                Refreshing: false
            };

        case constants.CREATE_WORKOUT:
            return {
                ...state,
                Workouts: [
                    action.response,
                    ...state.Workouts
                ]
            };

        case constants.CREATE_WORKOUT_DAY:
            return {
                ...state,
                Workouts: state.Workouts.map(workout =>
                    (workout.id === action.response.workout) ?
                        {
                            ...workout,
                            workout_days: [
                                ...workout.workout_days,
                                action.response
                            ]
                        } :
                        workout
                )
            };

        case constants.UPDATE_WORKOUT_DAY:
            return {
                ...state,
                Workouts: state.Workouts.map(workout =>
                    (workout.id === action.response.workout) ?
                        {
                            ...workout,
                            workout_days: workout.workout_days.map(workout_day =>
                                (workout_day.id === action.response.id) ?
                                    {
                                        ...action.response
                                    } :
                                    workout_day
                            )
                        } :
                        workout
                )
            };

        case constants.ADD_EXERCISE:
            return {
                ...state,
                Workouts: state.Workouts.map(workout => (workout.id === action.response.id) ? action.response: workout
                )
            };

        case constants.EDIT_EXERCISE:
            return state;
            // return {
            //     ...state,
            //     Workouts: state.Workouts.map(workout => (workout.id === action.response.id) ? action.response: workout
            //     )
            // };

        default:
            return state
    }
}