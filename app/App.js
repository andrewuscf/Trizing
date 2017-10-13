import React from 'react';
import {
    Platform,
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
    setCustomScrollView,
    setCustomListView,
} from 'react-native-global-props';
import t from 'tcomb-form-native';
import _ from 'lodash';

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
    hitSlop: {top: 15, right: 15, left: 15, bottom: 15},
    activeOpacity: .9,
});
setCustomListView({
    contentContainerStyle:{paddingBottom: 50}
});
setCustomScrollView({
    contentContainerStyle:{paddingBottom: 50}
});

const App = React.createClass({

    componentDidUpdate(prevProps, prevState) {

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
        this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
            // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
            self.props.actions.getNewNotifications();
            // console.log(notif);
            if (notif.local_notification) {
                //this is a local notification
            }
            if (notif.opened_from_tray) {
                //app is open/resumed because user clicked banner
            }

        });
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
            if (token) self.props.actions.setDeviceForNotification(token);
        });
    },

    componentWillUnmount() {
        this.notificationListener.remove();
        this.refreshTokenListener.remove();
    },

    render() {
        return <MenuContext lazyRender={200}><AppNavigator/></MenuContext>;

    }
});


const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup = {
    ...stylesheet.formGroup,
    normal: {
        ...stylesheet.formGroup.normal,
        borderColor: '#cccccc',
        borderWidth: 1,
        padding: 5,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 0,
        borderRadius: 5,
    },
    error: {
        ...stylesheet.formGroup.error,
        borderColor: 'red',
        backgroundColor: 'white',
        borderWidth: 1,
        padding: 5,
        margin: 10,
        marginBottom: 5,
        borderRadius: 5,
    }
};
stylesheet.textbox = {
    ...stylesheet.textbox,
    normal: {
        ...stylesheet.textbox.normal,
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
        borderWidth: 0,
        marginBottom: 0,
    },
    error: {
        ...stylesheet.textbox.error,
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
        borderWidth: 0,
        marginBottom: 0,
    }
};

stylesheet.pickerValue = {
    ...stylesheet.pickerValue,
    normal: {
        ...stylesheet.pickerValue.normal,
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
        color: '#000000'
    },
    error: {
        ...stylesheet.pickerValue.error,
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
        color: 'red'
    }
};

stylesheet.pickerTouchable = {
    ...stylesheet.pickerTouchable,
    normal: {
        ...stylesheet.pickerTouchable.normal,
        height: 36
    },
    error: {
        ...stylesheet.pickerTouchable.error,
        height: 36
    }
};

stylesheet.pickerContainer = {
    ...stylesheet.pickerContainer,
    normal: {
        ...stylesheet.pickerContainer.normal,
        height: 36,
        marginBottom: 0,
    },
    error: {
        ...stylesheet.pickerContainer.error,
        height: 36,
        marginBottom: 0,
    }
};

stylesheet.dateValue = {
    ...stylesheet.dateValue,
    normal: {
        ...stylesheet.dateValue.normal,
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
        color: '#000000',
        marginBottom: 0,
    },
    error: {
        ...stylesheet.dateValue.error,
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
        color: 'red',
        marginBottom: 0,
    }
};

// override globally
t.form.Form.defaultProps.stylesheet = stylesheet;


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
