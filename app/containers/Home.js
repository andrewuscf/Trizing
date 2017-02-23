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
// import FCM from 'react-native-fcm';
// import Icon from 'react-native-vector-icons/FontAwesome';

import * as HomeActions from '../actions/homeActions';
import * as GlobalActions from '../actions/globalActions';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

import NotificationBox from '../components/NotificationBox';
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
        if (refresh) {
            this.props.getNotifications(refresh);
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
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(this.props.Notifications.slice(0, 4));
        return (
            <View style={GlobalStyle.container}>
                <ScrollView ref='home_scroll'
                            refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}
                            style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}>

                    {content}
                    {this.props.Notifications.length ?
                        <View style={styles.notificationSection}>
                            <ListView ref='notification_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                                      style={styles.container} enableEmptySections={true} dataSource={dataSource}
                                      renderRow={(notification) => <NotificationBox
                                        navigator={this.props.navigator} notification={notification}
                                        readNotification={this.props.readNotification}/>}
                            />
                            <TouchableOpacity onPress={this._redirect.bind(null, 'Notifications', null)}
                                              style={[styles.addClientSection, GlobalStyle.simpleBottomBorder]}>
                                <Text style={styles.addClientsText}>View All Notifications</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                    }
                </ScrollView>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#e6e8ed'
    },
    contentContainerStyle: {
        backgroundColor: '#e6e8ed'
    },
    addClientSection: {
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5
    },
    addClientsText: {
        fontSize: getFontSize(18),
        color: '#b1aea5',
        fontFamily: 'OpenSans-Semibold',
        margin: 10
    },
    notificationSection: {
        // backgroundColor: 'white',
        marginTop: 13,
        borderColor: '#e1e3df',
        borderTopWidth: 1,
        // flexDirection: 'row',
        // alignItems: 'center',
        // paddingBottom: 13
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
        actions: bindActionCreators(HomeActions, dispatch),
        getNotifications: bindActionCreators(GlobalActions.getNotifications, dispatch),
        readNotification: bindActionCreators(GlobalActions.readNotification, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Home);
