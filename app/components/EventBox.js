import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';

import GlobalStyle from '../containers/globalStyle';

import AvatarImage from './AvatarImage';

const EventBox = React.createClass({
    propTypes: {
        occurrence: React.PropTypes.object.isRequired,
        navigate: React.PropTypes.func.isRequired,
    },

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.occurrence != this.props.occurrence;
    },

    trimToLength(text, m) {
        return (text.length > m)
            ? text.substring(0, m).split(" ").slice(0, -1).join(" ") + "..."
            : text;
    },

    goToProfile(userId) {
        this.props.navigate('Profile', {'id': this.props.occurrence.event.user.id});
    },

    _onPress() {
        this.props.navigate('EventDetail', {
            occurrenceId: this.props.occurrence.id,
            eventId: this.props.occurrence.event.id
        });
    },

    _onActions() {
        // console.log('on actions')
    },


    render() {
        const occurrence = this.props.occurrence;
        const event = this.props.occurrence.event;
        let image = event.user.profile.thumbnail ? event.user.profile.thumbnail : event.user.profile.avatar;
        let start_time = moment.utc(occurrence.start_time).local();
        const attending = event.invited.map((user, i) => {
            return <Text key={i} style={styles.invitedUser}>{i == 0 ? `${user.username}` : `, ${user.username}`}</Text>
        });
        return (
            <TouchableOpacity activeOpacity={.5} onPress={this._onPress}
                              style={[GlobalStyle.simpleBottomBorder, styles.container]}>
                <View style={styles.eventDate}>
                    <Text style={styles.eventDateMonth}>{start_time.format("MMM").toUpperCase()}</Text>
                    <Text style={styles.eventDateDay}>{start_time.date()}</Text>
                </View>
                <View style={styles.noteInfo}>
                    <View style={styles.noteText}>
                        <Text style={styles.notifText}>
                            <Text style={styles.firstName}>{event.event_type.label}: {event.title}
                                <Text style={styles.smallText}> @ {start_time.format('h:mma')}</Text>
                            </Text>
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                            <Icon name="users" size={12} style={styles.userIcon}/>
                            {attending}
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
        flexWrap: 'wrap'
    },
    firstName: {
        fontFamily: 'OpenSans-Bold',
        color: '#393839'
    },
    smallText: {
        fontFamily: 'OpenSans-Light',
        color: '#4d4d4e'
    },
    noteText: {
        flexWrap: 'wrap',
        flex: 1,
    },
    noteAction: {
        textDecorationLine: 'underline',
        color: '#393839'
    },
    eventDateDay: {
        fontFamily: 'OpenSans-Bold',
        fontSize: getFontSize(26),
        color: '#4d4d4e'
    },
    eventDateMonth: {
        fontFamily: 'OpenSans-Bold',
        fontSize: getFontSize(14),
        backgroundColor: 'transparent',
        color: '#4d4d4e'
    },
    eventDate: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    invitedUser: {
        fontFamily: 'OpenSans-Light',
        color: '#4d4d4e',
        fontSize: getFontSize(16),
    },
    userIcon: {
        color: 'black',
        alignSelf: 'center',
        marginRight: 5
    }
});

export default EventBox;
