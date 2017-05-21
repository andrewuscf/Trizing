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
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';

import BackBar from '../../components/BackBar';
import CustomIcon from '../../components/CustomIcon';
import DaysOfWeek from '../../components/DaysOfWeek';
import DisplayExerciseBox from '../../components/DisplayExerciseBox';

const WorkoutDayDetail = React.createClass({
    propTypes: {
        workout_day_id: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        const schedule = _.find(this.props.Schedules, {workouts: [{workout_days: [{id: this.props.workout_day_id}]}]});
        const workout = _.find(schedule.workouts, {workout_days: [{id: this.props.workout_day_id}]});
        const workout_day = _.find(workout.workout_days, {id: this.props.workout_day_id});
        return {
            Error: null,
            workout_day: workout_day,
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Schedules != prevProps.Schedules) {
            const schedule = _.find(this.props.Schedules, {workouts: [{workout_days: [{id: this.props.workout_day_id}]}]});
            const workout = _.find(schedule.workouts, {workout_days: [{id: this.props.workout_day_id}]});
            const workout_day = _.find(workout.workout_days, {id: this.props.workout_day_id});
            if (workout_day)
                this.setState({workout_day: workout_day})
        }
    },

    _addExercise() {
        this.props.navigation.navigate('CreateExercise', {workout_day: this.state.workout_day});
    },

    _editExercise(exercise) {
        this.props.navigation.navigate('CreateExercise', {workout_day: this.state.workout_day, exercise: exercise});
    },

    _back() {
        this.props.navigation.goBack()
    },


    render: function () {
        let exercises = null;
        if (!this.state.workout_day)
            return null;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.state.workout_day.exercises);
        return (
            <View style={styles.container}>
                <BackBar back={this._back} />
                <Text style={[styles.title]}>{this.state.workout_day.name}</Text>

                <DaysOfWeek days={this.state.workout_day.days}/>
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
                                      <DisplayExerciseBox exercise={exercise} _editExercise={this._editExercise}/>
                                  }
                        />
                    }
                </View>

                <View style={styles.footer}>

                    <TouchableOpacity style={[styles.editBlock, {paddingLeft: 10}]}>
                        <Icon name="trash" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editBlock, {paddingLeft: 15}]} onPress={this._addExercise}>
                        <CustomIcon name="weight" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Add Exercise</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editBlock, {paddingRight: 10}]}>
                        <Icon name="sticky-note" size={20} color={iconColor}/>
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
    title: {
        fontSize: getFontSize(28),
        fontFamily: 'OpenSans-Bold',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    dayTitle: {
        fontSize: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
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
