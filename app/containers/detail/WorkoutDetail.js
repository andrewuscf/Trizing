import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import moment from 'moment';

import {getFontSize} from '../../actions/utils';

import BackBar from '../../components/BackBar';
import DisplayWorkoutDay from '../../components/DisplayWorkoutDay';

const WorkoutDetail = React.createClass({
    propTypes: {
        workout: React.PropTypes.object.isRequired,
    },


    _toWorkoutDay(workout_day_id) {
        // if (this.props.workout) {
        //     this.props.navigation.navigate('WorkoutDayDetail', {workout_day_id: workout_day_id});
        // }
    },

    _back() {
        this.props.navigation.goBack()
    },


    render: function () {
        const todayDay = moment().isoWeekday();
        let workout_days = this.props.workout.workout_days.map((workout_day, index) => {
            return <DisplayWorkoutDay key={index} _toWorkoutDay={this._toWorkoutDay} workout_day={workout_day}
                                      dayIndex={index} active={_.includes(workout_day.days, todayDay)}/>
        });
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this._back}>
                    <Text>{this.props.workout ? this.props.workout.name : null}</Text>
                </BackBar>

                <View style={{marginBottom: 10}}>
                    {workout_days}
                </View>

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

export default WorkoutDetail;
