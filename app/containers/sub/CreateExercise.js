import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Alert,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';

import {getFontSize} from '../../actions/utils';

import BackBar from '../../components/BackBar';
import CreateSetBox from '../../components/CreateSetBox';
import SubmitButton from '../../components/SubmitButton';


const BlankSet = {reps: null, weight: null};

const CreateExercise = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
        exercise: React.PropTypes.object
    },

    getInitialState() {
        let name = null;
        let sets = [BlankSet];
        if (this.props.exercise) {
            name = this.props.exercise.name;
            sets = [...this.props.exercise.sets];
        }
        return {
            showSets: true,
            fetchedExercises: [],
            name: name,
            sets: sets,
        }
    },


    _addSet() {
        Keyboard.dismiss();
        let addSet = BlankSet;
        if (this.state.sets && this.state.sets[this.state.sets.length - 1]) {
            addSet = {
                ...this.state.sets[this.state.sets.length - 1],
                id: null
            };
        }
        this.setState({
            sets: [
                ...this.state.sets,
                addSet
            ]
        });
    },

    _deleteSet(setIndex) {
        Keyboard.dismiss();
        const setId = this.state.sets[setIndex].id;
        this.setState({
            sets: [...this.state.sets.slice(0, setIndex), ...this.state.sets.slice(setIndex + 1)]
        });
        if (setId) {
            this.props.actions.deleteSet(setId);
        }
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


    _toggleShow: function () {
        this.setState({
            showSets: !this.state.showSets,
        });
    },

    _save() {
        const sets = [];
        this.state.sets.forEach((set, index) => {
            if (set.reps && this.state.name) {
                const data = {
                    day: this.props.workout_day.id,
                    exercise: {
                        name: this.state.name,
                    },
                    reps: set.reps,
                    order: index + 1
                };
                if (set.weight)
                    data['weight'] = set.weight;
                if (!set.id) {
                    sets.push(data);
                } else {
                    data['id'] = set.id;
                    data['exercise'] = this.props.exercise.id;
                    const old = _.find(this.props.exercise.sets, {id: set.id});
                    if (old.reps != data.reps ||old.weight != data.weight ||old.order != data.order) {
                        this.props.actions.addEditExercise(data);
                    }
                }
            }
        });
        if (sets.length > 0)
            this.props.actions.addEditExercise(sets);
        this.props.navigator.pop();
    },


    render: function () {
        let sets = this.state.sets.map((set, index) => {
            if (this.state.sets.length > 1)
                return <CreateSetBox key={index} setIndex={index} setSetState={this.setSetState}
                                     _deleteSet={this._deleteSet} value={{reps: set.reps, weight: set.weight}}/>;
            else
                return <CreateSetBox key={index} set={set} setIndex={index} setSetState={this.setSetState}
                                     value={{reps: set.reps, weight: set.weight}}/>
        });
        return (
            <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this.props.navigator.pop} backText="" navStyle={{height: 40}}>
                    <Text>{this.state.workout ? this.state.workout_day.name : null}</Text>
                    <TouchableOpacity style={styles.save} onPress={this._save}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                </BackBar>
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
                </View>
                {this.state.showSets ?
                    <View>
                        {sets}
                    </View>
                    : null
                }
                <TouchableOpacity onPress={this._addSet}>
                    <Text style={styles.addSetStyle}>Add Set</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
});


const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
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
    save: {
        position: 'absolute',
        top: 20,
        right: 10
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

export default connect(stateToProps, dispatchToProps)(CreateExercise);

