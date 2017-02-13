import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    ScrollView
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import FCM from 'react-native-fcm';
// import Icon from 'react-native-vector-icons/FontAwesome';

// import * as HomeActions from '../actions/HomeActions';

import {getRoute} from '../routes';
import GlobalStyle from './globalStyle';


const Home = React.createClass({

    componentDidMount() {
        // if (!this.props.WorkRequests.length && !this.props.Jobs.length) {
        //     this.getNeeded();
        // }
        // this.getToken();
    },

    // getNeeded(refresh = false) {
    //     if (this.props.RequestUser.type == 'Client') {
    //         this.props.actions.getWorkRequests(refresh);
    //     } else {
    //         this.props.actions.getJobs(refresh);
    //     }
    // },

    // getToken() {
    //     const self = this;
    //     FCM.requestPermissions(); // for iOS
    //     FCM.getFCMToken().then(token => {
    //         if (token) self.props.actions.setDeviceForNotification(token);
    //     });
    // },


    _refresh() {
        // this.getNeeded(true);
    },

    onEndReached() {
        console.log('End reach')
    },

    _redirect(routeName, props = null) {
        this.props.navigator.push(getRoute(routeName, props));
    },


    render() {
        return <View style={GlobalStyle.container}><Text>Home</Text></View>
    }
});


const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        // ...state.Home
    };
};

// const dispatchToProps = (dispatch) => {
//     return {
//         actions: bindActionCreators(HomeActions, dispatch)
//     }
// };

export default connect(stateToProps, null)(Home);
