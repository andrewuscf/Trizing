import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getFontSize, fetchData, API_ENDPOINT, checkStatus} from '../../actions/utils';
import * as CalendarActions from '../../actions/calendarActions';

import PeopleBar from '../../components/PeopleBar';

const EventDetail = CreateClass({
    propTypes: {
        eventId: PropTypes.number.isRequired,
        occurrenceId: PropTypes.number
    },

    getInitialState() {
        return {event: null}
    },

    componentDidMount() {
        this.getEvent(true)
    },

    getEvent(refresh = false) {
        fetch(`${API_ENDPOINT}social/event/${this.props.eventId}/`, fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                this.setState({event: responseJson})
            });
    },


    render: function () {
        const event = this.state.event;
        if (!event) return null;
        const occurrence = _.find(event.occurrences, {id: this.props.occurrenceId});
        let start_time;
        let end_time;
        if (occurrence) {
            start_time = moment.utc(occurrence.start_time).local();
            end_time = moment.utc(occurrence.end_time).local();
        }
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}
                        showsVerticalScrollIndicator={false}>
                {start_time ?
                    <Text style={styles.eventDate}>
                        {start_time.format('ddd MMM DD, h:mm A ')} - {end_time.format('h:mm A')}
                    </Text>
                    : null
                }
                <Text style={styles.title}>
                    {event.title} <Text style={styles.smallTitle}>({event.event_type.label})</Text>
                </Text>
                <Text style={styles.invitedTitle}>Invited</Text>
                <PeopleBar navigate={this.props.navigation.navigate} people={event.invited.concat(event.user)}/>
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
        fontFamily: 'Heebo-Bold',
        fontSize: getFontSize(32),
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: '#4d4d4e',
    },
    smallTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Heebo-Medium',
    },
    invitedTitle: {
        fontSize: getFontSize(24),
        fontFamily: 'Heebo-Bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        color: '#4d4d4e',
    },
    eventDate: {
        fontFamily: 'Heebo-Light',
        fontSize: getFontSize(22),
        color: '#4d4d4e',
        flexDirection: 'row',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10
    },
});

const stateToProps = (state) => {
    return {
        // RequestUser: state.Global.RequestUser,
        UserToken: state.Global.UserToken
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CalendarActions, dispatch)
    }
};


export default connect(stateToProps, dispatchToProps)(EventDetail);
