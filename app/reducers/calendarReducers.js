import _ from 'lodash';
import * as constants from '../actions/actionTypes';


const initialState = {
    Events: [],
    EventsNext: null,
    Refreshing: false,
};

export default function calendarReducers(state = initialState, action = null) {
    switch (action.type) {

        case constants.GET_EVENTS:
            return {
                ...state,
                Events: (action.refresh) ? action.response.results : state.Events.concat(action.response.results),
                EventsNext: action.response.next,
                Refreshing: false
            };

        case constants.REMOVE_TOKEN:
            return initialState;


        default:
            return state
    }
}