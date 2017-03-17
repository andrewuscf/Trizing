import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';

import DaysOfWeek from './DaysOfWeek';
import CreateExerciseBox from './CreateExerciseBox';

const BlankSet = {reps: null, weight: null};
const BlankExercise = {
    name: null,
    sets: [
        BlankSet
    ],
    days: []
};

const CreateWorkoutDay = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
        dayIndex: React.PropTypes.number.isRequired,
        getDayState: React.PropTypes.func
    },

    getInitialState() {
        return {
            name: this.props.workout_day.name ? this.props.workout_day.name : null,
            days: this.props.workout_day.days ? this.props.workout_day.days : [],
            exercises: this.props.workout_day.exercises ? this.props.workout_day.exercises : [],
            showCreate: false
        }
    },

    componentDidMount() {
        if (this.refs.day_name)
            this.refs.day_name.focus()
    },

    getExerciseState(index, state) {
        let exercises = this.state.exercises;
        exercises[index] = {
            ...exercises[index],
            ...state
        };
        this.setState({exercises: exercises, showCreate: !this.state.showCreate})
    },

    _deleteExercise(index) {
        Keyboard.dismiss();
        if (this.state.exercises.length > 1) {
            this.setState({
                exercises: this.state.exercises.slice(0, index).concat(this.state.exercises.slice(index + 1))
            })
        }
    },


    _toggleShow() {
        this.setState({showCreate: !this.state.showCreate})
    },

    _save() {
        this.props.getDayState(this.props.dayIndex, this.state)
    },

    render: function () {
        if (this.props.workout_day.name)
            return (
                <View>
                    <Text style={styles.inputLabel}>{this.props.workout_day.name}</Text>
                </View>
            );
        const exercises = this.state.exercises.map((exercise, index) => {
            if (exercise.name && exercise.sets.length > 0) {
                if (this.state.exercises.length > 1)
                    return <CreateExerciseBox key={index} exercise={exercise} exerciseIndex={index}
                                        getExerciseState={this.getExerciseState}
                                        _deleteExercise={this._deleteExercise}/>
                else
                    return <CreateExerciseBox key={index} exercise={exercise} exerciseIndex={index}
                                        getExerciseState={this.getExerciseState}/>
            }
        });
        return (
            <View>
                {this.state.showCreate ?
                    <CreateExerciseBox exercise={BlankExercise} exerciseIndex={this.state.exercises.length}
                                 getExerciseState={this.getExerciseState}/>
                    :
                    <View>
                        <Text style={styles.inputLabel}>Name of Day</Text>
                        <View style={[styles.inputWrap]}>
                            <TextInput ref='day_name'
                                       style={[styles.textInput]}
                                       multiline={true}
                                       underlineColorAndroid='transparent'
                                       autoCapitalize='sentences'
                                       placeholderTextColor='#4d4d4d'
                                       onChangeText={(text) => this.setState({name: text})}
                                       value={this.state.name}
                                       placeholder="'Pull day, 'Monday' or 'Day One'"/>
                        </View>
                        <Text style={styles.inputLabel}>What days?</Text>
                        <DaysOfWeek daySelectedState={(days) => this.setState({days: days})} days={this.state.days}/>
                        <Text style={styles.inputLabel}>Exercises</Text>
                        {exercises}
                        <TouchableOpacity onPress={this._toggleShow}>
                            <Text style={styles.addExerciseStyle}>Add Exercise</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.state.showCreate ? this._toggleShow : this._save}>
                            <Text style={styles.addExerciseStyle}>Save</Text>
                        </TouchableOpacity>
                    </View>
                }
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
        fontSize: getFontSize(30),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    },
    addExerciseStyle: {
        height: 35,
        marginTop: 5,
        marginBottom: 8,
        color: '#b1aea5',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'OpenSans-Semibold',
        alignSelf: 'center',
        textDecorationLine: 'underline',
        textDecorationColor: '#b1aea5'
    },
});


export default CreateWorkoutDay;
