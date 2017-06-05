import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Platform,
    ListView,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
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
        const workout_day = _.find(workout.workout_days, {id: this.props.workout_day_id});
        return workout_day
    },

    componentWillMount() {
        this.props.navigation.setParams({headerTitle: this.getWorkoutDay().name});
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Schedules != prevProps.Schedules) {
            const workout_day = this.getWorkoutDay();
            if (workout_day) {
                this.setState({workout_day: workout_day});
                this.props.navigation.setParams({headerTitle: workout_day.name})
            }
        }
    },

    _addExercise() {
        this.props.navigation.navigate('CreateExercise', {workout_day: this.state.workout_day});
    },

    _editExercise(exercise) {
        this.props.navigation.navigate('CreateExercise', {workout_day: this.state.workout_day, exercise: exercise});
    },


    render: function () {
        if (!this.state.workout_day)
            return null;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.state.workout_day.exercises);

        const dayOfWeek = _.find(DAYS_OF_WEEK, {id: this.state.workout_day.day});
        return (
            <View style={styles.container}>
                <View style={styles.dayTop}>
                    <MaterialIcon name="today" size={30}/>
                    <Text style={styles.day}>{dayOfWeek.full_day}</Text>
                </View>
                <View style={styles.flexCenter} keyboardShouldPersistTaps="handled">
                    <Text style={[styles.dayTitle]}>Exercises</Text>

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
                                  renderRow={(exercise, sectionID, rowID) =>
                                      <DisplayExerciseBox exercise={exercise}
                                                          _editExercise={this._editExercise}
                                                          deleteSet={this.props.actions.deleteSet}/>
                                  }
                        />
                    }
                </View>

                <View style={styles.footer}>

                    <TouchableOpacity style={[styles.editBlock, {paddingLeft: 10}]}>
                        <MaterialIcon name="delete-forever" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editBlock, {paddingLeft: 15}]} onPress={this._addExercise}>
                        <CustomIcon name="weight" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Add Exercise</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editBlock, {paddingRight: 10}]}>
                        <MaterialIcon name="note-add" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Add Note</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
});

const iconColor = '#8E8E8E';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flexCenter: {
        flex: .9
    },
    dayTitle: {
        fontSize: getFontSize(38),
        fontFamily: 'OpenSans-Bold',
        textAlign: 'center',
        borderBottomWidth: .5,
        borderColor: '#e1e3df',
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
