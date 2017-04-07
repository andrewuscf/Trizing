import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
import {getRoute} from '../../routes';
import GlobalStyle from '../../containers/globalStyle';

import BackBar from '../../components/BackBar';
import SubmitButton from '../../components/SubmitButton';

import CreateWorkoutDay from '../sub/CreateWorkoutDay';


const EditSchedule = React.createClass({
    propTypes: {
        scheduleId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        const schedule = _.find(this.props.Schedules, {id: this.props.scheduleId});
        return {
            schedule: schedule
        }
    },

    asyncActions(start){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            // this.props.navigator.pop();
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Schedules != prevProps.Schedules) {
            const schedule = _.find(this.props.Schedules, {id: this.props.scheduleId});
            this.setState({schedule: schedule});
        }
    },

    _createWorkoutDay() {
        if (this.state.schedule) {
            this.props.navigator.push(getRoute('CreateWorkout', {scheduleId: this.props.scheduleId}))
        }
    },

    _toWorkoutDay(workoutId) {
        this.props.navigator.push(getRoute('EditWorkout', {workoutId: workoutId}))
    },


    render: function () {
        let steps = <Text>No Program blocks</Text>;
        if (this.state.schedule) {
            steps = this.state.schedule.workouts.map((workout, index) => {
                return <TouchableOpacity key={index} onPress={this._toWorkoutDay.bind(null, workout.id)}
                                         style={[GlobalStyle.simpleBottomBorder, styles.workoutBox, (index == 0) ? {marginTop: 5} : null]}>
                    <Text>{workout.name}</Text>
                </TouchableOpacity>
            });
        }
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this.props.navigator.pop} backText="" navStyle={{height: 40}}>
                    <Text>{this.state.schedule ? this.state.schedule.name : null}</Text>
                </BackBar>

                <View style={{marginBottom: 10}}>
                    {steps}
                </View>

                <SubmitButton buttonStyle={styles.button}
                              textStyle={styles.submitText} onPress={this._createWorkoutDay} ref='postbutton'
                              text='Create a Workout'/>


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
        padding: 10
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

export default connect(stateToProps, dispatchToProps)(EditSchedule);
