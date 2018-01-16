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


const CreateWorkout = CreateClass({
    propTypes: {
        scheduleId: PropTypes.number.isRequired,
        template_workout: PropTypes.object
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
        // this.props.navigation.setParams({handleSave: this._onSubmit});
    },

    componentDidUpdate(prevProps, prevState) {
        if (prevState.disabled !== this.state.disabled) {
            // this.props.navigation.setParams({handleSave: this._onSubmit, disabled: this.state.disabled});
        }
    },

    asyncActions(success, data = {}){
        this.setState({disabled: false});
        if (success && data.routeName) {
            this.props.actions.appMessage("Created", null, "green");
            this.props.navigation.goBack();
        } else {
            this.props.actions.appMessage("Couldn't create workout block.", null, "red");
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
                <View style={{margin: 10}}>
                    <Form
                        ref="form"
                        type={Workout}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </View>
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
