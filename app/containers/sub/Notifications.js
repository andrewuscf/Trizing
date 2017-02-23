import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    RefreshControl,
    TouchableOpacity,
    ListView
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {fetchData, API_ENDPOINT, validateEmail} from '../../actions/utils';

import * as GlobalActions from '../../actions/globalActions';

import GlobalStyle from '../globalStyle';


const Notifications = React.createClass({

    render() {
        return (
            <View><Text>Notifications</Text></View>
        )
    }
});

const styles = StyleSheet.create({});


const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Refreshing: state.Global.Refreshing,
        ...state.Home
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Notifications);