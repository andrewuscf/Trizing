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


    render: function () {
        return (
            <TouchableOpacity style={styles.displayWorkoutBox} onPress={this._redirect}>
                <Text style={styles.simpleTitle}>{this.props.exercise.name}</Text>
                <TouchableOpacity style={styles.edit}>
                    <Icon name="pencil" size={20} color="black"/>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
});

// {this.state.showSets ?
//     this.props.exercise.sets.map((set, index) => {
//         return <DisplaySetBox set={set} setIndex={index} key={index}/>
//     })
//     : null
// }


const styles = StyleSheet.create({
    displayWorkoutBox: {
        margin: 5,
        marginBottom: 0,
        borderWidth: 0.5,
        borderColor: '#e1e3df',
        borderRadius: 8,
        backgroundColor: 'white',
        minHeight: 50,
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
        margin: 10,
    },
});


export default DisplayExerciseBox;
