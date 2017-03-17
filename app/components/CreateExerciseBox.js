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

import CreateSetBox from './CreateSetBox';

const BlankSet = {reps: null, weight: null};

const CreateExerciseBox = React.createClass({
    propTypes: {
        exercise: React.PropTypes.object.isRequired,
        exerciseIndex: React.PropTypes.number.isRequired,
        getExerciseState: React.PropTypes.func.isRequired,
        _deleteExercise: React.PropTypes.func
    },

    getInitialState() {
        return {
            showSets: true,
            fetchedExercises: [],
            name: this.props.exercise.name ? this.props.exercise.name : null,
            sets: this.props.exercise.sets ? this.props.exercise.sets : [BlankSet],
        }
    },

    _addSet() {
        Keyboard.dismiss();
        this.setState({sets:  [
            ...this.state.sets,
            BlankSet
        ]});
    },

    _deleteSet(setIndex) {
        Keyboard.dismiss();
        this.setState({sets: this.state.sets.slice(0, setIndex).concat(this.state.sets.slice(setIndex + 1))});
    },

    _exerciseNameChange(text) {
        this.setState({name: text});
    },

    setSetState(index, state) {
        let sets = this.state.sets;
        sets[index] = {
            ...sets[index],
            ...state
        };
        this.setState({sets: sets});
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


    _toggleShow: function () {
        this.setState({
            showSets: !this.state.showSets,
        });
    },

    _save() {
        this.props.getExerciseState(this.props.exerciseIndex, this.state)
    },


    render: function () {
        console.log(this.state)
        if (this.props.exercise.name)
            return (
                <View>
                    <Text style={styles.inputLabel}>{this.props.exercise.name}</Text>
                </View>
            );
        const sets = this.state.sets.map((set, index) => {
            if (this.state.sets.length > 1)
                return <CreateSetBox key={index} set={set} setIndex={index} setSetState={this.setSetState}
                               _deleteSet={this._deleteSet.bind(null, index)}/>
            else
                return <CreateSetBox key={index} set={set} setIndex={index} setSetState={this.setSetState}/>
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
                        value={this.state.name}
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
                        {!this.props.exercise.name ?
                            <TouchableOpacity onPress={this._addSet}>
                                <Text style={styles.addSetStyle}>Add Set</Text>
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                    : null
                }
                <TouchableOpacity onPress={this._save}>
                    <Text style={styles.addSetStyle}>Save</Text>
                </TouchableOpacity>
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
    }
});


export default CreateExerciseBox;
