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

import * as FeedActions from '../actions/feedActions';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

const Feed = React.createClass({

    componentDidMount() {
        if (!this.props.Posts.length) {
            this.getNeeded();
        }
        // this.getToken();
    },

    getNeeded(refresh = false) {
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
            <View><Text>Feed</Text></View>
        )
    }
});


const styles = StyleSheet.create({

});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Refreshing: state.Global.Refreshing,
        ...state.Feed
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(FeedActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Feed);
