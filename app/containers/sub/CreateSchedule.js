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
import moment from 'moment';
import { NavigationActions } from 'react-navigation';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';

import BackBar from '../../components/BackBar';
import SelectInput from '../../components/SelectInput';
import SubmitButton from '../../components/SubmitButton';


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

    asyncActions(start, data = {}){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            // this.refs.postbutton.setState({busy: false});
            const self = this;
            if (data.routeName) {
                const resetAction = NavigationActions.reset({
                    index: self.navigation.state.routes.length - 1,
                    actions: [
                        NavigationActions.navigate({ routeName: data.routeName, params: data.props})
                    ]
                });
                this.props.navigation.dispatch(resetAction);
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

    _back() {
        this.props.navigation.goBack()
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
            stylesheet: stylesheet,
            fields: {
                name: {
                    label: 'Workout Program Name',
                    placeholder: this.props.training_plan? `This name will be displayed to your client` :`For example 'Program XY'`,
                    onSubmitEditing: () => this._onSubmit(),
                    autoCapitalize: 'sentences'
                },
            }
        };
        return (
            <View style={styles.flexCenter}>
                <BackBar back={this._back} backText="Cancel" navStyle={{height: 40}}/>
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
                <SubmitButton buttonStyle={styles.button}
                              textStyle={styles.submitText} onPress={this._onSubmit} ref='postbutton'
                              text='Next Step'/>
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
const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup = {
    ...stylesheet.formGroup,
    normal: {
        ...stylesheet.formGroup.normal,
        marginBottom: 12,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    error: {
        ...stylesheet.formGroup.error,
        marginBottom: 12,
        borderBottomWidth: .5,
        borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'stretch'
    }
};
stylesheet.textbox = {
    ...stylesheet.textbox,
    normal: {
        ...stylesheet.textbox.normal,
        borderWidth: 0,
        marginBottom: 0,
        textAlign: 'center'
    },
    error: {
        ...stylesheet.textbox.error,
        borderWidth: 0,
        marginBottom: 0,
        textAlign: 'center'
    }
};
stylesheet.controlLabel = {
    ...stylesheet.controlLabel,
    normal: {
        ...stylesheet.controlLabel.normal,
        fontSize: getFontSize(25),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    },
    error: {
        ...stylesheet.controlLabel.error,
        fontSize: getFontSize(25),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    }
};


const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateSchedule);
