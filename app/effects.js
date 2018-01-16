import {fromPairs} from 'lodash';
import {SET_TOKEN, REMOVE_TOKEN, API_ERROR} from './actions/actionTypes';
import {sequence} from './actions/actionHelpers';

import {getUser, clearState, clearError} from './actions/globalActions';


export default fromPairs([
    [SET_TOKEN, sequence([getUser])],
    [REMOVE_TOKEN, sequence([clearState])],
    [API_ERROR, sequence([clearError])]
]);