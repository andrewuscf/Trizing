import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    ScrollView,
    View,
    StyleSheet,
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import {connect} from 'react-redux';


import {fetchData, API_ENDPOINT, getFontSize, checkStatus} from '../../actions/utils';

import DisplayWorkoutDay from '../../components/DisplayWorkoutDay';
import Loading from '../../components/Loading';


const WorkoutDetail = CreateClass({
    propTypes: {
        workoutId: PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            workout: null,
            refreshing: false
        }
    },

    componentDidMount() {
        this.getWorkout();
    },


    getWorkout(refresh) {
        if (refresh) this.setState({refreshing: true});

        fetch(`${API_ENDPOINT}training/workout/${this.props.workoutId}/`,
            fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {

                let newState = {refreshing: false};
                if (responseJson.id) {
                    newState = {
                        ...newState,
                        workout: responseJson
                    }
                }
                this.setState(newState);
            }).catch((error) => {
            console.log(error)
        });
    },


    _toWorkoutDay(workout_day_id) {
        // WorkoutDayDetail needs to be created
        this.props.navigation.navigate('WorkoutDayDetail', {workout_day_id: workout_day_id});
    },


    render: function () {
        if (!this.state.workout) return <Loading/>;
        const todayDay = moment().isoWeekday();
        let workout_days = this.state.workout.workout_days.map((workout_day, index) => {
            return <DisplayWorkoutDay key={index} _toWorkoutDay={this._toWorkoutDay.bind(null, workout_day.id)}
                                      workout_day={workout_day}
                                      dayIndex={index} active={_.includes(workout_day.days, todayDay)}/>
        });
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false}>
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
        fontFamily: 'Heebo-Bold',
    }
});

const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken,
    };
};


export default connect(stateToProps, null)(WorkoutDetail);

