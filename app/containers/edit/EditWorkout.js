import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';

import DisplayWorkoutDay from '../../components/DisplayWorkoutDay';

import CreateWorkoutDay from '../sub/CreateWorkoutDay';


const EditWorkout = React.createClass({
    propTypes: {
        workoutId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        const schedule = _.find(this.props.Schedules, {workouts: [{id: this.props.workoutId}]});
        const workout = _.find(schedule.workouts, {id: this.props.workoutId});
        return {
            Error: null,
            workout: workout
        }
    },

    componentWillMount() {
        const schedule = _.find(this.props.Schedules, {workouts: [{id: this.props.workoutId}]});
        const workout = _.find(schedule.workouts, {id: this.props.workoutId});
        this.props.navigation.setParams({headerTitle: workout.name});
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Schedules != prevProps.Schedules) {
            const schedule = _.find(this.props.Schedules, {workouts: [{id: this.props.workoutId}]});
            const workout = _.find(schedule.workouts, {id: this.props.workoutId});
            this.setState({workout: workout});
            this.props.navigation.setParams({headerTitle: workout.name});
        }
    },

    _createWorkoutDay() {
        if (this.state.workout) {
            this.props.navigation.navigate('CreateWorkoutDay', {workoutId: this.state.workout.id});
        }
    },

    _toWorkoutDay(workout_day_id) {
        if (this.state.workout) {
            this.props.navigation.navigate('WorkoutDayDetail', {workout_day_id: workout_day_id});
        }
    },

    _deleteWorkout() {
        Alert.alert(
            'Delete Workout',
            `Are you sure you want delete this workout?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    onPress: () => console.log('Delete workout')
                },
            ]
        );
    },


    render: function () {
        let workout_days = (
            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                <Text>You have no workout days! Create Some!</Text>
            </View>
        );
        if (this.state.workout && this.state.workout.workout_days.length) {
            const ordered = _.orderBy(this.state.workout.workout_days, (workout_day) => {
                return workout_day.day
            });
            workout_days = ordered.map((workout_day, index) => {
                return <DisplayWorkoutDay key={index} _toWorkoutDay={this._toWorkoutDay} workout_day={workout_day}
                                          dayIndex={index}/>
            });
        }
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.contentContainerStyle}>
                    {workout_days}
                </ScrollView>
                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                    <ActionButton.Item buttonColor='#F22525' title="Delete" onPress={this._deleteWorkout}>
                        <MaterialIcon name="delete-forever" color="white" size={22}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Add Note" onPress={()=> console.log('add note')}>
                        <MaterialIcon name="note-add" color="white" size={22}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Add Training Day"
                                       onPress={this._createWorkoutDay}>
                        <MaterialIcon name="add" color="white" size={22}/>
                    </ActionButton.Item>
                </ActionButton>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    contentContainerStyle: {
        margin: 10
    },
    title: {
        fontSize: getFontSize(28),
        fontFamily: 'OpenSans-Bold',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
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
