import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';

import GlobalStyle from '../containers/globalStyle';

import AvatarImage from './AvatarImage';


moment.updateLocale('en', {
    relativeTime: {
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        s: "%ds",
        d: "1d",
        dd: "%dd",
    }
});

const NotificationBox = React.createClass({
    propTypes: {
        notification: React.PropTypes.object.isRequired,
        navigator: React.PropTypes.object.isRequired,
        readNotification: React.PropTypes.func.isRequired
    },

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.notification != this.props.notification;
    },

    trimToLength(text, m) {
        return (text.length > m)
            ? text.substring(0, m).split(" ").slice(0, -1).join(" ") + "..."
            : text;
    },

    goToProfile(userId) {
        this.props.navigator.push(getRoute('Profile', {'id': userId}));
    },

    onPress() {
        const action = this.props.notification.action;
        console.log(action)
        if (this.props.notification.unread) {
            this.props.readNotification(this.props.notification.id);
        }
    },


    render() {
        const notification = this.props.notification;
        const action = notification.action;
        let image = action.actor.profile.thumbnail ? action.actor.profile.thumbnail : action.actor.profile.avatar;
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.onPress}>
                <View style={[GlobalStyle.simpleBottomBorder, styles.container]}>
                    <AvatarImage goToProfile={this.goToProfile.bind(null, action.actor.id)} image={image}/>
                    <View style={styles.noteInfo}>
                        <View style={styles.noteText}>
                            <Text style={styles.notifText}>
                                <Text style={styles.firstName}>{action.actor.profile.first_name} </Text>
                                <Text style={styles.noteAction}>{action.verb}</Text>
                            </Text>
                        </View>
                        <View style={styles.timeStamp}>
                            <Text style={styles.timeStampText}>{moment(action.timestamp).fromNow(false)}</Text>
                            {notification.unread ? <View style={styles.redDot}/> : null}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        padding: 10,
    },
    notifText: {
        fontFamily: 'OpenSans-Semibold',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
    },
    noteInfo: {
        flexDirection: 'column',
        flex: 1,
        paddingLeft: 15
    },
    redDot: {
        width: 7,
        height: 7,
        borderRadius: 50,
        backgroundColor: 'red',
        marginTop: 5,
        marginLeft: 5,
    },
    timeStamp: {
        flexDirection: 'row',
    },
    timeStampText: {
        color: '#999791',
        fontSize: 11
    },
    firstName: {
        fontFamily: 'OpenSans-Bold',
        color: '#393839'
    },
    noteText: {
        flexWrap: 'wrap',
        flex: 1,
    },
    noteAction: {
        textDecorationLine: 'underline',
        color: '#393839'
    }
});

export default NotificationBox;
