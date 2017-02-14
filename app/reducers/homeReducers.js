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
            };


        default:
            return state
    }
}