import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';

import GlobalStyle from '../containers/globalStyle';

import AvatarImage from './AvatarImage';

const EventBox = React.createClass({
    propTypes: {
        occurrence: React.PropTypes.object.isRequired,
        navigator: React.PropTypes.object.isRequired,
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
        this.props.navigator.push(getRoute('Profile', {'id': this.props.occurrence.event.user.id}));
    },

    _onPress() {
        console.log(this.props.occurrence)
    },

    _onActions() {
        console.log('on actions')
    },


    render() {
        const occurrence = this.props.occurrence;
        const event = this.props.occurrence.event;
        let image = event.user.profile.thumbnail ? event.user.profile.thumbnail : event.user.profile.avatar;
        let start_time = moment.utc(occurrence.start_time).local();
        let end_time = moment.utc(occurrence.end_time).local();
        return (
            <TouchableOpacity activeOpacity={1} onPress={this._onPress}
                              style={[GlobalStyle.simpleBottomBorder, styles.container]}>
                <AvatarImage goToProfile={this.goToProfile} image={image}/>
                <View style={styles.noteInfo}>
                    <View style={styles.noteText}>
                        <Text style={styles.notifText}>
                            <Text style={styles.firstName}>{event.title}</Text>
                        </Text>
                    </View>
                </View>
                <View style={styles.eventDate}>
                    <Text style={styles.eventDateMonth}>{start_time.format("MMM").toUpperCase()}</Text>
                    <Text style={styles.eventDateDay}>{start_time.date()}</Text>
                    <Text style={styles.eventDateTime}>{start_time.format('h:mma')}</Text>
                </View>
                <Text style={{alignSelf: 'center'}}>-</Text>
                <View style={styles.eventDate}>
                    <Text style={styles.eventDateMonth}>{end_time.format("MMM").toUpperCase()}</Text>
                    <Text style={styles.eventDateDay}>{end_time.date()}</Text>
                    <Text style={styles.eventDateTime}>{end_time.format('h:mma')}</Text>
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
        paddingLeft: 15,
        flexWrap: 'wrap'
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
    },
    eventDateTime: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 11,
        backgroundColor: 'transparent',
        color: '#4d4d4e'
    },
    eventDateDay: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 22,
        color: '#4d4d4e'
    },
    eventDateMonth: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 11,
        marginTop: -8,
        backgroundColor: 'transparent',
        color: '#4d4d4e'
    },
    eventDate: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
});

export default EventBox;
