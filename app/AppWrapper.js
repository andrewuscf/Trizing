import React from 'react';
import {AsyncStorage} from 'react-native';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import codePush from "react-native-code-push";

import configureStore from './stores/configureStore';

import App from './App';

const store = configureStore();


persistStore(store, {storage: AsyncStorage});


const AppWrapper = React.createClass({
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
});

export default codePush(AppWrapper);
