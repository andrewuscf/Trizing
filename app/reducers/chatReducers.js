import _ from 'lodash';
import * as constants from '../actions/actionTypes';


const initialState = {
    Rooms: [],
    Team: [],
    Refreshing: false,
    RoomsNext: null,
    ChatIsLoading: true,
};

export default function AppReducers(state = initialState, action = null) {
    switch (action.type) {
        case constants.LOAD_ROOMS:
            const rooms = (action.refresh) ? action.response.results : [
                ...state.Rooms,
                ...action.response.results
            ];
            return {
                ...state,
                Rooms: _.uniqBy(rooms, 'id'),
                RoomsNext: action.response.next,
                Refreshing: false,
                ChatIsLoading: false,
            };

        case constants.SEND_MESSAGE:
            return {
                ...state,
                Rooms: _.orderBy(state.Rooms.map(chat_room =>
                    (chat_room.label === action.message.room_label) ?
                        {
                            ...chat_room,
                            last_message: action.message
                        } :
                        chat_room
                ), function (chat_room) {
                    if (chat_room.last_message) {
                        return chat_room.last_message.createdAt
                    }
                    return chat_room.createdAt
                }, ['desc']),
                PushedMessage: action.pushNotification ? action.message : null
            };


        case constants.CREATE_CHAT_ROOM:
            const index = _.findIndex(state.Rooms, {label: action.response.label});
            return {
                ...state,
                Rooms: index != -1 ? state.Rooms : [
                    action.response,
                    ...state.Rooms
                ]
            };

        case constants.GET_TEAM:
            return {
                ...state,
                Team: (action.refresh) ? action.response.results : state.Team.concat(action.response.results),
            };


        case constants.REMOVE_TOKEN:
            return initialState;

        default:
            return state
    }
}