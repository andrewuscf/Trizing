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

        case constants.CREATE_POST:
            return {
                ...state,
                Posts: [
                    action.response,
                    ...state.Posts
                ],
                Refreshing: false
            };

        case constants.LIKE:
            return {
                ...state,
                Posts: state.Posts.map(post =>
                    (post.id == action.like.post) ?
                        {
                            ...post,
                            liked_by: [...post.liked_by, action.like.user.id]
                        } :
                        post
                ),
            };

        case constants.UNLIKE:
            let newFeed = state.Posts;
            if (state.Posts.length) {
                const index = _.findIndex(state.Posts, {'id': action.like.post});
                const userIndex = state.Posts[index].liked_by.indexOf(action.like.user.id);
                newFeed = state.Posts.map(post =>
                    (post.id === action.like.post) ?
                        {
                            ...post,
                            liked_by: post.liked_by.slice(0, userIndex).concat(post.liked_by.slice(userIndex + 1))
                        } :
                        post
                );
            }
            return {
                ...state,
                Posts: newFeed
            };


        default:
            return state
    }
}