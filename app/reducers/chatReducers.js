import _ from 'lodash';
import * as constants from '../actions/actionTypes';


const initialState = {
    Rooms: [],
    Refreshing: false,
    RoomsNext: null
};

export default function AppReducers(state = initialState, action = null) {
    switch (action.type) {
        case constants.LOAD_ROOMS:
            return {
                ...state,
                Rooms: (action.refresh) ? action.response.results :state.Rooms.concat(action.response.results),
                RoomsNext: action.response.next,
                Refreshing: false
            };

        case constants.SEND_MESSAGE:
            return {
                ...state,
                Rooms: state.Rooms.map(room =>
                    (parseInt(room.id) == action.response.room) ?
                        {
                            ...room,
                            last_message: action.response
                        } :
                        room
                )
            };

        default:
            return state
    }
}