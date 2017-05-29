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
                        if (old.reps != data.reps || old.weight != data.weight || old.order != data.order) {
                            this.props.actions.addEditExercise(data);
                        }
                    }
                }
            });
            if (sets.length > 0)
                this.props.actions.addEditExercise(sets);
            this.props.navigation.goBack();
        }
    },


    render: function () {
        let options = {
            i18n: {
                optional: '',
                required: '*',
            },
            fields: {
                name: {
                    label: `Exercise Name`,
                    // onSubmitEditing: () => this.refs.form.getComponent('duration').refs.input.focus(),
                    autoCapitalize: 'words'
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
            <View style={{flex: 1}}>
                <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.contentContainerStyle}>
                    <View style={{margin: 10}}>
                        <Form
                            ref="form"
                            type={Exercise}
                            options={options}
                            onChange={this.onChange}
                            value={this.state.value}
                        />
                    </View>
                    <View>
                        {sets}
                    </View>
                </ScrollView>
                <View style={styles.footer}>

                    <TouchableOpacity style={[styles.editBlock, {paddingLeft: 10}]}>
                        <Icon name="trash" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editBlock, {paddingRight: 10}]} onPress={this._addSet}>
                        <Icon name="bars" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Add Set</Text>
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

const iconColor = '#8E8E8E';

const styles = StyleSheet.create({
    flexCenter: {
        flex: .9,
    },
    edit: {
        position: 'absolute',
        right: 0,
        top: 5
    },
    save: {
        position: 'absolute',
        top: 6,
        right: 10
    },
    footer: {
        borderTopWidth: 1,
        borderColor: '#e1e3df',
        alignItems: 'center',
        minHeight: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: .1
    },
    editBlock: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 5
    },
    editItemLabel: {
        fontFamily: 'OpenSans-Semibold',
        fontSize: getFontSize(14),
        color: iconColor,
        textAlign: 'center',
    },
    editItem: {
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
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

