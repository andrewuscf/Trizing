import _ from 'lodash';
import * as constants from '../actions/actionTypes';


const initialState = {
    ChatRooms: [],
    Refreshing: false,
};

export default function chatReducers(state = initialState, action = null) {
    switch (action.type) {
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