import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';

import DaysOfWeek from './DaysOfWeek';
import DisplayExerciseBox from './DisplayExerciseBox';

const DisplayWorkoutDay = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
        dayIndex: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            days: this.props.workout_day.days ? this.props.workout_day.days : [],
            showDetails: false
        }
    },

    _toggleShow() {
        Keyboard.dismiss();
        this.setState({showDetails: !this.state.showDetails});
    },


    render: function () {
        let exercises = null;
        // console.log(this.props.workout_day)

        // const res = _.reduce(this.props.workout_day.sets, function(result, set){
        //     return _.reduce(set.productInfo.categories, function(acc, category){
        //         (acc[category] || (acc[category] = [])).push(set);
        //         return acc;
        //     }, result);
        // }, {});

        // const result = _.chain(this.props.workout_day.sets)
        //     .groupBy("exercise")
        //     // .pairs()
        //     .map(function(currentItem) {
        //         return _.zip(["exercise"], currentItem);
        //     })
        //     .value();
        // console.log(result)
        // if (this.state.showDetails) {
        //     exercises = this.props.workout_day.exercises.map((exercise, index) => {
        //         if (exercise.name && exercise.sets.length > 0) {
        //             return <DisplayExerciseBox key={index} exercise={exercise} exerciseIndex={index}/>
        //         }
        //     });
        // }
        return (
            <TouchableOpacity onPress={this._toggleShow} style={styles.displayWorkoutBox}>
                <Text style={styles.simpleTitle}>{this.props.workout_day.name}</Text>
                <DaysOfWeek daySelectedState={(days) => this.setState({days: days})} days={this.state.days} cantEdit={true}/>
            </TouchableOpacity>
        )
    }
});


const styles = StyleSheet.create({
    displayWorkoutBox: {
        flex: 1,
        // alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#e1e3df',
    },
    simpleTitle: {
        fontSize: getFontSize(22),
        // color: '#b1aea5',
        fontFamily: 'OpenSans-Semibold',
        margin: 10,
        textAlign: 'center'
    },
});


export default DisplayWorkoutDay;
