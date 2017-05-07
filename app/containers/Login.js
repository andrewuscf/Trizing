import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Keyboard
} from 'react-native';
import {
    LoginButton,
    AccessToken,
    LoginManager
} from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/FontAwesome';
import Hr from '../components/HR';

import BackBar from '../components/BackBar';
import SubmitButton from '../components/SubmitButton';

const {height, width} = Dimensions.get('window');

const Login = React.createClass({
    propTypes: {
        login: React.PropTypes.func.isRequired,
        resetPassword: React.PropTypes.func.isRequired,
        register: React.PropTypes.func.isRequired,
        socialAuth: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            email: null,
            username: null,
            password: null,
            forgotCreds: false,
            signUp: false,
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
            email: null,
            username: null
        });
    },

    onPress() {
        // sign in + forgot credentials
        Keyboard.dismiss();
        if (this.state.forgotCreds) {
            if (this.state.email) {
                this.props.resetPassword(this.state.email.toLowerCase());
                this.toggleForgotCreds();
            }
        } else if (this.state.signUp) {
            if (this.state.username && this.state.email && this.state.password) {
                const data = {
                    email: this.state.email.toLowerCase(),
                    username: this.state.username.toLowerCase(),
                    password: this.state.password,
                };
                this.props.register(data, this.asyncActions);
                this.resetComponent();
            }
        } else {
            if (this.state.email && this.state.password) {
                this.props.login(this.state.email.toLowerCase(), this.state.password, this.asyncActions)
            }
        }
    },

    resetComponent() {
        this.setState({
            email: null,
            username: null,
            password: null,
        });
    },

    back() {
        this.setState({
            forgotCreds: false,
            signUp: false
        });
    },


    render() {
        // <Image style={styles.logo} source={require('../assets/images/small-white-logo.png')}/>
        return (
            <View style={styles.container}>
                {this.state.forgotCreds || this.state.signUp ?
                    <BackBar back={this.back} backText='Log In'/>
                    : null
                }

                {!this.state.forgotCreds && !this.state.signUp ?
                    <Text style={styles.logo}>LOGO</Text>
                    : null
                }

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

                { !this.state.forgotCreds ?
                    <Hr text='OR'
                        lineStyle={{
                            backgroundColor: "#aaaaaa",
                        }}
                        textStyle={{
                            color: "#aaaaaa",
                        }}
                    />
                    : null
                }

                <View style={styles.contentContainer}>

                    {(this.state.signUp) ?
                        <View style={styles.inputWrap}>
                            <TextInput ref="username" style={styles.textInput} autoCapitalize='none'
                                       underlineColorAndroid='transparent'
                                       autoCorrect={false}
                                       onChangeText={(text) => this.setState({username: text})}
                                       value={this.state.username}
                                       onSubmitEditing={(event) => {
                                           this.refs.email.focus();
                                       }}
                                       placeholderTextColor="black"
                                       placeholder="Username"/>
                        </View> : null
                    }

                    <View style={styles.inputWrap}>
                        <TextInput ref="email" style={styles.textInput} autoCapitalize='none'
                                   keyboardType='email-address'
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChangeText={(text) => this.setState({email: text})}
                                   value={this.state.email}
                                   onSubmitEditing={(event) => {
                                       this.refs.password.focus();
                                   }}
                                   placeholderTextColor="black"
                                   placeholder={this.state.signUp ? 'Email' : 'Email or username'}/>
                    </View>

                    {(!this.state.forgotCreds) ?
                        <View style={styles.inputWrap}>
                            <TextInput ref="password" style={styles.textInput} autoCapitalize='none'
                                       underlineColorAndroid='transparent'
                                       secureTextEntry={true}
                                       autoCorrect={false}
                                       onChangeText={(text) => this.setState({password: text})}
                                       value={this.state.password}
                                       onSubmitEditing={(event) => {
                                           this.onPress();
                                       }}
                                       placeholderTextColor="black"
                                       placeholder="Password"/>
                            <TouchableOpacity onPress={this.toggleForgotCreds} style={{flex: 1}} focusedOpacity={1}
                                              activeOpacity={1}>
                                <Icon name="question-circle-o" size={20} style={styles.forgotIcon}/>
                            </TouchableOpacity>
                        </View>
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
        flex: .3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: .8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: 70,
        alignSelf: 'center'
    },
    inputWrap: {
        alignSelf: 'center',
        marginBottom: 12,
        height: 40,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        width: width * .80,
    },
    textInput: {
        color: 'black',
        fontSize: 17,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        height: 40
    },
    forgotIcon: {
        color: '#424242',
        bottom: 8,
        right: 0,
        position: 'absolute'

    },
    buttonText: {
        color: '#1352e2',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    },
    button: {
        marginTop: 20,
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

export default Login;
