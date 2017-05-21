import React, {Component} from 'react';
import {View, ActivityIndicator, StyleSheet, AsyncStorage} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as GlobalActions from '../actions/globalActions';

import {resetNav} from '../actions/utils';

const SplashScreen = React.createClass({

    componentDidMount () {
        // this.props.removeToken();
        this.props.initializeApp();
    },

    componentDidUpdate () {
        if (this.props.AppIsReady) {
            if (this.props.RequestUser && this.props.RequestUser.profile.completed) {
                this._navigateTo('Main')
            } else if (this.props.RequestUser && !this.props.RequestUser.profile.completed) {
                this._navigateTo('EditProfile')
            } else if (!this.props.UserToken) {
                this._navigateTo('Login')
            }
        }
    },

    _navigateTo(routeName) {
        const actionToDispatch = resetNav(routeName);
        this.props.navigation.dispatch(actionToDispatch)
    },
    render() {
        return (
            <View style={styles.page}>
                <ActivityIndicator animating={true} size='large'/>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const stateToProps = (state) => {
    return {
        ...state.Global,
    };
};

const dispatchToProps = (dispatch) => {
    return {
        removeToken: bindActionCreators(GlobalActions.removeToken, dispatch),
        setTokenInRedux: bindActionCreators(GlobalActions.setTokenInRedux, dispatch),
        initializeApp: bindActionCreators(GlobalActions.initializeApp, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(SplashScreen);

//
// export default SplashScreen;
