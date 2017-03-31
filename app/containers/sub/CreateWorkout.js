import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableHighlight
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import SelectInput from '../../components/SelectInput';
import SubmitButton from '../../components/SubmitButton';


const CreateWorkout = React.createClass({
    propTypes: {
        training_plan: React.PropTypes.number,
    },

    getInitialState() {
        return {
            Error: null,
            template: null
        }
    },
    componentDidMount() {
        this.refs.form.getComponent('name').refs.input.focus()
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.state.Error) {
            Alert.alert(
                this.state.Error,
                this.state.Error,
                [
                    {text: 'OK', onPress: () => this.setState({Error: null})},
                ]
            );
        }
    },

    asyncActions(start, data = {}){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            if (data.routeName) {
                this.props.navigator.replace(getRoute(data.routeName, data.props))
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
            console.log(values)
            this.props.actions.createWorkout(values, this.asyncActions);
        }
    },

    _cancel() {
        this.props.navigator.pop();
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
            stylesheet: stylesheet,
            fields: {
                name: {
                    label: 'Workout Name',
                    onSubmitEditing: () => this._onSubmit()
                },
            }
        };
        return (
            <View style={styles.flexCenter}>
                <BackBar back={this._cancel} backText="Cancel" navStyle={{height: 40}}/>
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
                        ..._.filter(this.props.Workouts, function (o) {
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
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    }
});

// T FORM SETUP
const Form = t.form.Form;

const Workout = t.struct({
    name: t.String,
});
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

export default connect(stateToProps, dispatchToProps)(CreateWorkout);
