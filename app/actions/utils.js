'use strict';

export const SITE = 'http://localhost:8000/';

export const API_ENDPOINT = `${SITE}api/v1/`;

import {REFRESHING} from './actionTypes';


export function fetchData(method, body = null, token = null, headers = null, getData = null) {
    let data = {
        method: method,
        headers: headers ? headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if (token) {
        data.headers['Authorization'] = `Token ${token}`;
    }

    if (body) {
        data = Object.assign(data, {body: body});
    }

    if (getData) {
        data = Object.assign(data, {data: getData});
    }

    return data;
}

export function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.json();
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

export function refreshPage() {
    return {type: REFRESHING}
}

export function getFontSize(size = 22) {
    return Math.floor(size * 0.7);
}

export function trimToLength(text, m) {
    return (text.length > m)
        ? text.substring(0, m).split(" ").slice(0, -1).join(" ") + "..."
        : text;
}

export function trunc(text, m) {
    return (text.length > m)
        ? text.substring(0, m) + "..."
        : text;
}


export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
