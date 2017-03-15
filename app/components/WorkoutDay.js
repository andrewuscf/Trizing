import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';

import DaysOfWeek from './DaysOfWeek';


var WorkoutDay = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
        dayIndex: React.PropTypes.number.isRequired
        // createWorkout: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            // exercises: [],
            // sets: [
            //
            // ]
        }
    },

    _onDayNameChange(text) {
        this.props.getDayState(this.props.dayIndex, {name:text})
    },

    getDayState(days) {
        console.log(days)
        this.props.getDayState(this.props.dayIndex, {days:days})
    },


    render: function () {
        return (
            <View>
                <Text style={styles.inputLabel}>Name of Day</Text>
                <View
                    style={[styles.inputWrap]}>
                    <TextInput ref={`day`}
                               style={[styles.textInput]}
                               multiline={true}
                               underlineColorAndroid='transparent'
                               autoCapitalize='sentences'
                               placeholderTextColor='#4d4d4d'
                               onChangeText={this._onDayNameChange}
                               value={this.props.name}
                               placeholder="'Pull day, 'Monday' or 'Day One'"/>
                </View>
                <Text style={styles.inputLabel}>On what days?</Text>
                <DaysOfWeek getDayState={this.getDayState} days={this.props.workout_day.days}/>
            </View>
        )
    }
});


var styles = StyleSheet.create({
    inputWrap: {
        flex: 1,
        marginBottom: 12,
        height: 30,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    textInput: {
        color: 'black',
        fontSize: 17,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        height: 30,
        textAlign: 'center'
    },
    inputLabel: {
        fontSize: 18,
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    }
});


export default WorkoutDay;
