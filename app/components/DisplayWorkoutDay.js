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
        _toWorkoutDay: React.PropTypes.func.isRequired,
        active: React.PropTypes.bool,
    },

    getInitialState() {
        return {
            days: this.props.workout_day.days ? this.props.workout_day.days : [],
        }
    },


    render: function () {
        return (
            <TouchableOpacity onPress={this.props._toWorkoutDay.bind(null, this.props.workout_day.id)}
                              style={[styles.displayWorkoutBox, this.props.active ? styles.active : null]}>
                <Text style={styles.simpleTitle}>{this.props.workout_day.name}</Text>
                <DaysOfWeek days={this.state.days}/>
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
    },
    simpleTitle: {
        fontSize: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    },
    active: {
        borderColor: 'green',
    }
});


export default DisplayWorkoutDay;
