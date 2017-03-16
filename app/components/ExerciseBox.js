import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';

import SetBox from './SetBox';

const ExerciseBox = React.createClass({
    propTypes: {
        exercise: React.PropTypes.object.isRequired,
        exerciseIndex: React.PropTypes.number.isRequired,
        getExerciseState: React.PropTypes.func.isRequired,
        _addSet: React.PropTypes.func,
        _deleteSet: React.PropTypes.func,
        _deleteExercise: React.PropTypes.func
    },

    getInitialState() {
        return {
            showSets: false,
            iconColor: '#a7a59f',
            fetchedUsers: []
        }
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

    _deleteExercise() {
        Keyboard.dismiss();
        Alert.alert(
            'Delete Exercise',
            `Are you sure you want delete this exercise?`,
            [
                {text: 'Cancel', null, style: 'cancel'},
                {text: 'Delete', onPress: () => this.props._deleteExercise(this.props.exerciseIndex)},
            ]
        );
    },


    onFocus() {
        this.setState({
            iconColor: '#797979'
        });
    },

    clickCancel: function () {
        this.setState({
            iconColor: '#a7a59f',
        });
    },

    _toggleShow: function () {
        this.setState({
            showSets: !this.state.showSets,
        });
    },


    render: function () {
        const sets = this.props.exercise.sets.map((set, index) => {
            if (this.props.exercise.sets.length > 1)
                return <SetBox key={index} set={set} setIndex={index} setSetState={this.setSetState}
                               _deleteSet={this.props._deleteSet.bind(null, this.props.exerciseIndex, index)}/>
            else
                return <SetBox key={index} set={set} setIndex={index} setSetState={this.setSetState}/>
        });
        return (
            <View style={styles.exerciseContainer}>
                <View style={styles.subNav}>
                    <TouchableOpacity onPress={this._toggleShow}>
                        {!this.state.showSets ?
                            <Icon name="angle-down" size={20} color="red"/> :
                            <Icon name="angle-up" size={20} color="red"/>
                        }
                    </TouchableOpacity>
                    <TextInput
                        ref="name"
                        style={[styles.filterInput]}
                        underlineColorAndroid='transparent'
                        autoCapitalize='words'
                        autoCorrect={false}
                        placeholderTextColor='#a7a59f'
                        onChangeText={this._exerciseNameChange}
                        value={this.props.exercise.name}
                        onFocus={this.onFocus}
                        placeholder="Enter exercise name"
                    />
                    {typeof this.props._deleteExercise === "function" ?
                        <TouchableOpacity onPress={this._deleteExercise}>
                            <Icon name="times" size={20} color="red"/>
                        </TouchableOpacity>
                        : null
                    }
                </View>
                {this.state.showSets ?
                    <View>
                        {sets}
                        {typeof this.props._addSet === "function" ?
                            <TouchableOpacity onPress={this.props._addSet.bind(null, this.props.exerciseIndex)}>
                                <Text style={styles.addSetStyle}>Add Set</Text>
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                    : null
                }
            </View>
        )
    }
});


const styles = StyleSheet.create({
    exerciseContainer: {
        marginTop: 10,
        borderColor: '#e1e3df',
        borderWidth: 1,
    },
    filterInput: {
        flex: 1,
        width: 105,
        color: '#797979',
        fontSize: 14,
        fontFamily: 'OpenSans-Semibold',
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingLeft: 5
    },
    subNav: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
    },
    edit: {
        position: 'absolute',
        right: 0,
        top: 5
    },
    addSetStyle: {
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
});


export default ExerciseBox;
