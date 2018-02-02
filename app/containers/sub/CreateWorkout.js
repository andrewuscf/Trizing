import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';

import * as GlobalActions from '../../actions/globalActions';

import SubmitButton from "../../components/SubmitButton";


const CreateWorkout = CreateClass({
    propTypes: {
        scheduleId: PropTypes.number.isRequired,
        resetCreate: PropTypes.func.isRequired,
        template_workout: PropTypes.object
    },

    getInitialState() {
        return {
            disabled: false,
            value: this.props.template_workout ?
                {
                    name: `${this.props.template_workout.name} - Copy`,
                    duration: this.props.template_workout.duration
                }
                : null,
        }
    },

    componentDidUpdate(prevProps) {
        if (prevProps.template_workout !== this.props.template_workout) {
            if (this.props.template_workout) {
                this.setState({
                    value: {
                        name: `${this.props.template_workout.name} - Copy`,
                        duration: this.props.template_workout.duration
                    }
                });
            } else {
                this.setState({value: null})
            }
        }
    },

    asyncActions(success, data = {}) {
        this.setState({disabled: false, value: null});
        if (success) {
            this.props.resetCreate();
            this.props.actions.appMessage("Created", null, "green");
        } else {
            this.props.actions.appMessage("Couldn't create workout block.", null, "red");
        }
    },

    _onSubmit() {
        let values = this.refs.form.getValue();
        if (values && !this.state.disabled) {
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
            auto: 'placeholders',
            fields: {
                name: {
                    onSubmitEditing: () => this.refs.form.getComponent('duration').refs.input.focus(),
                    placeholder: `Workout Name: 'Block 1'`,
                    autoCapitalize: 'sentences',
                    maxLength: 40,
                },
                duration: {
                    onSubmitEditing: () => this._onSubmit(),
                    placeholder: `Duration : Number of weeks`
                }
            }
        };
        return (
            <View style={styles.flexCenter}>
                <Form
                    ref="form"
                    type={Workout}
                    options={options}
                    onChange={this.onChange}
                    value={this.state.value}
                />
                <SubmitButton onPress={this._onSubmit} text='Create'/>
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
