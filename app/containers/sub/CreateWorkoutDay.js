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
import Icon from 'react-native-vector-icons/FontAwesome';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as GlobalActions from '../../actions/globalActions';

import {getFontSize, API_ENDPOINT} from '../../actions/utils';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import DisplayExerciseBox from '../../components/DisplayExerciseBox';
import DaysOfWeek from '../../components/DaysOfWeek';
import SubmitButton from '../../components/SubmitButton';

const CreateWorkoutDay = React.createClass({
    propTypes: {
        workout: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            name: null,
            days: [],
            exercises: [],
            workout: this.props.workout.id
            // id: null
        }
    },

    componentDidMount() {
        if (this.refs.day_name)
            this.refs.day_name.focus()
    },

    asyncActions(start, data = {}){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            if (data.state) {
                this.setState({...data.state})
            }
            if (data.routeName) {
                this.props.navigator.replace(getRoute(data.routeName, data.props))
            }
        }
    },


    _deleteExercise(index) {
        Keyboard.dismiss();
        if (this.state.exercises.length > 1) {
            this.setState({
                exercises: this.state.exercises.slice(0, index).concat(this.state.exercises.slice(index + 1))
            })
        }
    },


    _addExercise() {
        if (this.state.name) {
            this.props.actions.updateWorkoutDay(this.state, this.asyncActions)
        }
    },

    _save() {
        this.props.actions.updateWorkoutDay(this.state);
        this.props.navigator.pop();
    },

    render: function () {
        const exercises = this.state.exercises.map((exercise, index) => {
            return <DisplayExerciseBox key={index} exercise={exercise} exerciseIndex={index}/>
        });
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this.props.navigator.pop} backText="" navStyle={{height: 40}}>
                    <Text>{this.state.workout ? this.state.workout.name : null}</Text>
                    <TouchableOpacity style={styles.save} onPress={this._save}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                </BackBar>


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
                <Text style={styles.inputLabel}>What days?</Text>
                <DaysOfWeek daySelectedState={(days) => this.setState({days: days})} days={this.state.days}/>
                <Text style={styles.inputLabel}>Exercises</Text>
                {exercises}

                <SubmitButton buttonStyle={styles.button}
                              textStyle={styles.submitText} onPress={this._addExercise} ref='postbutton'
                              text='Add Exercise'/>
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

