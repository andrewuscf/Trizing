import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';

import DisplaySetBox from './DisplaySetBox';


const DisplayExerciseBox = React.createClass({
    propTypes: {
        exercise: React.PropTypes.object.isRequired,
        _editExercise: React.PropTypes.func
    },

    _redirect: function () {
        Keyboard.dismiss();
        if (this.props._editExercise)
            this.props._editExercise(this.props.exercise);
    },

    onEdit(){

    },


    render: function () {
        return (
            <TouchableOpacity style={styles.displayWorkoutBox} onPress={this._redirect}>
                <Text style={styles.simpleTitle}>{this.props.exercise.name}</Text>
                <TouchableOpacity style={styles.edit}>
                    <Icon name="ellipsis-v" size={20} color="#8E8E8E"/>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
});


const styles = StyleSheet.create({
    displayWorkoutBox: {
        marginBottom: 0,
        borderTopWidth: 1,
        borderColor: '#e1e3df',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'

    },
    simpleTitle: {
        fontSize: getFontSize(22),
        fontFamily: 'OpenSans-Semibold',
        margin: 10,
    },
    edit: {
        margin: 20,
    },
});


export default DisplayExerciseBox;
