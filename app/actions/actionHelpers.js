import { isFunction } from 'lodash';


export const castThunk = fn => (...args) => {
    const obj = fn(...args);
    return !isFunction(obj)
        ? dispatch => dispatch(obj)
        : obj;
};


export const sequence = actions => (...args) => {
    const thunks = actions
        .map(castThunk)
        .map(fn => fn(...args));

    return (...storeArgs) => {
        let p = Promise.resolve();
        for (const fn of thunks) p = p.then(() => fn(...storeArgs));
        return p;
    };
};