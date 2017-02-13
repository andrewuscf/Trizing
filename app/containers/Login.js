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


    render() {
        // <Image style={styles.logo} source={require('../assets/images/small-white-logo.png')}/>
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>


                    <View style={styles.inputWrap}>
                        <TextInput ref="email" style={styles.textInput} autoCapitalize='none'
                                   keyboardType='email-address'
                                   autoCorrect={false}
                                   onChangeText={(text)=>this.setState({email: text})}
                                   value={this.state.email}
                                   onSubmitEditing={(event) => {
                                        this.refs.password.focus();
                                   }}
                                   placeholderTextColor="black"
                                   placeholder="Email"/>
                    </View>

                    {(!this.state.forgotCreds) ? <View style={styles.inputWrap}>
                        <TextInput ref="password" style={styles.textInput} autoCapitalize='none' secureTextEntry={true}
                                   autoCorrect={false}
                                   onChangeText={(text)=>this.setState({password: text})}
                                   value={this.state.password}
                                   onSubmitEditing={(event) => {
                                        this.onPress();
                                   }}
                                   placeholderTextColor="black"
                                   placeholder="Password"/>
                    </View> : null}

                    {(this.state.signUp) ?
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={this.selectType.bind(null, 1)}
                                              style={[styles.typeButtons, this.state.type == 1 ? styles.selectedType : styles.notSelected]}>
                                <Text style={this.state.type == 1 ? styles.selectedText : styles.notSelectedText}>Trainer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.selectType.bind(null, 2)}
                                              style={[styles.typeButtons, this.state.type == 2 ? styles.selectedType : styles.notSelected]}>
                                <Text style={this.state.type == 2 ? styles.selectedText : styles.notSelectedText}>Client</Text>
                            </TouchableOpacity>
                        </View> : null}

                    <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>{(!this.state.forgotCreds) ? 'SIGN IN' : 'RESET'}</Text>
                    </TouchableHighlight>
                </ScrollView>
                <View style={styles.extraButtons}>
                    <TouchableOpacity style={styles.bottomButtons} onPress={this.toggleForgotCreds} focusedOpacity={1} activeOpacity={1}>
                        <Text style={styles.buttonForgotText}>{(!this.state.forgotCreds) ? 'Forgot?' : 'Cancel'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomButtons} onPress={this.toggleSignUp}>
                        <Text style={styles.buttonForgotText}>{(this.state.signUp) ? 'Cancel' : 'Sign up'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    logo: {
        width: 154,
        height: 70,
        marginTop: 100,
        marginBottom: 100,
    },
    inputWrap: {
        alignSelf: 'stretch',
        // marginTop: 5,
        marginBottom: 12,
        paddingLeft: 3,
        height: 40,
        borderBottomWidth: 1,
        borderColor: 'black'
    },
    nameFields: {
        flexDirection: 'row',
    },
    nameInput: {
        flex: 2
    },
    textInput: {
        color: 'black',
        fontSize: 17,
        // fontFamily: 'OpenSans-Semibold',
        // borderWidth: 0,
        backgroundColor: 'transparent',
        padding: 3,
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
        borderColor: 'white',
    },
    selectedType: {
        backgroundColor: 'black'
    },
    selectedText: {
        color: '#00BFFF',
        fontSize: 14
        // fontFamily: 'OpenSans-Bold',
        // textDecorationLine: 'none'
    },
    notSelectedText: {
        color: 'black',
        fontSize: 14
        // fontFamily: 'OpenSans-Bold',
        // textDecorationLine: 'none'
    },
    buttonText: {
        color: '#00BFFF',
        fontSize: 15
        // fontFamily: 'OpenSans-Bold',
    },
    button: {
        marginTop: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 21
    },
    buttonForgotText: {
        color: 'black',
        fontSize: 14,
        // fontFamily: 'OpenSans-Bold',
        // textDecorationLine: 'underline'
    },
    extraButtons: {
        height: 50,
        bottom: 0,
        left: 0,
        flexDirection: 'row'
    },
    bottomButtons: {
        flex: 2,
        backgroundColor: '#1fc8fc',
        opacity: .5,
        borderWidth:1,
        borderColor: '#84defa',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Login;
