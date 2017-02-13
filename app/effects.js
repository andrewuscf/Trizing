import { fromPairs } from 'lodash';
import { SET_TOKEN } from './actions/actionTypes';
import { sequence } from './actions/actionHelpers';

import { getUser } from './actions/globalActions';


export default fromPairs([
    [SET_TOKEN, sequence([getUser])],
]);