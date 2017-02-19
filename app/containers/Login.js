import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    TextInput
} from 'react-native';
import {
    LoginButton,
    AccessToken
} from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/FontAwesome';

import BackBar from '../components/BackBar';

const Login = React.createClass({
    propTypes: {
        login: React.PropTypes.func.isRequired,
        resetPassword: React.PropTypes.func.isRequired,
        register: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            email: null,
            password: null,
            forgotCreds: false,
            signUp: false,
            type: null
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
            signUp: !this.state.signUp
        });
    },

    onPress() {
        // sign in + forgot credentials
        if (this.state.forgotCreds) {
            if (this.state.email) {
                this.props.resetPassword(this.state.email.toLowerCase());
                this.toggleForgotCreds();
            }
        } else if (this.state.signUp) {
            if (this.state.email && this.state.password && this.state.type) {
                const data = {
                    email: this.state.email.toLowerCase(),
                    password: this.state.password,
                    type: this.state.type
                };
                this.props.register(data);
                this.resetComponent();
            }
        } else {
            if (this.state.email && this.state.password) {
                this.props.login(this.state.email.toLowerCase(), this.state.password)
            }
        }
    },

    resetComponent() {
        this.setState({
            email: null,
            password: null,
            forgotCreds: false,
            signUp: false,
            type: null
        });
    },

    selectType(num) {
        this.setState({
            type: num
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
                {this.state.forgotCreds || this.state.signUp ? <BackBar back={this.back}/> : null}

                <Text style={styles.logo}>LOGO</Text>

                <View style={styles.fbLogin}>
                    <LoginButton
                        publishPermissions={["publish_actions"]}
                        onLoginFinished={
                            (error, result) => {
                                if (error) {
                                    alert("login has error: " + result.error);
                                } else if (result.isCancelled) {
                                    alert("login is cancelled.");
                                } else {
                                    AccessToken.getCurrentAccessToken().then(
                                        (data) => {
                                            alert(data.accessToken.toString())
                                        }
                                    )
                                }
                            }
                        }
                        onLogoutFinished={() => alert("logout.")}/>
                </View>
                <View style={styles.contentContainer}>

                    <View style={styles.inputWrap}>
                        <TextInput ref="email" style={styles.textInput} autoCapitalize='none'
                                   keyboardType='email-address'
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChangeText={(text)=>this.setState({email: text})}
                                   value={this.state.email}
                                   onSubmitEditing={(event) => {
                                       this.refs.password.focus();
                                   }}
                                   placeholderTextColor="black"
                                   placeholder="Email"/>
                    </View>

                    {(!this.state.forgotCreds) ?
                        <View style={styles.inputWrap}>
                            <TextInput ref="password" style={styles.textInput} autoCapitalize='none'
                                       underlineColorAndroid='transparent'
                                       secureTextEntry={true}
                                       autoCorrect={false}
                                       onChangeText={(text)=>this.setState({password: text})}
                                       value={this.state.password}
                                       onSubmitEditing={(event) => {
                                           this.onPress();
                                       }}
                                       placeholderTextColor="black"
                                       placeholder="Password"/>
                            <TouchableOpacity onPress={this.toggleForgotCreds} focusedOpacity={1}
                                              activeOpacity={1}>
                                <Icon name="question-circle-o" size={20} style={styles.forgotIcon}/>
                            </TouchableOpacity>
                        </View>
                        : null
                    }

                    {(this.state.signUp) ?
                        <View style={{flexDirection: 'row', paddingTop: 50}}>
                            <TouchableOpacity onPress={this.selectType.bind(null, 1)}
                                              style={[styles.typeButtons, this.state.type == 1 ? styles.selectedType : styles.notSelected]}>
                                <Text style={this.state.type == 1 ? styles.selectedText : styles.notSelectedText}>Trainer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.selectType.bind(null, 2)}
                                              style={[styles.typeButtons, this.state.type == 2 ? styles.selectedType : styles.notSelected]}>
                                <Text
                                    style={this.state.type == 2 ? styles.selectedText : styles.notSelectedText}>Client</Text>
                            </TouchableOpacity>
                        </View> : null}

                    <TouchableOpacity style={[styles.button]} onPress={this.onPress}>
                        <Text style={styles.buttonText}>{!this.state.signUp ? 'Log In' : 'Submit'}</Text>
                    </TouchableOpacity>

                    {!this.state.forgotCreds && !this.state.signUp ?
                        <TouchableOpacity style={[styles.button]} onPress={this.toggleSignUp}>
                            <Text style={styles.buttonText}>SIGN UP</Text>
                        </TouchableOpacity>
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
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
    },
    contentContainer: {
        flex: 1.4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 40,
        paddingRight: 40,
        // alignSelf: 'stretch'
    },
    logo: {
        // width: 154,
        height: 70,
        alignSelf: 'center'
        // marginTop: 100,
        // marginBottom: 100,
    },
    inputWrap: {
        alignSelf: 'stretch',
        marginBottom: 12,
        height: 40,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
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
    typeButtons: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10
    },
    notSelected: {
        borderWidth: 1,
        borderColor: '#1352e2',
        backgroundColor: 'transparent'
    },
    selectedType: {
        backgroundColor: '#1352e2'
    },
    selectedText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'OpenSans-Bold',
        // textDecorationLine: 'none'
    },
    forgotIcon: {
        color: '#424242',
        bottom: 8,
        right: 0,
        position: 'absolute'

    },
    notSelectedText: {
        color: '#1352e2',
        fontSize: 14,
        fontFamily: 'OpenSans-Bold',
        // textDecorationLine: 'none'
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
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 21
    },
    bottomButton: {
        height: 50,
        bottom: 0,
        left: 0,
        backgroundColor: '#22c064',
        opacity: .5,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default Login;
