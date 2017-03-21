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
        showSets: React.PropTypes.bool
    },

    getInitialState() {
        return {
            showSets: this.props.showSets ? this.props.showSets : false
        }
    },


    _toggleShow: function () {
        Keyboard.dismiss();
        this.setState({
            showSets: !this.state.showSets,
        });
    },


    render: function () {
        console.log(this.state)
        return (
            <TouchableOpacity style={styles.displayWorkoutBox} onPress={this._toggleShow}>
                <Text style={styles.simpleTitle}>{this.props.exercise.name}</Text>
                {this.state.showSets ?
                    this.props.exercise.sets.map((set, index) => {
                        return <DisplaySetBox set={set} setIndex={index} key={index}/>
                    })
                    : null
                }
            </TouchableOpacity>
        )
    }
});


const styles = StyleSheet.create({
    displayWorkoutBox: {
        borderTopWidth: 0.5,
        borderColor: '#e1e3df',
    },
    simpleTitle: {
        fontSize: getFontSize(22),
        fontFamily: 'OpenSans-Semibold',
        margin: 5,
        alignSelf: 'center'
    },
});


export default DisplayExerciseBox;
