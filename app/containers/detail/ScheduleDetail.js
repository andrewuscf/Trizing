import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';

import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../../containers/globalStyle';


const ScheduleDetail = CreateClass({
    propTypes: {
        schedule: PropTypes.object.isRequired,
    },

    _toWorkoutDay(workout) {
        this.props.navigation.navigate('WorkoutDetail', {workoutId: workout.id});
    },

    render: function () {
        const today = moment();
        let steps = _.orderBy(this.props.schedule.workouts, ['order']).map((workout, index) => {
            let start_date = moment.utc(workout.dates.start_date).local();
            let end_date = moment.utc(workout.dates.end_date).local();
            const is_active = today.isSameOrAfter(start_date, 'day') && today.isBefore(end_date, 'day');
            return <TouchableOpacity key={index} onPress={this._toWorkoutDay.bind(null, workout)}
                                     style={[GlobalStyle.simpleBottomBorder,
                                         styles.workoutBox, (index == 0) ? {marginTop: 5} : null,
                                         is_active ? {borderColor: 'green', borderTopWidth: 1} : null]}>

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
                        contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false}>

                <View style={{marginBottom: 10}}>
                    {steps}
                </View>


            </ScrollView>
        )
    }
});

ScheduleDetail.navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    return {
        headerTitle: state.params && state.params.schedule ?
            state.params.schedule.name
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
        fontFamily: 'Heebo-Bold',
    },
    workoutBox: {
        backgroundColor: 'white',
        marginBottom: 5,
        padding: 10,
        flexDirection: 'row'
    },
    eventDateDay: {
        fontFamily: 'Heebo-Bold',
        fontSize: getFontSize(26),
        color: '#4d4d4e'
    },
    eventDateMonth: {
        fontFamily: 'Heebo-Bold',
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
