import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Keyboard
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';

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


    render: function () {
        const todayDay = moment().isoWeekday();
        let workout_days = this.props.workout.workout_days.map((workout_day, index) => {
            return <DisplayWorkoutDay key={index} _toWorkoutDay={this._toWorkoutDay} workout_day={workout_day}
                                      dayIndex={index} active={_.includes(workout_day.days, todayDay)}/>
        });
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.contentContainerStyle}>
                <View style={{marginBottom: 10}}>
                    {workout_days}
                </View>

            </ScrollView>
        )
    }
});

WorkoutDetail.navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    return {
        headerTitle: state.params && state.params.workout ?
            state.params.workout.name
            : null,
    };
};

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
