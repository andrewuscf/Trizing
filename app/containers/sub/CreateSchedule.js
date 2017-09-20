import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import DropdownAlert from 'react-native-dropdownalert';

import * as GlobalActions from '../../actions/globalActions';

import InputAccessory from '../../components/InputAccessory';
import {ModalPicker} from '../../components/ModalPicker';

const Form = t.form.Form;

const CreateSchedule = React.createClass({
    propTypes: {
        training_plan: React.PropTypes.number,
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

    asyncActions(success, data = {}){
        this.setState({disabled: false});
        if (success && data.routeName) {
            // this.props.navigation.dispatch({
            //     type: 'ReplaceCurrentScreen',
            //     routeName: data.routeName,
            //     params: data.props,
            //     key: data.routeName
            // });
            this.props.navigation.goBack();
        } else {
            this.dropdown.alertWithType('error', 'Error', "Couldn't create workout block.")
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
            console.log(values)
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
            for_sale: t.Boolean,
            skill_level: t.maybe(skill_levels),
            description: t.maybe(t.String),
            template: t.maybe(template_list)
        };
        if (this.state.value && this.state.value.for_sale) {
            struct = {
                ...struct,
                cost: t.Number,
            }
        }
        return t.struct(struct)
    },

    render: function () {
        const Schedule = this.getType();
        let options = {
            stylesheet: stylesheet,
            auto: 'placeholders',
            order: ['name', 'description', 'skill_level', 'for_sale', 'cost', 'template'],
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
                        ...stylesheet,
                        textbox: {
                            ...stylesheet.textbox,
                            normal: {
                                ...stylesheet.textbox.normal,
                                height: 100
                            },
                            error: {
                                ...stylesheet.textbox.error,
                                height: 100
                            }
                        }
                    }
                },
                skill_level: {
                    label: 'SKILL LEVEL',
                    nullOption: {value: '', text: 'Choose a skill level.'},
                    factory: Platform.OS == 'ios' ? ModalPicker : null,
                    stylesheet: {
                        ...stylesheet,
                        textbox: {
                            ...stylesheet.textbox,
                            normal: {
                                ...stylesheet.textbox.normal,
                                height: 100
                            },
                            error: {
                                ...stylesheet.textbox.error,
                                height: 100
                            }
                        }
                    }
                },
                for_sale: {
                    stylesheet: {
                        ...stylesheet,
                        controlLabel: {
                            ...stylesheet.controlLabel,
                            normal: {
                                ...stylesheet.controlLabel.normal,
                                flex: 1,
                                margin: 0,
                            },
                            error: {
                                ...stylesheet.controlLabel.error,
                                flex: 1,
                                margin: 0,
                            }
                        },
                        formGroup: {
                            ...stylesheet.formGroup,
                            normal: {
                                ...stylesheet.formGroup.normal,
                                flexDirection: 'row',
                                paddingTop: 10
                            },
                            error: {
                                ...stylesheet.formGroup.error,
                                flexDirection: 'row',
                            }
                        },
                    }
                },
                template: {
                    nullOption: {value: '', text: 'Use Template'},
                    factory: Platform.OS == 'ios' ? ModalPicker : null,
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
                <DropdownAlert ref={(ref) => this.dropdown = ref}/>
                <InputAccessory/>
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
        borderColor: '#e1e3df',
        borderWidth: 1,
        padding: 5,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 0,
        borderRadius: 5,
    },
    error: {
        ...stylesheet.formGroup.error,
        borderColor: 'red',
        backgroundColor: 'white',
        borderWidth: 1,
        padding: 5,
        margin: 10,
        marginBottom: 5,
        borderRadius: 5,
    }
};
stylesheet.textbox = {
    ...stylesheet.textbox,
    normal: {
        ...stylesheet.textbox.normal,
        borderWidth: 0,
        marginBottom: 0,
    },
    error: {
        ...stylesheet.textbox.error,
        borderWidth: 0,
        marginBottom: 0,
    }
};

stylesheet.pickerValue = {
    ...stylesheet.pickerValue,
    normal: {
        ...stylesheet.pickerValue.normal,
        color: '#000000'
    },
    error: {
        ...stylesheet.pickerValue.error,
        color: 'red'
    }
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
