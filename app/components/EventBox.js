import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';

import GlobalStyle from '../containers/globalStyle';


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


    render() {
        const occurrence = this.props.occurrence;
        const event = this.props.occurrence.event;
        let start_time = moment.utc(occurrence.start_time).local();
        let end_time = moment.utc(occurrence.end_time).local();
        const attending = event.invited.map((user, i) => {
            return <Text key={i} style={styles.invitedUser}>{i == 0 ? `${user.username}` : `, ${user.username}`}</Text>
        });
        const color = event.event_type.abbr === 'eve' ? '#9b59b6' : '#FD795B';
        return (
            <TouchableOpacity activeOpacity={.5} onPress={this._onPress}
                              style={[GlobalStyle.simpleBottomBorder, styles.container]}>
                <View style={styles.eventDate}>
                    <Text>{start_time.format('h:mma')}</Text>
                    <Text style={styles.invitedUser}>{end_time.format('h:mma')}</Text>
                </View>
                <View style={{flex: .1, justifyContent: 'center',}}>
                    <View style={{borderColor: color, borderTopWidth: 2, transform: [{rotate: '90deg'}]}}/>
                </View>
                <View style={styles.noteInfo}>
                    <View style={styles.noteText}>
                        <Text style={styles.notifText}>
                            <Text style={styles.firstName}>{event.title}</Text>
                        </Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
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
        flexDirection: 'row',
        flex: 1,
        borderColor: '#e1e3df',
        borderWidth: 1,
        padding: 10,
        paddingBottom: 15,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    notifText: {
        fontFamily: 'Heebo-Medium',
        fontSize: getFontSize(22),
        backgroundColor: 'transparent',
    },
    noteInfo: {
        flexDirection: 'column',
        flex: .7,
        flexWrap: 'wrap'
    },
    firstName: {
        fontFamily: 'Heebo-Medium',
        color: '#393839'
    },
    noteText: {
        flexWrap: 'wrap',
        flex: 1,
    },
    eventDate: {
        flex: .2,
        alignItems: 'flex-end',
    },
    invitedUser: {
        fontFamily: 'Heebo-Light',
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
