import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ChatActions from '../actions/chatActions';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

const Chat = React.createClass({

    componentDidMount() {
        if (!this.props.ChatRooms.length) {
            this.getNeeded();
        }
        // this.getToken();
    },

    getNeeded(refresh = false) {
        // If request user is a trainer.
        if (this.props.RequestUser.type == 1) {
            // this.props.actions.getClients(refresh);
        }
    },

    _refresh() {
        this.getNeeded(true);
    },

    onEndReached() {
        console.log('End reach')
    },

    _redirect(routeName, props = null) {
        this.props.navigator.push(getRoute(routeName, props));
    },


    render() {
        return (
            <View><Text>Chat</Text></View>
        )
    }
});


const styles = StyleSheet.create({

});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Refreshing: state.Global.Refreshing,
        ...state.Chat
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ChatActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Chat);
