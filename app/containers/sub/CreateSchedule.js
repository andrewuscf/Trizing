import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {isATrainer} from '../../actions/utils';

import InputAccessory from '../../components/InputAccessory';
import {ModalPicker} from '../../components/ModalPicker';

const Form = t.form.Form;

const CreateSchedule = CreateClass({
    propTypes: {
        training_plan: PropTypes.number,
        allow_sale: PropTypes.bool
    },

    getInitialState() {
        return {
            Error: null,
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

    asyncActions(success, data = {}) {
        this.setState({disabled: false});
        if (success && data.routeName) {
            this.props.actions.appMessage("Created", null, "green");
            this.props.navigation.dispatch({
                type: 'ReplaceCurrentScreen',
                routeName: data.routeName,
                params: data.props,
                key: data.routeName
            });
        } else {
            this.props.actions.appMessage("Couldn't create program block", null, "red");
        }
    },


    _onSubmit() {
        let values = this.refs.form.getValue();
        if (values) {
            this.setState({disabled: true});
            if (this.props.training_plan) {
                values = {
                    ...values,
                    training_plan: this.props.training_plan
                }
            }
            this.props.actions.createSchedule(values, this.asyncActions);
        }
    },

    onChange(value) {
        this.setState({value});
    },

    getType() {
        const skill_levels = t.enums({
            1: 'Beginner',
            2: 'Intermediate',
            3: 'Advanced'
        });

        const templates = {};
        _.filter(this.props.Schedules, function (o) {
            return !o.training_plan;
        }).forEach((category) => {
            templates[category.id] = category.name
        });
        const template_list = t.enums(templates);
        let struct = {
            name: t.String,
            description: t.maybe(t.String),
            template: t.maybe(template_list),
            is_loop: t.Boolean
        };
        if (isATrainer(this.props.RequestUser.type) && this.props.allow_sale) {
            struct = {
                ...struct,
                for_sale: t.Boolean,
                skill_level: t.maybe(skill_levels),
            }
        }
        if (this.state.value && this.state.value.for_sale) {
            struct = {
                ...struct,
                cost: t.Number,
            }
        }
        return t.struct(struct)
    },

    render() {
        const Schedule = this.getType();
        let options = {
            auto: 'placeholders',
            order: ['name', 'description', 'skill_level', 'is_loop', 'for_sale', 'cost', 'template'],
            fields: {
                name: {
                    placeholder: this.props.training_plan ? `This name will be displayed to your client` : `Program Name`,
                    onSubmitEditing: () => this.refs.form.getComponent('description').refs.input.focus(),
                    maxLength: 40,
                    autoCapitalize: 'sentences',
                },
                description: {
                    maxLength: 500,
                    autoCapitalize: 'sentences',
                    multiline: true,
                    stylesheet: {
                        ...t.form.Form.defaultProps.stylesheet,
                        textbox: {
                            ...t.form.Form.defaultProps.stylesheet.textbox,
                            normal: {
                                ...t.form.Form.defaultProps.stylesheet.textbox.normal,
                                height: 100
                            },
                            error: {
                                ...t.form.Form.defaultProps.stylesheet.textbox.error,
                                height: 100
                            }
                        }
                    }
                },
                skill_level: {
                    label: Platform.OS === 'ios' ? 'SKILL LEVEL' : '',
                    nullOption: {value: '', text: 'Choose a skill level'},
                    factory: Platform.OS === 'ios' ? ModalPicker : null,
                },
                for_sale: {
                    stylesheet: {
                        ...t.form.Form.defaultProps.stylesheet,
                        controlLabel: {
                            ...t.form.Form.defaultProps.stylesheet.controlLabel,
                            normal: {
                                ...t.form.Form.defaultProps.stylesheet.controlLabel.normal,
                                flex: 1,
                                margin: 0,
                                fontWeight: '400',
                                paddingLeft: 10
                            },
                            error: {
                                ...t.form.Form.defaultProps.stylesheet.controlLabel.error,
                                flex: 1,
                                margin: 0,
                                fontWeight: '400',
                                paddingLeft: 10
                            }
                        },
                        formGroup: {
                            ...t.form.Form.defaultProps.stylesheet.formGroup,
                            normal: {
                                ...t.form.Form.defaultProps.stylesheet.formGroup.normal,
                                flexDirection: 'row',
                                paddingTop: 10
                            },
                            error: {
                                ...t.form.Form.defaultProps.stylesheet.formGroup.error,
                                flexDirection: 'row',
                            }
                        },
                    }
                },
                is_loop: {
                    label: 'Repeats',
                    stylesheet: {
                        ...t.form.Form.defaultProps.stylesheet,
                        controlLabel: {
                            ...t.form.Form.defaultProps.stylesheet.controlLabel,
                            normal: {
                                ...t.form.Form.defaultProps.stylesheet.controlLabel.normal,
                                flex: 1,
                                margin: 0,
                                fontWeight: '400',
                                paddingLeft: 10
                            },
                            error: {
                                ...t.form.Form.defaultProps.stylesheet.controlLabel.error,
                                flex: 1,
                                margin: 0,
                                fontWeight: '400',
                                paddingLeft: 10
                            }
                        },
                        formGroup: {
                            ...t.form.Form.defaultProps.stylesheet.formGroup,
                            normal: {
                                ...t.form.Form.defaultProps.stylesheet.formGroup.normal,
                                flexDirection: 'row',
                                paddingTop: 10
                            },
                            error: {
                                ...t.form.Form.defaultProps.stylesheet.formGroup.error,
                                flexDirection: 'row',
                            }
                        },
                    }
                },
                cost: {
                    placeholder: '$ Cost'
                },
                template: {
                    nullOption: {value: '', text: 'Copy a Program'},
                    factory: Platform.OS === 'ios' ? ModalPicker : null,
                }
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
                <InputAccessory/>
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
