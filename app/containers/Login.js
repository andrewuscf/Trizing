import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Keyboard,
    ActivityIndicator,
    findNodeHandle
} from 'react-native';
import {
    AccessToken,
    LoginManager
} from 'react-native-fbsdk';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import * as GlobalActions from '../actions/globalActions';

import {getFontSize, resetNav} from '../actions/utils';
import GlobalStyle from './globalStyle';

import BackBar from '../components/BackBar';
import SubmitButton from '../components/SubmitButton';

const Form = t.form.Form;

const Login = React.createClass({
    getInitialState() {
        return {
            value: null,
            keyboard: false,
            forgotCreds: false,
            signUp: false,
            busy: false,
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
                        placeholder: 'Username or Email'
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
            this.setState({busy: true});
        } else {
            this.setState({busy: false});
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
        Keyboard.dismiss();
        const formValues = this.refs.form.getValue();
        if (this.state.forgotCreds) {
            if (formValues) {
                this.props.actions.resetPassword(formValues);
                this.toggleForgotCreds();
            }
        } else if (this.state.signUp) {
            if (formValues) {
                this.props.actions.register(formValues, this.asyncActions);
                this.setState({value: null});
            }
        } else {
            if (formValues) {
                this.props.actions.login({username: formValues.email, password: formValues.password}, this.asyncActions)
            }
        }
    },

    back() {
        this.setState({
            forgotCreds: false,
            signUp: false
        });
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
            <KeyboardAwareScrollView behavior='padding' style={GlobalStyle.noHeaderContainer} ref="scroll"
                                     contentContainerStyle={{flex: 1}}
                                     onKeyboardWillShow={this.changeKeyboard}
                                     onKeyboardWillHide={this.changeKeyboard}
                                     scrollEnabled={this.state.keyboard}>
                {this.state.forgotCreds || this.state.signUp ?
                    <BackBar back={this.back} backText='Log In'/>
                    : null
                }

                <View style={styles.logoView}>
                    <Image style={styles.logo} source={require('../assets/images/red-logo.png')}/>
                </View>

                <View style={!this.state.forgotCreds ? styles.contentContainer : {justifyContent: 'center', flex: .8}}>

                    <Form
                        ref="form"
                        type={User}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />

                    {!this.state.forgotCreds && !this.state.signUp ?
                        <TouchableOpacity activeOpacity={1} onPress={this.toggleForgotCreds}>
                            <Text style={styles.buttonForgotText}>Forgot your password?</Text>
                        </TouchableOpacity>
                        : null
                    }


                    <SubmitButton onPress={this.onPress} buttonStyle={[styles.button]} textStyle={styles.buttonText}
                                  text={!this.state.signUp && !this.state.forgotCreds ? 'Log In' : 'Submit'}/>

                    {!this.state.forgotCreds && !this.state.signUp ?
                        <SubmitButton onPress={this.toggleSignUp} ref="sign_button"
                                      buttonStyle={[styles.button]} textStyle={styles.buttonText}
                                      text="SIGN UP"/>
                        : null
                    }

                </View>

                { !this.state.forgotCreds ?
                    <TouchableOpacity style={styles.fbLogin} onPress={this.facebookLogin}>
                        <Icon name="facebook-official" size={getFontSize(22)} color="#3b5998"/>
                        <Text style={{color: '#3b5998', fontSize: getFontSize(22), paddingLeft: 10}}>
                            Login with Facebook
                        </Text>
                    </TouchableOpacity>
                    : null
                }

            </KeyboardAwareScrollView>
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
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#aaaaaa',
        flexDirection: 'row',
        // paddingBottom: 10
    },
    contentContainer: {
        flex: .6,
        justifyContent: 'flex-end',
    },
    logoView: {
        flex: .3,
        alignItems: 'center',
        // justifyContent: 'center',
        justifyContent: 'flex-end',
    },
    logo: {
        height: 100,
        width: 100,
    },
    buttonForgotText: {
        color: '#b1aea5',
        fontSize: getFontSize(22),
        fontFamily: 'OpenSans-SemiBold',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
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
        backgroundColor: '#f0f0f0',
        borderRadius: 0,
    },
    error: {
        ...stylesheet.textbox.error,
        backgroundColor: '#f0f0f0',
        borderRadius: 0,
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

export default connect(stateToProps, dispatchToProps)(Login);
