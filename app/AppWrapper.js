import React from 'react';
const CreateClass = require('create-react-class');
import {AsyncStorage} from 'react-native';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import codePush from "react-native-code-push";

import configureStore from './stores/configureStore';

import App from './App';

const store = configureStore();


persistStore(store, {storage: AsyncStorage});


const AppWrapper = CreateClass({
    componentDidMount() {
        codePush.notifyAppReady();
    },

    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
});

export default codePush({
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    installMode: codePush.InstallMode.ON_NEXT_SUSPEND
})(AppWrapper);
