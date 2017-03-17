import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../../actions/utils';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import DaysOfWeek from '../../components/DaysOfWeek';
// import CreateExerciseBox from './CreateExerciseBox';

const CreateWorkoutDay = React.createClass({
    propTypes: {
        workout: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            name: null,
            days: [],
            exercises: [],
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


    _addExercise() {
        this.props.navigator.push(getRoute('CreateExercise', {workout_day: this.state}))
        this.setState({showCreate: !this.state.showCreate})
    },

    _save() {
        // this.props.getDayState(this.props.dayIndex, this.state)
    },

    render: function () {
        const exercises = null;
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this.props.navigator.pop} backText="" navStyle={{height: 40}}>
                    <Text>{this.state.workout ? this.state.workout.name : null}</Text>
                    <TouchableOpacity style={styles.save} onPress={this._save}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                </BackBar>

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
                <TouchableOpacity onPress={this._addExercise}>
                    <Text style={styles.addExerciseStyle}>Add Exercise</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
});


const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    save: {
        position: 'absolute',
        top: 20,
        right: 10
    },
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
    }
});


export default CreateWorkoutDay;
