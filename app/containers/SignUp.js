import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import {
    AccessToken,
    LoginManager
} from 'react-native-fbsdk';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import * as GlobalActions from '../actions/globalActions';

import {resetNav, getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

import SubmitButton from '../components/SubmitButton';

const Form = t.form.Form;

const SignUp = React.createClass({
    getInitialState() {
        return {
            value: null,
            keyboard: false,
            signUp: false,
            busy: false,
            options: {
                auto: 'placeholders',
                fields: {
                    username: {
                        autoCapitalize: 'none',
                        autoCorrect: false,
                        keyboardType: "ascii-capable",
                        onSubmitEditing: () => {
                            if (this.refs.form.getComponent('email'))
                                this.refs.form.getComponent('email').refs.input.focus()
                        },
                    },
                    email: {
                        autoCapitalize: 'none',
                        autoCorrect: false,
                        keyboardType: "email-address",
                        onSubmitEditing: () => {
                            if (this.refs.form.getComponent('password'))
                                this.refs.form.getComponent('password').refs.input.focus()
                        },
                        placeholder: 'Email Address'
                    },
                    password: {
                        secureTextEntry: true,
                        onSubmitEditing: () => {
                            this.onPress();
                        },
                        placeholder: 'Password',
                    }
                }
            }
        }
    },

    asyncActions(start, success = false) {
        if (start) {
            this.setState({busy: true});
        } else {
            this.setState({busy: false});
            if (success) {
                this.props.navigation.navigate('Login');
            }
        }
    },

    componentDidUpdate (prevProps) {
        if (this.props.UserToken) {
            if (this.props.RequestUser && this.props.RequestUser.profile.completed) {
                this.props.navigation.dispatch(resetNav('Main'))
            } else if (this.props.RequestUser && !this.props.RequestUser.profile.completed) {
                this.props.navigation.dispatch(resetNav('EditProfile'))
            }
        }
    },


    onPress() {
        // sign in + forgot credentials
        Keyboard.dismiss();
        const formValues = this.refs.form.getValue();
        if (formValues) {
            this.props.actions.register(formValues, this.asyncActions);
            this.setState({value: null});
        }
    },


    facebookLogin() {
        const self = this;
        self.asyncActions(true);
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            function (result) {
                if (result.isCancelled) {
                    self.asyncActions(false);
                    LoginManager.logOut();
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            self.props.actions.socialAuth(data.accessToken);
                        }
                    )
                }
            },
            function (error) {
                // console.log('Login fail with error: ' + error);
            }
        );
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
            username: t.String,
            email: t.String,
            password: t.String,
        });


        let options = this.state.options;

        return (
            <KeyboardAwareScrollView behavior='padding' style={styles.container} ref="scroll"
                                     contentContainerStyle={{flex: 1}}
                                     onKeyboardWillShow={this.changeKeyboard}
                                     onKeyboardWillHide={this.changeKeyboard}
                                     showsVerticalScrollIndicator={false}
                                     keyboardDismissMode='interactive'
                                     keyboardShouldPersistTaps='handled'
                                     scrollEnabled={this.state.keyboard}>


                <Form
                    ref="form"
                    type={User}
                    options={options}
                    onChange={this.onChange}
                    value={this.state.value}
                />


                <SubmitButton onPress={this.onPress} buttonStyle={[styles.button]} textStyle={styles.buttonText}
                              text='ENTER'/>

                <Text style={styles.buttonForgotText}>OR</Text>


                <SubmitButton onPress={this.facebookLogin} buttonStyle={[styles.button, styles.fbButton]}
                              textStyle={styles.buttonText}
                              text={
                                  <Text style={styles.fbText}>
                                      SIGN UP WITH FACEBOOK
                                  </Text>
                              }/>


                <TouchableOpacity style={styles.termSection} onPress={() => console.log('hit')}>
                    <Text style={styles.termsText}>By continuing, you agree to our</Text>
                    <Text style={styles.termsText}>
                        <Text style={GlobalStyle.redText}>Terms & Services</Text> and
                        <Text style={GlobalStyle.redText}> Privacy Policy</Text>
                    </Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    },
    buttonForgotText: {
        marginTop: 10,
        marginBottom: 10,
        color: '#999999',
        fontFamily: 'Heebo-Medium',
        textAlign: 'center',
    },
    buttonText: {
        fontFamily: 'Heebo-Bold',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    fbButton: {
        backgroundColor: '#3b5998',
        borderWidth: 0,
    },
    fbText: {
        fontFamily: 'Heebo-Bold',
        color: 'white',
    },
    termSection: {
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    termsText: {
        color: '#999999',
        fontFamily: 'Heebo-Medium',
    },
});


const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken,
        RequestUser: state.Global.RequestUser
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(SignUp);
