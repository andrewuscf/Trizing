import _ from 'lodash';
import * as constants from '../actions/actionTypes';
import moment from 'moment';


const initialState = {
    Clients: [],
    Notifications: [],
    NotificationsNext: null,
    ActiveData: null,
    Refreshing: false,
    HomeIsLoading: true,
};

export default function homeReducers(state = initialState, action = null) {
    switch (action.type) {
        case constants.LOAD_CLIENTS:
            return {
                ...state,
                Clients: (action.refresh) ? action.response.results : state.Clients.concat(action.response.results),
                Refreshing: false,
                HomeIsLoading: false,
            };

        case constants.DELETE_CLIENT:
            const index = _.findIndex(state.Clients, {'user': action.clientId});
            return {
                ...state,
                Clients: state.Clients.slice(0, index).concat(state.Clients.slice(index + 1))
            };

        case constants.GET_NOTIFICATIONS:
            return {
                ...state,
                Notifications: (action.refresh) ? action.response.results
                    : _.uniqBy(state.Notifications.concat(action.response.results), 'id'),
                NotificationsNext: action.response.next,
                Refreshing: false
            };

        case constants.READ_NOTIFICATION:
            return {
                ...state,
                Notifications: state.Notifications.map(notification =>
                    (notification.id === action.noteId) ?
                        {
                            ...notification,
                            unread: false
                        } :
                        notification
                )
            };

        case constants.LOAD_ACTIVE_DATA:
            return {
                ...state,
                ActiveData: action.response,
                Refreshing: false,
                HomeIsLoading: false,
            };

        case constants.CREATE_WORKOUT_LOG:
            return {
                ...state,
                ActiveData: {
                    ...state.ActiveData,
                    training_day: {
                        ...state.ActiveData.training_day,
                        logged_today: moment().isSame(moment.utc(action.response.date).local(), 'day')
                    }

                },
            };


        case constants.REMOVE_TOKEN:
            return initialState;

        //
        // case constants.SEND_REQUEST:
        //     const index = _.findIndex(state.Clients, {'user': action.clientId });
        //     return {
        //         ...state,
        //         Clients: state.Clients.slice(0, index).concat(state.Clients.slice(index + 1))
        //     };


        default:
            return state
    }
}