import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    Alert
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

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


    render: function () {
        let workout_days = (
            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                <Text>You have no workout days! Create Some!</Text>
            </View>
        );
        if (this.state.workout && this.state.workout.workout_days.length) {
            const ordered = _.orderBy(this.state.workout.workout_days, (workout_day)=>{
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

                    <View style={{marginBottom: 10}}>
                        {workout_days}
                    </View>


                </ScrollView>
                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.editBlock, {paddingLeft: 10}]}>
                        <MaterialIcon name="delete-forever" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editBlock, {paddingLeft: 15}]} onPress={this._createWorkoutDay}>
                        <MaterialIcon name="add-circle" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Add Workout Day</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editBlock, {paddingRight: 10}]}>
                        <MaterialIcon name="note-add" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Add Note</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
});

const iconColor = '#8E8E8E';

const styles = StyleSheet.create({
    flexCenter: {
        flex: .9,
    },
    title: {
        fontSize: getFontSize(28),
        fontFamily: 'OpenSans-Bold',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    footer: {
        borderTopWidth: 1,
        borderColor: '#e1e3df',
        alignItems: 'center',
        minHeight: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: .1
    },
    editBlock: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 5,
    },
    editItemLabel: {
        fontFamily: 'OpenSans-Semibold',
        fontSize: getFontSize(14),
        color: iconColor,
        textAlign: 'center',
    },
    editItem: {
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
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
