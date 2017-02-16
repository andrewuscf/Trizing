import _ from 'lodash';
import * as constants from '../actions/actionTypes';


const initialState = {
    Clients: [],
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
            const index = _.findIndex(state.Clients, {'user': action.clientId });
            return {
                ...state,
                Clients: state.Clients.slice(0, index).concat(state.Clients.slice(index + 1))
            };


        default:
            return state
    }
}