import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import DropdownAlert from 'react-native-dropdownalert';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import * as GlobalActions from '../../actions/globalActions';

import CreateSetBox from '../../components/trainer/CreateSetBox';
import InputAccessory from '../../components/InputAccessory';


const BlankSet = {reps: null, weight: null};
const Form = t.form.Form;
const Exercise = t.struct({
    name: t.String,
});

const CreateExercise = CreateClass({
    propTypes: {
        workout_day: PropTypes.object.isRequired,
        set_group: PropTypes.object,
        newDay: PropTypes.func
    },

    getInitialState() {
        let sets = [BlankSet];
        if (this.props.set_group) {
            sets = [...this.props.set_group.sets];
        }
        return {
            fetchedExercises: [],
            sets: sets,
            value: this.props.set_group ? {name: this.props.set_group.name} : null,
            disabled: false,
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._save, disabled: this.state.disabled});
    },

    componentDidUpdate(prevProps, prevState) {
        if (prevState.disabled !== this.state.disabled) {
            this.props.navigation.setParams({handleSave: this._save, disabled: this.state.disabled});
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

    deleteSetActions(success, data) {
        if (success) {
            if (typeof this.props.newDay !== 'undefined') {
                this.props.newDay(data);
            }
        }
    },

    _deleteSet(setIndex) {
        Keyboard.dismiss();
        const setId = this.state.sets[setIndex].id;
        this.setState({
            sets: [...this.state.sets.slice(0, setIndex), ...this.state.sets.slice(setIndex + 1)]
        });
        if (setId) {
            this.props.actions.deleteSet(setId, this.deleteSetActions);
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

    asyncActions(success, data) {
        this.setState({disabled: false});
        if (success) {
            this.dropdown.alertWithType('success', 'Success', 'Created exercise.');
            if (typeof this.props.newDay !== 'undefined') {
                this.props.newDay(data);
            }
            setTimeout(() => {
                this.setState({value: null});
                this.props.navigation.goBack();
            }, 1000);
        } else {
            this.dropdown.alertWithType('error', 'Error', "Couldn't create exercise.");
        }
    },

    _save() {
        this.setState({disabled: true});
        if (this.refs.form) {
            // Created an exercise.
            let values = this.refs.form.getValue();
            if (!values) {
                this.setState({disabled: false});
                return
            }
            const data = {
                training_day: this.props.workout_day.id,
                exercise: {
                    name: values.name,
                },
                sets: [],
                order: 1
            };
            this.state.sets.forEach((set, index) => {
                if (set.reps) {
                    const set_data = {
                        reps: set.reps,
                        order: index + 1
                    };
                    if (set.weight) set_data['weight'] = set.weight;
                    data.sets.push(set_data);
                }
            });
            if (data.sets.length > 0) {
                this.props.actions.createSetGroup(data, this.asyncActions);
            }

        } else if (this.props.set_group) {
            // Updating already created exercise.
            const sets = [];
            this.state.sets.forEach((set, index) => {
                if (set.reps) {
                    const data = {
                        training_day: this.props.workout_day.id,
                        set_group: this.props.set_group.id,
                        reps: set.reps,
                        order: index + 1
                    };
                    if (set.weight)
                        data['weight'] = set.weight;
                    if (!set.id) {
                        sets.push(data);
                    } else {
                        data['id'] = set.id;
                        const old = _.find(this.props.set_group.sets, {id: set.id});
                        if (old.reps !== data.reps || old.weight !== data.weight || old.order !== data.order) {
                            this.props.actions.addEditExercise(data, this.asyncActions);
                        }
                    }
                }
            });
            if (sets.length > 0) {
                this.props.actions.addEditExercise(sets, this.asyncActions);
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
            <View style={{flex: 1}}>
                <KeyboardAwareScrollView extraHeight={130} showsVerticalScrollIndicator={false}
                                         keyboardDismissMode='interactive'
                                         keyboardShouldPersistTaps='handled'
                                         contentContainerStyle={{padding: 10}}>
                    {!this.props.set_group ?
                        <Form
                            ref="form"
                            type={Exercise}
                            options={options}
                            onChange={this.onChange}
                            value={this.state.value}
                        /> : null}
                    {sets}
                    <View style={styles.box}>
                        <TouchableOpacity style={styles.buttonBottom} onPress={this._addSet}>
                            <Text>Add Set</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                <InputAccessory/>
                <DropdownAlert ref={(ref) => this.dropdown = ref}/>
            </View>
        )
    }
});

CreateExercise.navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    let title = null;
    if (state.params && state.params.exercise) {
        title = state.params.exercise.name
    } else if (state.params && state.params.workout_day) {
        title = state.params.workout_day.name
    }
    return {
        headerTitle: title
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
        borderWidth: 1,
        borderColor: '#e1e3df',
        borderRadius: 10,
        flexDirection: 'row',
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

