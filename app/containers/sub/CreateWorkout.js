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
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../../actions/utils';

import BackBar from '../../components/BackBar';
import SubmitButton from '../../components/SubmitButton';

import WorkoutDay from '../../components/WorkoutDay';


var CreateWorkout = React.createClass({
    propTypes: {
        closeWorkoutModal: React.PropTypes.func.isRequired,
        createWorkout: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            Error: null,
            name: null,
            tab: 1,
            workout_days: [
                {name: null, days: []}
            ],
        }
    },

    asyncActions(start){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            this.props.closeWorkoutModal();
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
            var data = {
                name: this.state.name,
                workout_days: this.state.workout_days,

            };
            this.props.createWorkout(data, this.asyncActions)
        }
    },

    getDayState(dayIndex, state) {
        let workout_days = this.state.workout_days;
        workout_days[dayIndex] = {
            ...workout_days[dayIndex],
            ...state
        };
        this.setState({workout_days: workout_days});
    },

    addDay() {
        Keyboard.dismiss();
        this.setState({
            workout_days: [
                ...this.state.workout_days,
                {name: null, days: []}
            ]
        });
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
        // this.props.closeWorkoutModa
        Alert.alert(
            'Are you sure you want to cancel?',
            'Your current step will not be saved',
            [
                {text: 'No', null, style: 'cancel'},
                {text: 'Yes', onPress: () => this.props.closeWorkoutModal()},
            ]
        );
    },

    _nextStep() {
        if (this.isValid())
            this.setState({tab: this.state.tab + 1});
    },

    _prevStep() {
        if (this.state.tab != 1)
            this.setState({tab: this.state.tab - 1});
    },

    renderContent() {
        switch (this.state.tab) {
            case 1:
                return (
                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>Workout Name</Text>
                        <View style={styles.inputWrap}>
                            <TextInput ref="name" style={styles.textInput} autoCapitalize='sentences'
                                       underlineColorAndroid='transparent'
                                       autoCorrect={false}
                                       onChangeText={(text)=>this.setState({name: text})}
                                       value={this.state.name}
                                       placeholderTextColor="#4d4d4d"
                                       placeholder="Cutting"/>
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.formContainer}>
                        {this.state.workout_days.map((workout_day, index)=> {
                            return <WorkoutDay key={index} dayIndex={index} workout_day={workout_day}
                                               getDayState={this.getDayState}/>
                        })}
                    </View>

                )
        }
    },


    render: function () {
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="never"
                        contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this._cancel} backText="Cancel" navStyle={{height: 40}}/>

                {this.renderContent()}

                <View style={{flexDirection: 'row'}}>
                    <TouchableHighlight style={{flex:1}} onPress={this._prevStep} underlayColor='transparent'>
                        <Text style={styles.addDay}>Prev Step</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex:1}} onPress={this._nextStep} underlayColor='transparent'>
                        <Text style={styles.addDay}>Next Step</Text>
                    </TouchableHighlight>
                </View>

            </ScrollView>
        )
    }
});
{/*<SubmitButton buttonStyle={[styles.submitButton]}*/
}
{/*textStyle={[styles.cancel, this.isValid() ? styles.blueText : null]}*/
}
{/*onPress={this._onSubmit} ref='postbutton'*/
}
{/*text='Submit'/>*/
}

{/*<TouchableHighlight onPress={this.addDay} underlayColor='transparent'>*/
}
{/*<Text style={styles.addDay}>Add Workout Day</Text>*/
}
{/*</TouchableHighlight>*/
}


var styles = StyleSheet.create({
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
    formContainer: {
        margin: 10,
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
        fontSize: 18,
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


export default CreateWorkout;
