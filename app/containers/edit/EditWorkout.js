import React from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Alert,
    ListView,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
import moment from 'moment';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../../containers/globalStyle';

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


    renderHeader() {
        const workout = this.state.workout;
        const created = moment.utc(workout.created_at).local().format('MMMM DD YYYY');
        return (
            <View style={[GlobalStyle.simpleBottomBorder, styles.headerContainer]}>
                <Text style={styles.smallBold}>Duration:
                    <Text style={styles.notBold}> {workout.duration} {workout.duration == 1 ? 'week': 'weeks'}</Text>
                </Text>
                <Text style={styles.smallBold}>Created: <Text style={styles.notBold}>{created}</Text></Text>
            </View>
        )
    },

    renderRow(workout_day, index) {
        const intIndex = parseInt(index);
        return <DisplayWorkoutDay key={intIndex} _toWorkoutDay={this._toWorkoutDay} workout_day={workout_day}
                                  dayIndex={intIndex}/>
    },

    renderFooter(rowCount) {
        if (rowCount !== 0) return null;
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                <MaterialIcon name="today" style={[styles.notBold, {fontSize: getFontSize(50), paddingBottom: 20}]}/>
                <Text style={[styles.notBold, {fontSize: getFontSize(28)}]}>Get started by</Text>
                <Text style={[styles.notBold, {fontSize: getFontSize(28)}]}>creating workout days</Text>
            </View>
        )
    },


    render: function () {
        let workout_days = [];
        if (this.state.workout && this.state.workout.workout_days.length) {
            workout_days = _.orderBy(this.state.workout.workout_days, (workout_day) => {
                return workout_day.day
            });
        }
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(workout_days);
        return (
            <View style={{flex: 1, backgroundColor: '#f1f1f3'}}>
                <ListView removeClippedSubviews={(Platform.OS !== 'ios')}
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator={false}
                          style={[styles.flexCenter]}
                          contentContainerStyle={{paddingBottom: 20}}
                          enableEmptySections={true}
                          dataSource={dataSource}
                          renderHeader={this.renderHeader}
                          renderRow={this.renderRow}
                          renderFooter={this.renderFooter.bind(null, dataSource.getRowCount())}
                />
                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                    <ActionButton.Item buttonColor='#F22525' title="Delete" onPress={this._deleteWorkout}>
                        <MaterialIcon name="delete-forever" color="white" size={22}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Add Note" onPress={() => console.log('add note')}>
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
        // margin: 10
    },
    title: {
        fontSize: getFontSize(28),
        fontFamily: 'OpenSans-Bold',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'white'
    },
    smallBold: {
        fontSize: getFontSize(18),
        fontFamily: 'OpenSans-Bold',
        paddingLeft: 10,
        paddingBottom: 5
    },
    notBold: {
        color: 'grey',
        fontFamily: 'OpenSans-Semibold',
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
