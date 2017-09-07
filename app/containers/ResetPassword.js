import React from 'react';
import {
    View,
    StyleSheet,
    Keyboard,
    ActivityIndicator,
} from 'react-native';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import * as GlobalActions from '../actions/globalActions';

import GlobalStyle from './globalStyle';

import SubmitButton from '../components/SubmitButton';

const Form = t.form.Form;

const ResetPassword = React.createClass({
    getInitialState() {
        return {
            value: null,
            keyboard: false,
            busy: false,
            options: {
                // stylesheet: fullWidthLineInputs,
                stylesheet: stylesheet,
                auto: 'placeholders',
                fields: {
                    email: {
                        autoCapitalize: 'none',
                        autoCorrect: false,
                        keyboardType: "email-address",
                        onSubmitEditing: this.onPress,
                        placeholder: 'Email Address'
                    }
                }
            }
        }
    },

    asyncActions(start) {
        if (start) {
            this.setState({busy: true});
        } else {
            this.setState({busy: false});
        }
    },

    onPress() {
        Keyboard.dismiss();
        const formValues = this.refs.form.getValue();
        if (formValues) {
            this.props.actions.resetPassword(formValues, this.asyncActions);
            this.setState({value: null});
        }
    },

    onChange(value) {
        this.setState({value});
    },

    changeKeyboard() {
        this.setState({
            keyboard: !this.state.keyboard
        })
    },


    render() {
        if (this.state.busy) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator animating={true} size='large'/>
                </View>
            )
        }
        let User = t.struct({
            email: t.String,
        });
        let options = this.state.options;
        return (
            <KeyboardAwareScrollView behavior='padding' style={{padding: 20}} ref="scroll"
                                     contentContainerStyle={{flex: 1}}
                                     onKeyboardWillShow={this.changeKeyboard}
                                     onKeyboardWillHide={this.changeKeyboard}
                                     showsVerticalScrollIndicator={false}
                                     keyboardDismissMode='interactive'
                                     scrollEnabled={this.state.keyboard}>


                <Form
                    ref="form"
                    type={User}
                    options={options}
                    onChange={this.onChange}
                    value={this.state.value}
                />


                <SubmitButton onPress={this.onPress} buttonStyle={[styles.button]} textStyle={styles.buttonText}
                              text='Send'/>


            </KeyboardAwareScrollView>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Heebo-Bold',
    },
    button: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00AFA3'
    },
});

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup = {
    ...stylesheet.formGroup,
    normal: {
        ...stylesheet.formGroup.normal,
        marginRight: 20,
        marginLeft: 20,
        borderColor: '#d4d4d4',
    },
    error: {
        ...stylesheet.formGroup.error,
        marginRight: 20,
        marginLeft: 20,
        borderColor: '#d4d4d4',
    }
};
stylesheet.textbox = {
    ...stylesheet.textbox,
    normal: {
        ...stylesheet.textbox.normal,
    },
    error: {
        ...stylesheet.textbox.error,
    }
};


const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(null, dispatchToProps)(ResetPassword);
