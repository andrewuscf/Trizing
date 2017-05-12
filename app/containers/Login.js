import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Keyboard
} from 'react-native';
import {
    LoginButton,
    AccessToken,
    LoginManager
} from 'react-native-fbsdk';
import t from 'tcomb-form-native';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';

import BackBar from '../components/BackBar';
import SubmitButton from '../components/SubmitButton';

const {height, width} = Dimensions.get('window');
const Form = t.form.Form;

const Login = React.createClass({
    propTypes: {
        login: React.PropTypes.func.isRequired,
        resetPassword: React.PropTypes.func.isRequired,
        register: React.PropTypes.func.isRequired,
        socialAuth: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            value: null,
            username: null,
            password: null,
            forgotCreds: false,
            signUp: false,
            options: {
                // stylesheet: fullWidthLineInputs,
                stylesheet: stylesheet,
                auto: 'placeholders',
                fields: {
                    username: {
                        autoCapitalize: 'none',
                        autoCorrect: false,
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
                        placeholder: 'Username or Email Address'
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

    asyncActions(start) {
        if (start) {
            this.refs.login_button.setState({busy: true});
        } else {
            this.refs.login_button.setState({busy: false});
        }
    },

    toggleForgotCreds() {
        this.setState({
            forgotCreds: !this.state.forgotCreds,
            signUp: false
        });
    },

    toggleSignUp() {
        this.setState({
            forgotCreds: false,
            signUp: !this.state.signUp,
        });
    },

    onPress() {
        // sign in + forgot credentials
        // Keyboard.dismiss();
        const formValues = this.refs.form.getValue();
        if (this.state.forgotCreds) {
            if (formValues) {
                this.props.resetPassword(formValues);
                this.toggleForgotCreds();
            }
        } else if (this.state.signUp) {
            if (formValues) {
                this.props.register(formValues, this.asyncActions);
                this.setState({value: null});
            }
        } else {
            if (formValues) {
                this.props.login({username: formValues.email, password: formValues.password}, this.asyncActions)
            }
        }
    },

    back() {
        this.setState({
            forgotCreds: false,
            signUp: false
        });
    },


    render() {
        let User = t.struct({
            email: t.String,
            password: t.String,
        });
        let options = this.state.options;
        if (this.state.signUp) {
            User = t.struct({
                username: t.String,
                email: t.String,
                password: t.String,
            });
            options = {
                ...options,
                fields: {
                    ...options.fields,
                    email: {
                        ...options.fields.email,
                        placeholder: 'Email Address'
                    }
                }
            }
        } else if (this.state.forgotCreds) {
            User = t.struct({
                email: t.String,
            });
            options = {
                ...options,
                fields: {
                    ...options.fields,
                    email: {
                        ...options.fields.email,
                        placeholder: 'Email Address'
                    }
                }
            }
        }
        return (
            <View style={styles.container}>
                {this.state.forgotCreds || this.state.signUp ?
                    <BackBar back={this.back} backText='Log In'/>
                    : null
                }

                <View style={styles.logoView}>
                    <Image style={styles.logo} source={require('../assets/images/red-logo.png')}/>
                </View>

                { !this.state.forgotCreds ?
                    <View style={styles.fbLogin}>
                        <LoginButton
                            readPermissions={['email']}
                            onLoginFinished={
                                (error, result) => {
                                    if (error) {
                                        console.log(error)
                                        LoginManager.logOut();
                                    } else if (result.isCancelled) {
                                        LoginManager.logOut();
                                    } else {
                                        AccessToken.getCurrentAccessToken().then(
                                            (data) => {
                                                this.props.socialAuth(data.accessToken);
                                            }
                                        )
                                    }
                                }
                            }
                        />
                    </View>
                    : null
                }

                <View style={styles.contentContainer}>

                    <Form
                        ref="form"
                        type={User}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />

                    {!this.state.forgotCreds && !this.state.signUp ?
                        <TouchableOpacity activeOpacity={1} style={styles.buttonForgot}
                                          onPress={this.toggleForgotCreds}>
                            <Text style={styles.buttonForgotText}>Forgot your password?</Text>
                        </TouchableOpacity>
                        : null
                    }


                    <SubmitButton onPress={this.onPress} ref="login_button"
                                  buttonStyle={[styles.button]} textStyle={styles.buttonText}
                                  text={!this.state.signUp && !this.state.forgotCreds ? 'Log In' : 'Submit'}/>

                    {!this.state.forgotCreds && !this.state.signUp ?
                        <SubmitButton onPress={this.toggleSignUp} ref="sign_button"
                                      buttonStyle={[styles.button]} textStyle={styles.buttonText}
                                      text="SIGN UP"/>
                        : null
                    }

                </View>

            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fbLogin: {
        flex: .1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: .8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoView: {
        flex: .3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        height: 100,
        width: 100,
        // borderWidth: 1,
        // borderColor: 'black'
    },
    buttonForgotText: {
        color: '#b1aea5',
        fontSize: getFontSize(22),
        fontFamily: 'OpenSans-SemiBold',
        marginTop: 10,
        marginBottom: 10
    },
    buttonForgot: {
        // backgroundColor: '#fff',
    },
    buttonText: {
        color: '#1352e2',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    },
    button: {
        marginTop: 10,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#1352e2',
        justifyContent: 'center',
        alignItems: 'center',
        width: width * .80,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 0,
        height: 40
    },
});

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup = {
    ...stylesheet.formGroup,
    normal: {
        ...stylesheet.formGroup.normal,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        width: width * .80
    },
    error: {
        ...stylesheet.formGroup.error,
        borderBottomWidth: .5,
        borderColor: 'red',
        width: width * .80
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

export default Login;
