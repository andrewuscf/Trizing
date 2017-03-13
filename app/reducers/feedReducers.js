import _ from 'lodash';
import * as constants from '../actions/actionTypes';


const initialState = {
    Posts: [],
    PostsNext: null,
    Refreshing: false,
};

export default function feedReducers(state = initialState, action = null) {
    switch (action.type) {
        case constants.GET_FEED:
            return {
                ...state,
                Posts: action.refresh ? action.response.results : state.Posts.concat(action.response.results),
                PostsNext: action.response.next,
                Refreshing: false
            };


        default:
            return state
    }
}