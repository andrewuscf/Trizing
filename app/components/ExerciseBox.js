import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
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

    getInitialState() {
        return {
            showCancel: false,
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

    onFocus() {
        this.setState({
            showCancel: true,
            iconColor: '#797979'
        });
    },

    clickCancel: function () {
        this.setState({
            showCancel: false,
            iconColor: '#a7a59f',
        });
    },

    _renderCancel: function () {
        if (this.state.showCancel) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={this.clickCancel}>
                    <Icon name="times-circle" size={18} color="#4d4d4d"/>
                </TouchableOpacity>
            );
        } else {
            return null;
        }
    },


    render: function () {
        const sets = this.props.exercise.sets.map((set, index) => {
            return <SetBox key={index} set={set} setIndex={index} setSetState={this.setSetState}/>
        });
        return (
            <View style={styles.exerciseContainer}>
                <View style={styles.subNav}>
                    <Icon name="search" size={16} color={this.state.iconColor}/>
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
                        placeholder="Exercise name"
                    />
                    {this._renderCancel()}
                </View>
                {sets}
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
});


export default ExerciseBox;
