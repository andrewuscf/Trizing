import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';

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

const NotificationBox = CreateClass({
    propTypes: {
        notification: PropTypes.object.isRequired,
        navigate: PropTypes.func.isRequired,
        readNotification: PropTypes.func.isRequired
    },

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.notification != this.props.notification;
    },

    trimToLength(text, m) {
        return (text.length > m)
            ? text.substring(0, m).split(" ").slice(0, -1).join(" ") + "..."
            : text;
    },

    _navigateTo(routeName, props) {
        this.props.navigate(routeName, props);
    },

    goToProfile(userId) {
        this._navigateTo('Profile', {'id': userId});
    },

    onPress() {
        const action = this.props.notification.action;
        if (this.props.notification.unread) {
            this.props.readNotification(this.props.notification.id);
        }
        console.log(this.props.notification)
        if (action.action_object) {
            if (action.action_object.profile)
                this._navigateTo('Profile', {id: action.action_object.id});
            else if (action.action_object.room)
                this._navigateTo('ChatRoom', {roomId: action.action_object.room});
            else if (action.action_object.macro_plan || action.action_object.questionnaire || action.action_object.workout) {
                this._navigateTo('Profile', {id: action.action_object.client});
            } else if (action.action_object.liked_by) {
                // console.log('this is a post')
            } else if (action.action_object.from_user) {
                this._navigateTo('Profile', {
                    id: action.action_object.from_user.id,
                    request: action.action_object
                });
            } else if (action.action_object.event_type) {
                this._navigateTo('EventDetail', {eventId: action.action_object.id});
            } else if (action.action_object.macro_plan_days) {
                this._navigateTo('MacroPlanDetail', {macro_plan: action.action_object});
            } else if (action.action_object.macro_plan_day) {

                this._navigateTo('MacroLogDetail', {macro_log: action.action_object});

            } else if (action.action_object.workouts) {
                this._navigateTo('ScheduleDetail', {schedule: action.action_object});
            } else if (action.action_object.questions) {
                if (action.verb.toLowerCase().indexOf('answered') === -1) {
                    this._navigateTo('AnswerQuestionnaire', {questionnaire: action.action_object});
                } else {
                    this._navigateTo('AnswersDisplay', {
                        questionnaire: action.action_object,
                        client: action.actor
                    })
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
                    <AvatarImage goToProfile={this.goToProfile.bind(null, action.actor.id)} image={image} cache={true}/>
                    <View style={styles.noteInfo}>
                        <Text style={styles.firstName}>
                            {action.actor.profile.first_name} {action.actor.profile.last_name}
                        </Text>
                        <Text style={[styles.notifText, {paddingLeft: 0}]}>{action.verb}
                            {action.action_object && action.action_object.event_type ?
                                <Text style={styles.noteAction}> {action.action_object.title}</Text>
                                : null
                            }
                        </Text>
                        <View style={styles.timeStamp}>
                            <Text style={styles.timeStampText}>{moment.utc(action.timestamp).local().fromNow(false)}</Text>
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
        flexDirection: 'column',
        flexWrap: 'wrap',
        flex: 1,
    },
    noteVerb: {
        color: '#393839',
        fontFamily: 'Heebo-Medium',
        fontSize: getFontSize(18),
        lineHeight: getFontSize(26),
        flexWrap: 'wrap',
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
        fontFamily: 'Heebo-Bold',
        color: '#393839',
        flex: 1
    },
    noteAction: {
        textDecorationLine: 'underline',
        color: '#393839'
    }
});

export default NotificationBox;
