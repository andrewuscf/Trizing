import _ from 'lodash';
import * as constants from '../actions/actionTypes';


const initialState = {
    Clients: [],
    Notifications: [],
    NotificationsNext: null,
    Refreshing: false,
};

export default function homeReducers(state = initialState, action = null) {
    switch (action.type) {
        case constants.LOAD_CLIENTS:
            return {
                ...state,
                Clients: (action.refresh) ? action.response.results : state.Clients.concat(action.response.results),
                Refreshing: false
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
                Notifications: (action.refresh) ? action.response.results : state.Notifications.concat(action.response.results),
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