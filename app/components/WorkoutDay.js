import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';

import DaysOfWeek from './DaysOfWeek';
import ExerciseBox from './ExerciseBox';

const BlankSet = {reps: 10, weight: null};
const BlankExercise = {
    name: null,
    sets: [
        BlankSet
    ],
};

const WorkoutDay = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
        dayIndex: React.PropTypes.number.isRequired
        // createWorkout: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            exercises: [
                BlankExercise
            ],
        }
    },

    _onDayNameChange(text) {
        this.props.getDayState(this.props.dayIndex, {name: text})
    },

    daySelectedState(days) {
        this.props.getDayState(this.props.dayIndex, {days: days})
    },

    getExerciseState(index, state) {
        let exercises = this.state.exercises;
        exercises[index] = {
            ...exercises[index],
            ...state
        };
        this.setState({exercises: exercises})
        // this.props.getExerciseState(this.props.exerciseIndex, {sets: sets})
    },

    addExercise() {
        Keyboard.dismiss();
        this.setState({
            exercises: [
                ...this.state.exercises,
                BlankExercise
            ]
        });
    },

    removeExercise(index) {
        Keyboard.dismiss();
        if (this.state.exercises.length > 1) {
            this.setState({
                exercises: this.state.exercises.slice(0, index).concat(this.state.exercises.slice(index + 1))
            })
        }
    },


    render: function () {
        const exercises = this.state.exercises.map((exercise, index)=> {
            return <ExerciseBox key={index}  exercise={exercise} exerciseIndex={index} getExerciseState={this.getExerciseState}/>
        });
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
                <Text style={styles.inputLabel}>What days?</Text>
                <DaysOfWeek daySelectedState={this.daySelectedState} days={this.props.workout_day.days}/>
                {exercises}
            </View>
        )
    }
});


const styles = StyleSheet.create({
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
