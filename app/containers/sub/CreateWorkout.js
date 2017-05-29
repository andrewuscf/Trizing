import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import { NavigationActions } from 'react-navigation';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';

import SelectInput from '../../components/SelectInput';

const CreateWorkout = React.createClass({
    propTypes: {
        scheduleId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            template: null
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit, saveText: 'Next'});
    },

    asyncActions(start, data = {}){
        if (start) {
            // failed
        } else if (data.routeName) {
            this.props.navigation.dispatch({
                type: 'ReplaceCurrentScreen',
                routeName: data.routeName,
                params: data.props,
                key: data.routeName
            });
        }
    },

    _onSubmit() {
        let values = this.refs.form.getValue();
        if (values) {
            if (this.state.template)
                values = {
                    ...values,
                    template: this.state.template
                };
            if (this.props.training_plan) {
                values = {
                    ...values,
                    training_plan: this.props.training_plan
                }
            }
            values = {
                ...values,
                schedule: this.props.scheduleId
            };
            this.props.actions.createWorkout(values, this.asyncActions);
        }
    },

    selectTemplate(id) {
        this.setState({
            template: id
        });
    },


    render: function () {
        let options = {
            i18n: {
                optional: '',
                required: '*',
            },
            // stylesheet: stylesheet,
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
                    <Text>Use Template:</Text>
                    <SelectInput ref='workout_templates' options={[
                        ..._.filter(this.props.Workouts, function (o) {return !o.training_plan;}),
                        {id: null, name: 'None'}
                    ]} selectedId={this.state.template} submitChange={this.selectTemplate}/>
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
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    }
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



const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateWorkout);
