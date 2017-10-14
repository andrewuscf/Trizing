import _ from 'lodash';
import * as constants from '../actions/actionTypes';


const initialState = {
    Rooms: [],
    Team: [],
    Refreshing: false,
    RoomsNext: null,
    ChatIsLoading: true,
};

export default function chatReducers(state = initialState, action = null) {
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
                Rooms: _.orderBy(state.Rooms.map(chat_room => {
                        const refLabel = (!Array.isArray(action.message)) ?
                            action.message.room_label :
                            action.message.length ? action.message[0].room_label : null;

                        if (chat_room.label === refLabel) {
                            const messages = chat_room.messages && chat_room.messages.length
                                ? (!Array.isArray(action.message)) ? [action.message, ...chat_room.messages.slice(0, 9)]
                                    : action.message.slice(action.message.length - 10)
                                :
                                (!Array.isArray(action.message)) ? [action.message] : action.message.slice( action.message.length - 10);
                            return {
                                ...chat_room,
                                last_message: (!Array.isArray(action.message)) ? action.message : chat_room.last_message,
                                messages: _.uniqBy(messages, 'id')
                            }
                        }
                        return chat_room
                    }
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


        case constants.CLEAR_STATE:
            return initialState;

        default:
            return state
    }
}