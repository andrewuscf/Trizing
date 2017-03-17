import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Alert,
    TextInput,
    TouchableHighlight,
    Keyboard
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';

import BackBar from '../../components/BackBar';
import SubmitButton from '../../components/SubmitButton';

import CreateWorkoutDay from '../../components/CreateWorkoutDay';
import DisplayWorkoutDay from '../../components/DisplayWorkoutDay';


const BlankWorkout = {
    name: null,
    days: [],
    exercises: [],
};

const CreateWorkout = React.createClass({

    getInitialState() {
        return {
            Error: null,
            name: null,
            tab: 0,
            workout_days: [],
            showCreate: false
        }
    },

    asyncActions(start){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            this.props.navigator.pop();
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.state.Error) {
            Alert.alert(
                this.state.Error,
                this.state.Error,
                [
                    {text: 'OK', onPress: () => this.setState({Error: null})},
                ]
            );
        }
    },

    isValid() {
        if (this.state.tab == 1) {
            return !!this.state.name
        }
        return this.state.name && this.state.workout_days[0] && this.state.workout_days[0].name
    },


    _onSubmit() {
        if (this.isValid()) {
            const data = {
                name: this.state.name,
                workout_days: this.state.workout_days,

            };
            this.props.actions.createWorkout(data, this.asyncActions)
        }
    },

    getDayState(dayIndex, state) {
        let workout_days = this.state.workout_days;
        workout_days[dayIndex] = {
            ...workout_days[dayIndex],
            ...state
        };
        this.setState({workout_days: workout_days, showCreate: !this.state.showCreate});
    },

    removeDay(index) {
        Keyboard.dismiss();
        if (this.state.workout_days.length > 1) {
            this.setState({
                workout_days: this.state.workout_days.slice(0, index).concat(this.state.workout_days.slice(index + 1))
            })
        }
    },

    _cancel() {
        Alert.alert(
            'Are you sure you want to cancel?',
            'Your current step will not be saved',
            [
                {text: 'No', null, style: 'cancel'},
                {text: 'Yes', onPress: () => this.props.navigator.pop()},
            ]
        );
    },


    _createDay() {
        let workout_days = _.filter(this.state.workout_days, (workout_day) => {
            if (workout_day.name && workout_day.days && workout_day.days.length > 0)
                return workout_day
        });
        this.setState({tab: 1, workout_days: workout_days.concat(BlankWorkout)});
    },

    _toggleShow() {
        this.setState({showCreate: !this.state.showCreate})
    },


    render: function () {
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this._cancel} backText="Cancel" navStyle={{height: 40}}/>

                {this.state.showCreate ?
                    <CreateWorkoutDay dayIndex={this.state.workout_days.length} workout_day={BlankWorkout}
                                      getDayState={this.getDayState}/>
                    :
                    <View>
                        <Text style={styles.inputLabel}>Program Name</Text>
                        <View style={styles.inputWrap}>
                            <TextInput ref="name" style={styles.textInput} autoCapitalize='sentences'
                                       underlineColorAndroid='transparent'
                                       autoCorrect={false}
                                       onChangeText={(text) => this.setState({name: text})}
                                       value={this.state.name}
                                       placeholderTextColor="#4d4d4d"
                                       placeholder="Cutting"/>
                        </View>
                        <Text style={styles.inputLabel}>Workouts</Text>
                        <View style={GlobalStyle.simpleBottomBorder}>
                            {this.state.workout_days.map((workout_day, index) => {
                                if (workout_day.name && workout_day.days && workout_day.days.length > 0)
                                    return <DisplayWorkoutDay key={index} dayIndex={index} workout_day={workout_day}/>
                            })}
                        </View>
                        <TouchableHighlight style={{flex: 1}} onPress={this._toggleShow} underlayColor='transparent'>
                            <Text style={styles.addDay}>Create workout</Text>
                        </TouchableHighlight>
                    </View>
                }


            </ScrollView>
        )
    }
});

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    submitButton: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    cancel: {
        color: '#d4d4d4',
    },
    blueText: {
        color: '#00BFFF'
    },
    inputWrap: {
        flex: 1,
        marginBottom: 12,
        // minHeight: 100,
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
        minHeight: 50,
        textAlign: 'center',
        flex: 1
    },
    inputLabel: {
        fontSize: getFontSize(25),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    },
    addDay: {
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
        textDecorationColor: '#b1aea5',
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

export default connect(stateToProps, dispatchToProps)(CreateWorkout);
