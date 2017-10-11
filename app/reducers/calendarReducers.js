import * as constants from '../actions/actionTypes';


const initialState = {
    Events: [],
    EventsNext: null,
    Refreshing: false,
    CalendarIsLoading: true,
};

export default function calendarReducers(state = initialState, action = null) {
    switch (action.type) {

        case constants.GET_EVENTS:
            return {
                ...state,
                Events: (action.refresh) ? action.response.results : state.Events.concat(action.response.results),
                EventsNext: action.response.next,
                Refreshing: false,
                CalendarIsLoading: false,
            };

        case constants.ADD_EVENT:
            return {
                ...state,
                Events: [
                    action.response,
                    ...state.Events
                ],
                CalendarIsLoading: false,
            };

        case constants.CLEAR_STATE:
            return initialState;


        default:
            return state
    }
}