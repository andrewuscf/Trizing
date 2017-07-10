import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Platform,
    ListView,
    Alert
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize, trunc} from '../../actions/utils';
import {DAYS_OF_WEEK} from '../../assets/constants';

import CustomIcon from '../../components/CustomIcon';
import DisplayExerciseBox from '../../components/trainer/DisplayExerciseBox';

const WorkoutDayDetail = React.createClass({
    propTypes: {
        workout_day_id: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            Error: null,
            workout_day: this.getWorkoutDay(),
        }
    },

    getWorkoutDay() {
        const schedule = _.find(this.props.Schedules, {workouts: [{workout_days: [{id: this.props.workout_day_id}]}]});
        const workout = _.find(schedule.workouts, {workout_days: [{id: this.props.workout_day_id}]});
        return _.find(workout.workout_days, {id: this.props.workout_day_id});
    },

    componentWillMount() {
        const dayOfWeek = _.find(DAYS_OF_WEEK, {id: this.state.workout_day.day});
        this.props.navigation.setParams({headerTitle: `${trunc(this.getWorkoutDay().name, 14)} (${dayOfWeek.full_day})`});
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Schedules !== prevProps.Schedules) {
            const workout_day = this.getWorkoutDay();
            if (workout_day) {
                this.setState({workout_day: workout_day});
                const dayOfWeek = _.find(DAYS_OF_WEEK, {id: this.state.workout_day.day});
                this.props.navigation.setParams({headerTitle: `${trunc(workout_day.name, 14)} (${dayOfWeek.full_day})`})
            }
        }
    },

    _addExercise() {
        this.props.navigation.navigate('CreateExercise', {workout_day: this.state.workout_day});
    },

    _editExercise(exercise) {
        this.props.navigation.navigate('CreateExercise', {workout_day: this.state.workout_day, exercise: exercise});
    },

    _deleteWorkoutDay() {
        Alert.alert(
            'Delete Training Day',
            `Are you sure you want delete this training day?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    onPress: () => console.log('Delete training day')
                },
            ]
        );
    },


    renderHeader() {
        return (
            <Text style={[styles.dayTitle]}>Exercises</Text>
        )
    },


    render: function () {
        if (!this.state.workout_day)
            return null;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.state.workout_day.exercises);

        return (
            <View style={styles.container}>

                {!this.state.workout_day.exercises.length ?
                    <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                        <Text>Create Exercises!</Text>
                    </View> :

                    <ListView ref='workout_day_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                              keyboardShouldPersistTaps="handled"
                              refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                              onRefresh={this.refresh}/>}
                              enableEmptySections={true}
                              dataSource={dataSource}
                              showsVerticalScrollIndicator={false}
                              contentContainerStyle={{paddingBottom: 10}}
                              renderRow={(exercise, sectionID, rowID) =>
                                  <DisplayExerciseBox exercise={exercise}
                                                      _editExercise={this._editExercise}
                                                      deleteSet={this.props.actions.deleteSet}/>
                              }
                    />
                }

                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right" offsetX={10} offsetY={20}>
                    <ActionButton.Item buttonColor='#F22525' title="Delete"
                                       onPress={this._deleteWorkoutDay}>
                        <MaterialIcon name="delete-forever" color="white" size={22}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Add Note" onPress={() => console.log('add note')}>
                        <MaterialIcon name="note-add" color="white" size={22}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Add Exercise"
                                       onPress={this._addExercise}>
                        <CustomIcon name="weight" color="white" size={22}/>
                    </ActionButton.Item>
                </ActionButton>

            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dayTitle: {
        fontSize: getFontSize(30),
        fontFamily: 'OpenSans-SemiBold',
        textAlign: 'center',
        borderBottomWidth: .5,
        borderColor: '#e1e3df',
    },
    day: {
        fontSize: getFontSize(32),
        fontFamily: 'OpenSans-Bold',
        paddingLeft: 20
    },
    dayTop: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,

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

export default connect(stateToProps, dispatchToProps)(WorkoutDayDetail);
