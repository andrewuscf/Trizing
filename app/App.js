import React from 'react';
import {
    Platform,
    Alert
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import FCM, {
    FCMEvent,
} from 'react-native-fcm';
import {MenuContext} from 'react-native-popup-menu';
import {
    setCustomText,
    setCustomTouchableOpacity,
} from 'react-native-global-props';


import * as GlobalActions from './actions/globalActions';
import {AppNavigator} from './routes';
import {getFontSize} from './actions/utils';


setCustomText({
    style: {
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
    }
});
setCustomTouchableOpacity({
    hitSlop: { top: 15, right: 15, left: 15, bottom: 15 }
});

const App = React.createClass({

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

        if (!prevProps.RequestUser && this.props.RequestUser && this.props.RequestUser != prevProps.RequestUser) {
            this.setUpNotifications();
        }

        if (this.props.Notifications && this.props.Notifications.length && Platform.OS === 'ios') {
            let unreadcount = 0;
            this.props.Notifications.forEach((notification) => {
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
            // console.log(notif);
            if (notif.local_notification) {
                //this is a local notification
            }
            if (notif.opened_from_tray) {
                //app is open/resumed because user clicked banner
            }
            //
            // if (Platform.OS === 'ios') {
            //     switch (notif._notificationType) {
            //         case NotificationType.Remote:
            //             notif.finish(RemoteNotificationResult.NewData);
            //             break;
            //         case NotificationType.NotificationResponse:
            //             notif.finish();
            //             break;
            //         case NotificationType.WillPresent:
            //             notif.finish(WillPresentNotificationResult.All);
            //             break;
            //     }
            // }
        });
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
            if (token) self.props.actions.setDeviceForNotification(token);
        });
    },

    componentWillUnmount() {
        this.notificationListener.remove();
        this.refreshTokenListener.remove();
    },


    // itemChangedFocus(route) {
    //     this.props.actions.setActiveRoute(route.name);
    // },


    render() {
        return <MenuContext lazyRender={200}><AppNavigator/></MenuContext>;

    }
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
