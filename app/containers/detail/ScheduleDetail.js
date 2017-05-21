import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import moment from 'moment';

import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../../containers/globalStyle';

import BackBar from '../../components/BackBar';


const ScheduleDetail = React.createClass({
    propTypes: {
        schedule: React.PropTypes.object.isRequired,
    },

    _toWorkoutDay(workout) {
        this.props.navigation.navigate('WorkoutDetail', {workout: workout});
    },

    _back() {
        this.props.navigation.goBack()
    },


    render: function () {
        const today = moment();
        let steps = _.orderBy(this.props.schedule.workouts, ['order']).map((workout, index) => {
            let start_date = moment.utc(workout.dates.start_date).local();
            const is_active = today.isAfter(workout.dates.start_date) && today.isBefore(workout.dates.end_date);
            return <TouchableOpacity key={index} onPress={this._toWorkoutDay.bind(null, workout)}
                                     style={[GlobalStyle.simpleBottomBorder,
                                         styles.workoutBox, (index == 0) ? {marginTop: 5} : null,
                                         is_active ? {borderColor: 'green', borderTopWidth: 1}: null]}>

                {this.props.schedule.training_plan ?
                    <View style={styles.eventDate}>
                        <Text style={styles.eventDateMonth}>{start_date.format("MMM").toUpperCase()}</Text>
                        <Text style={styles.eventDateDay}>{start_date.date()}</Text>
                    </View>
                    : <View style={styles.eventDate}>
                        <Text style={styles.eventDateMonth}>Weeks</Text>
                        <Text style={styles.eventDateDay}>{workout.duration}</Text>
                    </View>
                }
                <Text style={styles.eventDateDay}>{workout.name}</Text>
            </TouchableOpacity>
        });
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this._back}>
                    <Text>{this.props.schedule ? this.props.schedule.name : null}</Text>
                </BackBar>

                <View style={{marginBottom: 10}}>
                    {steps}
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
    },
    workoutBox: {
        backgroundColor: 'white',
        marginBottom: 5,
        padding: 10,
        flexDirection: 'row'
    },
    eventDateDay: {
        fontFamily: 'OpenSans-Bold',
        fontSize: getFontSize(26),
        color: '#4d4d4e'
    },
    eventDateMonth: {
        fontFamily: 'OpenSans-Bold',
        fontSize: getFontSize(14),
        backgroundColor: 'transparent',
        color: '#4d4d4e'
    },
    eventDate: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default ScheduleDetail;
