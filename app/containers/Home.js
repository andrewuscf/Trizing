import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import FCM from 'react-native-fcm';
// import Icon from 'react-native-vector-icons/FontAwesome';

import * as HomeActions from '../actions/homeActions';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

import PeopleBar from '../components/PeopleBar';


const Home = React.createClass({

    componentDidMount() {
        if (!this.props.Clients.length) {
            this.getNeeded();
        }
        // this.getToken();
    },

    getNeeded(refresh = false) {
        if (this.props.RequestUser.type == 1) {
            this.props.actions.getClients(refresh);
        }
    },

    // getToken() {
    //     const self = this;
    //     FCM.requestPermissions(); // for iOS
    //     FCM.getFCMToken().then(token => {
    //         if (token) self.props.actions.setDeviceForNotification(token);
    //     });
    // },


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
        const user = this.props.RequestUser;
        const isTrainer = user.type == 1;
        let content = null;
        if (isTrainer) {
            content = (
                <View>
                    <PeopleBar navigator={this.props.navigator} people={this.props.Clients}/>
                    <TouchableOpacity onPress={this._redirect.bind(null, 'ManageClients', null)}
                                      style={[styles.addClientSection, GlobalStyle.simpleBottomBorder]}>
                        <Text style={styles.addClientsText}>Manage Clients</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            content = <Text>Client</Text>;
        }
        return (
            <View style={GlobalStyle.container}>
                <ScrollView ref='home_scroll'
                            refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}
                            style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}>
                    <View style={styles.topCard}>
                        <View style={[styles.welcome, GlobalStyle.simpleBottomBorder]}>
                            <Text style={styles.welcomeMessage}>Hello, {user.profile.first_name}</Text>
                        </View>
                    </View>
                    {content}
                </ScrollView>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    scrollView: {
        // backgroundColor: '#edebe6'
    },
    contentContainerStyle: {},
    topCard: {
        elevation: 8,
    },
    welcome: {
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20
    },
    welcomeMessage: {
        fontSize: getFontSize(30),
        color: '#494949',
        fontFamily: 'OpenSans-Semibold'
    },
    addClientSection: {
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
    },
    addClientsText: {
        fontSize: getFontSize(18),
        color: '#b1aea5',
        fontFamily: 'OpenSans-Semibold',
        margin: 10
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Refreshing: state.Global.Refreshing,
        ...state.Home
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(HomeActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Home);
