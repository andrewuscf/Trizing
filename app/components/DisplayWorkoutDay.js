import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';
import {DAYS_OF_WEEK} from '../assets/constants';


const DisplayWorkoutDay = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
        dayIndex: React.PropTypes.number.isRequired,
        _toWorkoutDay: React.PropTypes.func.isRequired,
        active: React.PropTypes.bool,
    },


    render: function () {
        const dayOfWeek = _.find(DAYS_OF_WEEK, {id: this.props.workout_day.day});
        return (
            <TouchableOpacity onPress={this.props._toWorkoutDay.bind(null, this.props.workout_day.id)}
                              style={[styles.displayWorkoutBox, this.props.active ? styles.active : null]}>
                <View style={{alignItems: 'center', width: 100}}>
                    <Text style={styles.day}>{dayOfWeek.full_day}</Text>
                    <Icon name="today" size={30} />
                </View>
                <Text style={styles.simpleTitle}>{this.props.workout_day.name}</Text>
            </TouchableOpacity>
        )
    }
});


const styles = StyleSheet.create({
    displayWorkoutBox: {
        flex: 1,
        margin: 5,
        borderColor: '#e1e3df',
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    simpleTitle: {
        fontSize: getFontSize(28),
        fontFamily: 'OpenSans-Bold',
        // marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    day: {
        fontSize: getFontSize(18),
        fontFamily: 'OpenSans-Semibold',
        paddingBottom: 5
    },
    active: {
        borderColor: 'green',
    }
});


export default DisplayWorkoutDay;
