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
        if (action.action_object) {
            if (action.action_object.profile)
                this.props.navigator.push(getRoute('Profile', {id: action.action_object.id}));
            else if (action.action_object.room)
                this.props.navigator.push(getRoute('ChatRoom', {roomId: action.action_object.room}));
            else if (action.action_object.macro_plan || action.action_object.questionnaire || action.action_object.workout) {
                this.props.navigator.push(getRoute('Profile', {id: action.action_object.client}));
            } else if (action.action_object.liked_by) {
                console.log('this is a post')
            } else if (action.action_object.from_user) {
                this.props.navigator.push(getRoute('Profile', {
                    id: action.action_object.from_user.id,
                    request: action.action_object
                }));
            } else if (action.action_object.event_type) {
                this.props.navigator.push(getRoute('EventDetail', {eventId: action.action_object.id}));
            } else if (action.action_object.macro_plan_days) {
                this.props.navigator.push(getRoute('MacroPlanDetail', {macro_plan: action.action_object}));
            } else if (action.action_object.workouts) {
                this.props.navigator.push(getRoute('ScheduleDetail', {schedule: action.action_object}));
            } else if (action.action_object.questions) {
                if (action.verb.toLowerCase().indexOf('answered') == -1) {
                    this.props.navigator.push(getRoute('AnswerQuestionnaire', {questionnaire: action.action_object}));
                } else {
                    this.props.navigator.push(getRoute('AnswersDisplay', {
                        questionnaire: action.action_object,
                        client: action.actor.id
                    }))
                }
            }
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
                        <Text style={styles.notifText}>
                            <Text style={styles.firstName}>{action.actor.profile.first_name} </Text>

                        </Text>
                        <Text style={styles.noteVerb}>
                            {action.verb}
                            {action.action_object && action.action_object.event_type ?
                                <Text style={styles.noteAction}> {action.action_object.title}</Text>
                                : null
                            }
                        </Text>
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
        flexDirection: 'column',
        flexWrap: 'wrap',
        flex: 1,
    },
    noteVerb: {
        color: '#393839',
        fontFamily: 'OpenSans-Semibold',
        fontSize: getFontSize(18),
        lineHeight: getFontSize(26),
        flexWrap: 'wrap',
        // fontSize: getFontSize(22),
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
        color: '#393839',
        flex: 1
    },
    noteAction: {
        textDecorationLine: 'underline',
        color: '#393839'
    }
});

export default NotificationBox;
