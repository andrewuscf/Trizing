import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';

import DaysOfWeek from './DaysOfWeek';

const DisplayWorkoutDay = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
        dayIndex: React.PropTypes.number.isRequired,
        _toWorkoutDay: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            days: this.props.workout_day.days ? this.props.workout_day.days : [],
        }
    },


    render: function () {
        return (
            <TouchableOpacity onPress={this.props._toWorkoutDay.bind(null, this.props.workout_day.id)}
                              style={styles.displayWorkoutBox}>
                <Text style={styles.simpleTitle}>{this.props.workout_day.name}</Text>
                <DaysOfWeek days={this.state.days}/>
            </TouchableOpacity>
        )
    }
});


const styles = StyleSheet.create({
    displayWorkoutBox: {
        flex: 1,
        // alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#e1e3df',
    },
    simpleTitle: {
        fontSize: getFontSize(22),
        // color: '#b1aea5',
        fontFamily: 'OpenSans-Semibold',
        margin: 10,
        textAlign: 'center'
    },
});


export default DisplayWorkoutDay;
