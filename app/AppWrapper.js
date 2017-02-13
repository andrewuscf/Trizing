import React from 'react';
import {Provider} from 'react-redux';
import configureStore from './stores/configureStore';

import App from './App';

const store = configureStore();


const AppWrapper = React.createClass({
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
});

export default AppWrapper;
