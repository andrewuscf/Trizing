import { has, mapValues, isPlainObject } from 'lodash';
import { castThunk } from '../actions/actionHelpers';


const chainMiddleware = rawMappings => {
    const mappings = mapValues(rawMappings, castThunk);

    return ({ dispatch }) => next => async action => {
        if (isPlainObject(action) && has(mappings, action.type)) {
            const res = await next(action);
            await dispatch(mappings[action.type]());
            return res;
        } else {
            return next(action);
        }
    };
};


export default chainMiddleware;