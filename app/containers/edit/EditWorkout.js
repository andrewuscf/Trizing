import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
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

                <SubmitButton buttonStyle={styles.button}
                              textStyle={styles.submitText} onPress={this._createWorkoutDay} ref='postbutton'
                              text='Create workout Day'/>


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
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
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
