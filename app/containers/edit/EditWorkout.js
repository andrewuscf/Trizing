import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Alert,
    TextInput,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import DisplayWorkoutDay from '../../components/DisplayWorkoutDay';
import SubmitButton from '../../components/SubmitButton';

import CreateWorkoutDay from '../sub/CreateWorkoutDay';

const BlankWorkout = {
    name: null,
    days: [],
    exercises: [],
};

const EditWorkout = React.createClass({
    propTypes: {
        workoutId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        const index = _.findIndex(this.props.Workouts, {id: this.props.workoutId});
        const workout = this.props.Workouts[index];
        return {
            Error: null,
            workout: workout
        }
    },

    asyncActions(start){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            // this.props.navigator.pop();
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.state.Error) {
            Alert.alert(
                this.state.Error,
                this.state.Error,
                [
                    {text: 'OK', onPress: () => this.setState({Error: null})},
                ]
            );
        }
        if (this.props.Workouts != prevProps.Workouts) {
            const index = _.findIndex(this.props.Workouts, {id: this.props.workoutId})
            const workout = this.props.Workouts[index];
            this.setState({workout: workout});
        }
    },

    _createWorkoutDay() {
        if (this.state.workout) {
            this.props.navigator.push(getRoute('CreateWorkoutDay', {workoutId: this.state.workout.id}))
        }
    },

    _toWorkoutDay(workout_day_id) {
        if (this.state.workout) {
            this.props.navigator.push(getRoute('WorkoutDayDetail', {workout_day_id: workout_day_id}))
        }
    },


    render: function () {
        let workout_days = <Text>No workout days</Text>;
        if (this.state.workout) {
            workout_days = this.state.workout.workout_days.map((workout_day, index) => {
                return <DisplayWorkoutDay key={index} _toWorkoutDay={this._toWorkoutDay} workout_day={workout_day}
                                          dayIndex={index}/>
            });
        }
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this.props.navigator.pop} backText="" navStyle={{height: 40}}>
                    <Text>{this.state.workout ? this.state.workout.name : null}</Text>
                </BackBar>

                <View style={{marginBottom: 10}}>
                    {workout_days}
                </View>

                <TouchableOpacity onPress={this._createWorkoutDay}>
                    <Text style={styles.addExerciseStyle}>Create Workout Day</Text>
                </TouchableOpacity>


            </ScrollView>
        )
    }
});

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    button: {
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        right: 0,
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
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


const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(EditWorkout);
