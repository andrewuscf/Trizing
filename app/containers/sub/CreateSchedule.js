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

const Form = t.form.Form;

let Schedule = t.struct({
    name: t.String,
});

const CreateSchedule = React.createClass({
    propTypes: {
        training_plan: React.PropTypes.number,
    },

    getInitialState() {
        return {
            Error: null,
            template: null,
            value: null
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit, saveText: 'Next'});
    },

    asyncActions(start, data = {}){
        if (start) {
            // failed
        } else {
            if (data.routeName) {
                this.props.navigation.dispatch({
                    type: 'ReplaceCurrentScreen',
                    routeName: data.routeName,
                    params: data.props,
                    key: data.routeName
                });
            }
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
            this.props.actions.createSchedule(values, this.asyncActions);
        }
    },

    selectTemplate(id) {
        this.setState({
            template: id
        });
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
            // stylesheet: stylesheet,
            fields: {
                name: {
                    label: 'Program Name',
                    placeholder: this.props.training_plan? `This name will be displayed to your client` :`For example 'HIIT Program'`,
                    onSubmitEditing: () => this._onSubmit(),
                    autoCapitalize: 'sentences'
                },
            }
        };
        return (
            <View style={styles.flexCenter}>
                <View style={{margin: 10}}>
                    <Form
                        ref="form"
                        type={Schedule}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                    <Text>Use Template:</Text>
                    <SelectInput ref='schedule_templates' options={[
                        ..._.filter(this.props.Schedules, function (o) {
                            return !o.training_plan;
                        }),
                        {id: null, name: 'None'}
                    ]} selectedId={this.state.template} submitChange={this.selectTemplate}/>
                </View>
            </View>
        )
    }
});

CreateSchedule.navigationOptions = {
    title: 'Create Program',
};

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



const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateSchedule);
