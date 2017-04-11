import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import moment from 'moment';

import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import PeopleBar from '../../components/PeopleBar';

const EventDetail = React.createClass({
    propTypes: {
        occurrence: React.PropTypes.object.isRequired,
    },


    render: function () {
        const event = this.props.occurrence.event;
        let start_time = moment.utc(this.props.occurrence.start_time).local();
        let end_time = moment.utc(this.props.occurrence.end_time).local();
        console.log(this.props.occurrence);
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this.props.navigator.pop}/>
                    <Text style={styles.eventDate}>
                        {start_time.format('ddd MMM DD, h:mm A ')} - {end_time.format('h:mm A')}
                    </Text>
                <Text style={styles.title}>
                    {event.title} <Text style={styles.smallTitle}>({event.event_type.label})</Text>
                </Text>
                <Text style={styles.invitedTitle}>Invited</Text>
                <PeopleBar navigator={this.props.navigator} people={event.invited}/>
            </ScrollView>
        )
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentContainerStyle: {
        overflow: 'hidden'
    },
    title: {
        fontFamily: 'OpenSans-Bold',
        fontSize: getFontSize(32),
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: '#4d4d4e',
    },
    smallTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'OpenSans-SemiBold',
    },
    invitedTitle: {
        fontSize: getFontSize(24),
        fontFamily: 'OpenSans-Bold',
        textAlign: 'center',
        marginTop:10,
        marginBottom: 10,
        color: '#4d4d4e',
    },
    eventDate: {
        fontFamily: 'OpenSans-Light',
        fontSize: getFontSize(22),
        color: '#4d4d4e',
        flexDirection: 'row',
        textAlign: 'center',
        marginTop:10,
        marginBottom: 10
    },
});

export default EventDetail;