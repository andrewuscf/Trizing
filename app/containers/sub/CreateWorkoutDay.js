import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';

import * as GlobalActions from '../../actions/globalActions';

import {getFontSize} from '../../actions/utils';

import DaysOfWeek from '../../components/DaysOfWeek';

const CreateWorkoutDay = React.createClass({
    propTypes: {
        workoutId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        const schedule = _.find(this.props.Schedules, {workouts: [{id: this.props.workoutId}]});
        const workout = _.find(schedule.workouts, {id: this.props.workoutId});
        return {
            name: null,
            days: [],
            workout: workout,
            saved: false
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._addExercise, saveText: 'Next'});
    },


    componentDidUpdate(prevProps, prevState) {
        if (this.props.Schedules != prevProps.Schedules) {
            const schedule = _.find(this.props.Schedules, {workouts: [{id: this.props.workoutId}]});
            const workout = _.find(schedule.workouts, {id: this.props.workoutId});
            this.setState({workout: workout});
        }
    },

    asyncActions(start, data = {}){
        if (start) {
            // Fail
        } else {
            this.props.navigation.goBack()
        }
    },

    getCurrentData() {
        return {
            name: this.state.name,
            days: this.state.days,
            workout: this.state.workout.id
        };
    },


    _addExercise() {
        if (this.state.name && !this.state.saved && this.state.days.length) {
            this.props.actions.addEditWorkoutDay(this.getCurrentData(), this.asyncActions)
            this.setState({saved: true});
        }
    },

    _save() {
        if (!this.state.saved) {
            this.props.actions.addEditWorkoutDay(this.getCurrentData());
        }
        this.props.navigation.goBack();
    },

    selectDay(days) {
        if (days.length < 2) {
            this.setState({days: days});
        }
    },

    render: function () {
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.contentContainerStyle}>

                <Text style={styles.inputLabel}>Name of Day</Text>
                <View style={[styles.inputWrap]}>
                    <TextInput ref='day_name'
                               style={[styles.textInput]}
                               multiline={true}
                               underlineColorAndroid='transparent'
                               autoCapitalize='sentences'
                               placeholderTextColor='#4d4d4d'
                               onChangeText={(text) => this.setState({name: text})}
                               value={this.state.name}
                               placeholder="'Pull day, 'Monday' or 'Day One'"/>
                </View>
                <Text style={styles.inputLabel}>Day of the week</Text>
                <DaysOfWeek daySelectedState={(days) => this.selectDay(days)} days={this.state.days}/>
            </ScrollView>
        )
    }
});


const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    contentContainerStyle: {
        // flex: 1
    },
    save: {
        position: 'absolute',
        top: 20,
        right: 10
    },
    inputWrap: {
        flex: 1,
        marginBottom: 12,
        height: 30,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    textInput: {
        color: 'black',
        fontSize: 17,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        height: 30,
        textAlign: 'center'
    },
    inputLabel: {
        fontSize: getFontSize(30),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    },
    addExerciseStyle: {
        height: 35,
        marginTop: 5,
        marginBottom: 8,
        color: '#b1aea5',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'OpenSans-Semibold',
        alignSelf: 'center',
        textDecorationLine: 'underline',
        textDecorationColor: '#b1aea5'
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
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

