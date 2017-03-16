import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';

import SetBox from './SetBox';

const ExerciseBox = React.createClass({
    propTypes: {
        exercise: React.PropTypes.object.isRequired,
        exerciseIndex: React.PropTypes.number.isRequired,
        getExerciseState: React.PropTypes.func.isRequired,
    },

    _exerciseNameChange(text) {
        this.props.getExerciseState(this.props.exerciseIndex, {name: text})
    },

    setSetState(index, state) {
        let sets = this.props.exercise.sets;
        sets[index] = {
            ...sets[index],
            ...state
        };
        this.props.getExerciseState(this.props.exerciseIndex, {sets: sets})
    },


    // addDay() {
    //     Keyboard.dismiss();
    //     this.setState({
    //         sets: [
    //             ...this.state.sets,
    //             BlankSet
    //         ]
    //     });
    // },
    //
    // removeDay(index) {
    //     Keyboard.dismiss();
    //     if (this.state.sets.length > 1) {
    //         this.setState({
    //             sets: this.state.sets.slice(0, index).concat(this.state.sets.slice(index + 1))
    //         })
    //     }
    // },


    render: function () {
        const sets = this.props.exercise.sets.map((set, index) => {
            return <SetBox key={index} set={set} setIndex={index} setSetState={this.setSetState}/>
        });
        return (
            <View>
                <Text style={styles.inputLabel}>Exercise Name</Text>
                <View style={[styles.inputWrap]}>
                    <TextInput ref='name'
                               style={[styles.textInput]}
                               multiline={true}
                               underlineColorAndroid='transparent'
                               autoCapitalize='words'
                               placeholderTextColor='#4d4d4d'
                               onChangeText={this._exerciseNameChange}
                               value={this.props.exercise.name}
                               placeholder="'Bench Press'"/>
                </View>
                {sets}
            </View>
        )
    }
});


const styles = StyleSheet.create({
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
    }
});


export default ExerciseBox;
