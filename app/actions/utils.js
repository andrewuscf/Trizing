'use strict';
import {Platform, PixelRatio} from 'react-native';
import {NavigationActions} from 'react-navigation';

export const SITE = 'https://trainerbase-staging.herokuapp.com/';
// export const SITE = 'http://localhost:8000/';

export const API_ENDPOINT = `${SITE}api/v1/`;

import {REFRESHING} from './actionTypes';


export function stripeKey() {
    if (SITE.indexOf('localhost') !== -1 || SITE.indexOf('staging') !== -1) {
        return 'pk_test_iorOuqkaw8Dd09Q6awDC7wUo';
    } else {
        return 'pk_live_kZftaa4bqEWd5s2qQ9MK2ndD';
    }
}


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

export function setHeaders(token = null, headers = null) {
    let newHeader = headers ? headers : {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    if (token) {
        newHeader['Authorization'] = `Token ${token}`;
    }

    return newHeader;
}

export function checkStatus(response) {
    const status = response.respInfo ? response.respInfo.status : response.status;
    if (status === 204) {
        return {deleted: true}
    } else if (status >= 200 && status < 300) {
        return response.json();
    } else {
        console.log(response)
        let error = new Error();
        error.response = response;
        error.status = status;
        console.log(status)
        console.log(response.json())
        error.errors = response.json();
        throw error;
    }
}

export function refreshPage() {
    return {type: REFRESHING}
}

export function isATrainer(userType) {
    return userType === 1;
}

export function convertSkill(skill) {
    if (skill === 1) {
        return 'Beginner'
    } else if (skill === 2){
        return 'Intermediate'
    } else if (skill === 3) {
        return 'Advanced'
    }
    return null
}

export function getFontSize(size = 22) {
    // return Math.floor(size * 0.7);
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(size))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(size)) - 2
    }
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

export function resetNav(routeName, params = '') {
    return NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({routeName})],
        params: params
    });
}

export function calCalories(fats = 0, carbs = 0, protein = 0) {
    return ((9 * fats) + (4 * protein) + (4 * carbs)).toFixed(0);
}

export function letterSpacing(string, count = 1) {
    return string.split('').join('\u200A'.repeat(count));
}