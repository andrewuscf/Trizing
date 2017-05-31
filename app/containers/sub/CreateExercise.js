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
import Icon from 'react-native-vector-icons/MaterialIcons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';

import {getFontSize} from '../../actions/utils';

import CreateSetBox from '../../components/CreateSetBox';


const BlankSet = {reps: null, weight: null};
const Form = t.form.Form;
const Exercise = t.struct({
    name: t.String,
});

const CreateExercise = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
        exercise: React.PropTypes.object
    },

    getInitialState() {
        let sets = [BlankSet];
        if (this.props.exercise) {
            sets = [...this.props.exercise.sets];
        }
        return {
            fetchedExercises: [],
            sets: sets,
            value: this.props.exercise ? {name: this.props.exercise.name} : null
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._save, saveText: 'Save'});
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

    setSetState(index, state) {
        let sets = this.state.sets;
        sets[index] = {
            ...sets[index],
            ...state
        };
        this.setState({sets: sets});
    },

    onChange(value) {
        this.setState({value});
    },

    _save() {
        const sets = [];
        let values = this.refs.form.getValue();
        if (values) {
            this.state.sets.forEach((set, index) => {
                if (set.reps) {
                    const data = {
                        day: this.props.workout_day.id,
                        exercise: {
                            name: values.name,
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
                        if (old.reps != data.reps || old.weight != data.weight || old.order != data.order) {
                            this.props.actions.addEditExercise(data, this.props.navigation.goBack);
                        }
                    }
                }
            });
            if (sets.length > 0) {
                this.props.actions.addEditExercise(sets, this.props.navigation.goBack);
            } else {
                this.props.navigation.goBack();
            }
        }
    },


    render: function () {
        let options = {
            auto: 'placeholders',
            i18n: {
                optional: '',
                required: '*',
            },
            fields: {
                name: {
                    placeholder: `Exercise Name`,
                    // onSubmitEditing: () => this.refs.form.getComponent('duration').refs.input.focus(),
                    autoCapitalize: 'words',
                    // factory: AutoInput,
                    // config: {
                    //     elements: this.props.objectsForAutocomplete,
                    //     propForQuery: 'name',
                    // },
                }
            }
        };

        let sets = this.state.sets.map((set, index) => {
            if (this.state.sets.length > 1)
                return <CreateSetBox key={index} setIndex={index} setSetState={this.setSetState}
                                     _deleteSet={this._deleteSet} value={{reps: set.reps, weight: set.weight}}/>;
            else
                return <CreateSetBox key={index} set={set} setIndex={index} setSetState={this.setSetState}
                                     value={{reps: set.reps, weight: set.weight}}/>
        });
        return (
            <View style={styles.box}>
                <View style={{padding: 10}}>
                    <Form
                        ref="form"
                        type={Exercise}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                    <View style={[styles.title]}>
                        <Text style={[styles.titleSection, {flex:.2}]}>SET</Text>
                        <Text style={[styles.titleSection, {flex:.4}]}>LBS</Text>
                        <Text style={[styles.titleSection, {flex:.4}]}>REPS</Text>
                    </View>
                    <View>
                        {sets}
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.buttonBottom} onPress={this._addSet}>
                        <Text>Add Set</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
});

CreateExercise.navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    return {
        headerTitle: state.params && state.params.workout_day ?
            state.params.workout_day.name
            : null,
    };
};


const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    titleSection: {
        textAlign: 'center',
    },
    box: {
        margin: 10,
        borderWidth: .5,
        borderColor: '#e1e3df',
        borderRadius: 10,
    },
    save: {
        position: 'absolute',
        top: 6,
        right: 10
    },
    buttonBottom: {
        flex: 1 / 3,
        borderTopWidth: .5,
        borderRightWidth: .5,
        borderColor: '#e1e3df',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    footer: {
        borderTopWidth: 1,
        borderColor: '#e1e3df',
        alignItems: 'center',
        minHeight: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: .1
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

export default connect(stateToProps, dispatchToProps)(CreateExercise);

