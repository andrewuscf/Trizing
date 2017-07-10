import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Alert
} from 'react-native';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import t from 'tcomb-form-native';

import * as GlobalActions from '../../actions/globalActions';

import {getFontSize} from '../../actions/utils';

import DaysOfWeek from '../../components/DaysOfWeek';


const Form = t.form.Form;
const WorkoutDay = t.struct({
    name: t.String,
});

let options = {
    auto: 'placeholders',
    i18n: {
        optional: '',
        required: '*',
    },
    fields: {
        name: {
            placeholder: `Pull Day, Monday, etc...`,
            autoCapitalize: 'words',
        }
    }
};

const CreateWorkoutDay = React.createClass({
    propTypes: {
        workoutId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        const schedule = _.find(this.props.Schedules, {workouts: [{id: this.props.workoutId}]});
        const workout = _.find(schedule.workouts, {id: this.props.workoutId});
        return {
            value: null,
            days: [],
            workout: workout
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._addExercise});
    },


    componentDidUpdate(prevProps, prevState) {
        if (this.props.Schedules !== prevProps.Schedules) {
            const schedule = _.find(this.props.Schedules, {workouts: [{id: this.props.workoutId}]});
            const workout = _.find(schedule.workouts, {id: this.props.workoutId});
            this.setState({workout: workout});
        }
    },

    asyncActions(start, data = {}){
        if (!start && data.routeName) {
            this.props.navigation.dispatch({
                type: 'ReplaceCurrentScreen',
                routeName: data.routeName,
                params: data.props,
                key: data.routeName
            });
        }
    },

    _addExercise() {
        let values = this.refs.form.getValue();
        if (values) {
            if (this.state.days.length) {
                const data = {
                    name: values.name,
                    day: this.state.days[0],
                    workout: this.state.workout.id
                }
                this.props.actions.addEditWorkoutDay(data, this.asyncActions)
            } else {

            }
        }
    },

    selectDay(days) {
        if (days.length > 1) {
            this.setState({days: [days[1]]});
        } else {
            this.setState({days: [days[0]]});
        }
    },

    onChange(value) {
        this.setState({value});
    },

    render: function () {
        return (
            <View style={styles.flexCenter}>
                <View style={{padding: 10}}>
                    <Text style={styles.inputLabel}>Name of Day</Text>
                    <Form
                        ref="form"
                        type={WorkoutDay}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </View>
                <Text style={styles.inputLabel}>Day of the week</Text>
                <DaysOfWeek daySelectedState={this.selectDay} days={this.state.days}/>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    save: {
        position: 'absolute',
        top: 20,
        right: 10
    },
    inputLabel: {
        fontSize: getFontSize(30),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    },
});

const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateWorkoutDay);

