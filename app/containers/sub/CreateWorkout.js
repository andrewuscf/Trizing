import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import DropdownAlert from 'react-native-dropdownalert';

import * as GlobalActions from '../../actions/globalActions';

import SelectInput from '../../components/SelectInput';

const CreateWorkout = React.createClass({
    propTypes: {
        scheduleId: React.PropTypes.number.isRequired,
        _onWorkoutDelete: React.PropTypes.func.isRequired,
        template_workout: React.PropTypes.object
    },

    getInitialState() {
        return {
            template: null,
            disabled: false,
            value: this.props.template_workout ?
                {
                    name: `${this.props.template_workout.name} - Copy`,
                    duration: this.props.template_workout.duration
                }
                : null,
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit});
    },

    componentDidUpdate(prevProps, prevState) {
        if (prevState.disabled !== this.state.disabled) {
            this.props.navigation.setParams({handleSave: this._onSubmit, disabled: this.state.disabled});
        }
    },

    asyncActions(success, data = {}){
        this.setState({disabled: false});
        if (success && data.routeName) {
            this.props.navigation.dispatch({
                type: 'ReplaceCurrentScreen',
                routeName: data.routeName,
                params: {...data.props, _onWorkoutDelete: this.props._onWorkoutDelete},
                key: data.routeName
            });
        } else {
            this.dropdown.alertWithType('error', 'Error', "Couldn't create workout block.")
        }
    },

    _onSubmit() {
        let values = this.refs.form.getValue();
        if (values) {
            this.setState({disabled: true});
            if (this.props.template_workout) {
                values = {
                    ...values,
                    template: this.props.template_workout.id
                };
            }
            if (this.props.training_plan) {
                values = {
                    ...values,
                    training_plan: this.props.training_plan
                }
            }
            values = {
                ...values,
                program: this.props.scheduleId
            };
            this.props.actions.createWorkout(values, this.asyncActions);
        }
    },

    onChange(value) {
        this.setState({value});
    },


    render: function () {
        let options = {
            i18n: {
                optional: '',
                required: '*',
            },
            fields: {
                name: {
                    label: 'Workout Block Name',
                    onSubmitEditing: () => this.refs.form.getComponent('duration').refs.input.focus(),
                    placeholder: `'Block 1 of program xy'.`,
                    autoCapitalize: 'sentences'
                },
                duration: {
                    label: 'Duration',
                    onSubmitEditing: () => this._onSubmit(),
                    placeholder: `Number of weeks for this block`
                }
            }
        };
        return (
            <View style={styles.flexCenter}>
                <View style={{margin: 10}}>
                    <Form
                        ref="form"
                        type={Workout}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </View>
                <DropdownAlert ref={(ref) => this.dropdown = ref}/>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    button: {
        margin: 20,
    },
});

// T FORM SETUP
const Form = t.form.Form;

const Positive = t.refinement(t.Number, function (n) {
    return n >= 0;
});

const Workout = t.struct({
    name: t.String,
    duration: Positive,
});

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(null, dispatchToProps)(CreateWorkout);
