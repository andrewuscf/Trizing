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
            value: null,
            disabled: false,
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
                params: data.props,
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
            stylesheet: stylesheet,
            fields: {
                name: {
                    label: 'Program Name',
                    placeholder: this.props.training_plan ? `This name will be displayed to your client` : `'HIIT Program'`,
                    onSubmitEditing: () => this._onSubmit(),
                    maxLength: 40,
                    autoCapitalize: 'sentences',
                    multiline: true,
                },
            }
        };
        return (
            <View style={styles.flexCenter}>
                <Form
                    ref="form"
                    type={Schedule}
                    options={options}
                    onChange={this.onChange}
                    value={this.state.value}
                />
                <View style={styles.templateSection}>
                    <Text>Use Template:</Text>
                    <SelectInput ref='schedule_templates' options={[
                        ..._.filter(this.props.Schedules, function (o) {
                            return !o.training_plan;
                        }),
                        {id: null, name: 'None'}
                    ]} selectedId={this.state.template} submitChange={this.selectTemplate}/>
                </View>
                <DropdownAlert ref={(ref) => this.dropdown = ref}/>
            </View>
        )
    }
});

CreateSchedule.navigationOptions = {
    title: 'Create Program',
};

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup = {
    ...stylesheet.formGroup,
    normal: {
        ...stylesheet.formGroup.normal,
        paddingTop: 20,
        backgroundColor: 'white',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
    },
    error: {
        ...stylesheet.formGroup.error,
        paddingTop: 20,
        backgroundColor: 'white',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
    }
};
//
stylesheet.textbox = {
    ...stylesheet.textbox,
    normal: {
        ...stylesheet.textbox.normal,
        borderWidth: 0,
        marginTop: 5,
        marginBottom: 0,
        fontSize: 24,
        minHeight: 80,
    },
    error: {
        ...stylesheet.textbox.error,
        borderWidth: 0,
        marginTop: 5,
        marginBottom: 0,
        fontSize: 24
    }
};

stylesheet.textboxView = {
    ...stylesheet.textboxView,
    normal: {
        ...stylesheet.textboxView.normal,
        borderWidth: 0,
        borderRadius: 0,
        backgroundColor: 'transparent',
        minHeight: 80,
    },
    error: {
        ...stylesheet.textboxView.error,
        borderWidth: 0,
        borderRadius: 0,
        backgroundColor: 'transparent',
        minHeight: 80,
    }
};

stylesheet.controlLabel.normal.marginLeft = 5;
stylesheet.controlLabel.error.marginLeft = 5;

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        backgroundColor: '#f1f1f3'
    },
    button: {
        margin: 20,
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Heebo-Bold',
    },
    templateSection:{
        padding: 10,
        backgroundColor: 'white',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
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
