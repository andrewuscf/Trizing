import React from 'react';
import EventEmitter from 'EventEmitter';
import {
    StyleSheet,
    Text,
    View,
    Navigator,
    AsyncStorage,
    BackAndroid,
    Platform,
    Alert
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Modal from 'react-native-modalbox';
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from 'react-native-fcm';
import _ from 'lodash';
import {MenuContext} from 'react-native-popup-menu';


import * as GlobalActions from './actions/globalActions';
import {getRoute} from './routes';

import Login from './containers/Login';
import EditProfile from './containers/edit/EditProfile';

import NavBar from './components/Navbar';
import Loading from './components/Loading';


let navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
    }
    return false;
});

const App = React.createClass({

    getInitialState: function () {
        return {
            splashArt: true,
        };
    },

    _renderScene: function (route, nav) {
        const SceneComponent = route.component;
        switch (route.name) {
            case 'Home':
                return <SceneComponent navigator={ nav } route={route} {...route.passProps}
                                       events={this.eventEmitter} openModal={this.openQuestionnaireModal}/>;
            case 'Profile':
                return <SceneComponent navigator={ nav } route={route} {...route.passProps} events={this.eventEmitter}
                                       openModal={this.openQuestionnaireModal}/>;
            case 'Login':
                return <SceneComponent navigator={ nav } route={route} {...route.passProps}
                                       login={this.props.actions.login}
                                       resetPassword={this.props.actions.resetPassword}
                                       register={this.props.actions.register}
                                       socialAuth={this.props.actions.socialAuth}
                                       events={this.eventEmitter}/>;
            default :
                return <SceneComponent navigator={ nav } route={route} {...route.passProps}
                                       events={this.eventEmitter}/>;

        }

    },

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Error) {
            const Error = JSON.parse(this.props.Error);
            Alert.alert(
                Error.title,
                Error.text,
                [
                    {text: 'OK', onPress: () => this.props.actions.clearAPIError()},
                ]
            );
        }

        const prevUser = prevProps.RequestUser;
        const newUser = this.props.RequestUser;

        if (!prevUser && newUser && newUser != prevUser) {
            this.setUpNotifications();
            const routes = navigator.getCurrentRoutes();
            if (!newUser.profile.completed) {
                if (routes[routes.length - 1].name != 'EditProfile') {
                    navigator.immediatelyResetRouteStack([getRoute('EditProfile')])
                }
            } else {
                if (routes[routes.length - 1].name != 'Home') {
                    navigator.immediatelyResetRouteStack([getRoute('Home')])
                }
            }
        }

        if (this.props.Notifications && this.props.Notifications.length && Platform.OS === 'ios') {
            let unreadcount = 0;
            this.props.Notifications.forEach((notification, i) => {
                if (notification.unread) {
                    unreadcount = unreadcount + 1;
                }
            });
            if (FCM) FCM.setBadgeNumber(unreadcount);
        }
    },

    setUpNotifications() {
        const self = this;
        FCM.requestPermissions(); // for iOS
        FCM.getFCMToken().then(token => {
            if (token) self.props.actions.setDeviceForNotification(token);
        });
        this.notificationListener = FCM.on(FCMEvent.Notification, async(notif) => {
            // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
            self.props.actions.getNewNotifications();
            console.log(notif);
            if (notif.local_notification) {
                //this is a local notification
            }
            if (notif.opened_from_tray) {
                //app is open/resumed because user clicked banner
            }

            if (Platform.OS === 'ios') {
                switch (notif._notificationType) {
                    case NotificationType.Remote:
                        notif.finish(RemoteNotificationResult.NewData);
                        break;
                    case NotificationType.NotificationResponse:
                        notif.finish();
                        break;
                    case NotificationType.WillPresent:
                        notif.finish(WillPresentNotificationResult.All);
                        break;
                }
            }
        });
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
            if (token) self.props.actions.setDeviceForNotification(token);
        });
    },

    componentWillMount() {
        // this.props.actions.removeToken();
        AsyncStorage.getItem('USER_TOKEN', (err, result) => {
            if (result) {
                this.props.actions.setTokenInRedux(result);
            }
            this.setState({splashArt: false});
        });
        this.eventEmitter = new EventEmitter();
    },

    componentWillUnmount() {
        this.notificationListener.remove();
        this.refreshTokenListener.remove();
    },

    itemChangedFocus(route) {
        this.props.actions.setActiveRoute(route.name);
    },


    scrollToTopEvent(routeName) {
        this.eventEmitter.emit('scrollToTopEvent', {routeName: routeName});
    },


    render() {
        if (this.state.splashArt) {
            // Should replace this with a splash art.
            return <Loading />;
        }

        let route = getRoute('Loading');
        if (this.props.UserToken) {
            if (this.props.RequestUser && this.props.RequestUser.profile.completed) {
                route = getRoute('Home')
            } else if (this.props.RequestUser && !this.props.RequestUser.profile.completed) {
                route = getRoute('EditProfile')
            }
        } else {
            route = getRoute('Login')
        }

        const unReadMessages = _.filter(this.props.Notifications, function (o) {
                return o.unread && o.action && o.action.action_object && o.action.action_object.room;
            }).length > 0;

        return (
            <MenuContext lazyRender={200}>
                <Navigator initialRoute={route}
                           style={styles.container}
                           ref={(nav) => {
                               navigator = nav
                           }}
                           onDidFocus={this.itemChangedFocus}
                           renderScene={ this._renderScene }
                           navigationBar={<NavBar RequestUser={this.props.RequestUser}
                                                  scrollToTopEvent={this.scrollToTopEvent}
                                                  unReadMessages={unReadMessages}
                                                  route={this.props.Route}/>}
                />
            </MenuContext>
        );

    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: (Platform.OS === 'ios') ? 20 : 0,
        // backgroundColor: '#f1f1f1'
    },
    modal: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
});

const stateToProps = (state) => {
    return {
        ...state.Global,
        Notifications: state.Home.Notifications
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(App);
