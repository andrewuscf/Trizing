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
    QuestionnairesNext: null
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
                QuestionnairesNext: action.response.next
            };

        case constants.CREATE_QUESTIONNAIRE:
            return {
                ...state,
                Questionnaires: [
                    action.response,
                    ...state.Questionnaires
                ]
            };

        default:
            return state
    }
}