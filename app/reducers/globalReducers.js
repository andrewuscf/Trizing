import * as constants from '../actions/actionTypes';
import _ from 'lodash';
import React from 'react';


const initialState = {
    AppIsReady: false,
    RequestUser: null,
    UserToken: '',
    Route: null,
    Refreshing: false,
    Error: null,
    Questionnaires: [],
    QuestionnairesNext: null,
    Schedules: [],
    SchedulesNext: null,
    tabBarOpen: true
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
                Error: null
            };

        case constants.REMOVE_TOKEN:
            return initialState;

        case constants.SET_ACTIVE_ROUTE:
            return {
                ...state,
                Route: action.routeName
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

        case constants.LOAD_SCHEDULES:
            return {
                ...state,
                Schedules: (action.refresh) ? action.response.results : state.Schedules.concat(action.response.results),
                Refreshing: false
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


        case constants.CREATE_SCHEDULE:
            return {
                ...state,
                Schedules: [
                    action.response,
                    ...state.Schedules
                ]
            };


        case constants.ADD_EXERCISE:
            return {
                ...state,
                Schedules: state.Schedules.map(schedule =>
                    (schedule.id === action.response.id) ? action.response : schedule
                )
            };

        case constants.EDIT_EXERCISE:
            return {
                ...state,
                Schedules: state.Schedules.map(schedule =>
                    (schedule.id === action.response.id) ? action.response : schedule
                )
            };

        case constants.DELETE_SET:
            return {
                ...state,
                Schedules: state.Schedules.map(schedule =>
                    (schedule.id === action.response.id) ? action.response : schedule
                )
            };

        case constants.CREATE_WORKOUT:
            return {
                ...state,
                Schedules: state.Schedules.map(schedule =>
                    (schedule.id === action.response.schedule) ?
                        {
                            ...schedule,
                            workouts: [
                                ...schedule.workouts,
                                action.response
                            ]
                        } : schedule
                )
            };

        case constants.CREATE_WORKOUT_DAY:
            const thisSchedule = _.find(state.Schedules, {workouts: [{id: action.response.workout}]});
            const thisWorkout = _.find(thisSchedule.workouts, {id: action.response.workout});
            return {
                ...state,
                Schedules: state.Schedules.map(schedule =>
                    (schedule.id === thisSchedule.id) ?
                        {
                            ...schedule,
                            workouts: schedule.workouts.map(workout =>
                                (workout.id === thisWorkout.id) ? {
                                        ...workout,
                                        workout_days: [
                                            ...workout.workout_days,
                                            action.response
                                        ]
                                    }
                                    : workout
                            )
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

        case constants.TOGGLE_TAB_BAR:
            return {
                ...state,
                tabBarOpen: action.result
            }

        // case constants.UPDATE_WORKOUT_DAY:
        //     return {
        //         ...state,
        //         Workouts: state.Workouts.map(workout =>
        //             (workout.id === action.response.workout) ?
        //                 {
        //                     ...workout,
        //                     workout_days: workout.workout_days.map(workout_day =>
        //                         (workout_day.id === action.response.id) ?
        //                             {
        //                                 ...action.response
        //                             } :
        //                             workout_day
        //                     )
        //                 } :
        //                 workout
        //         )
        //     };


        default:
            return state
    }
}