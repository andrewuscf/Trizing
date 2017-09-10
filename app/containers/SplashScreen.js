import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as GlobalActions from '../actions/globalActions';
import {resetNav, letterSpacing, getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

import CustomStatus from '../components/CustomStatus';
import SubmitButton from '../components/SubmitButton';


const {width: deviceWidth} = Dimensions.get('window');

const SplashScreen = React.createClass({

    getInitialState() {
        return {
            width: 0,
            height: 0
        }
    },

    componentDidMount() {
        this.props.initializeApp();
        if (this.props.AppIsReady) {
            if (this.props.RequestUser && this.props.RequestUser.profile.completed) {
                this._navigateTo('Main')
            } else if (this.props.RequestUser && !this.props.RequestUser.profile.completed) {
                this._navigateTo('EditProfile')
            }
        }
    },

    componentDidUpdate() {
        if (this.props.AppIsReady) {
            if (this.props.RequestUser && this.props.RequestUser.profile.completed) {
                this._navigateTo('Main')
            } else if (this.props.RequestUser && !this.props.RequestUser.profile.completed) {
                this._navigateTo('EditProfile')
            }
        }
    },

    _navigateTo(routeName) {
        const actionToDispatch = resetNav(routeName);
        this.props.navigation.dispatch(actionToDispatch)
    },

    setSize(event) {
        const w = event.nativeEvent.layout.width;
        const h = event.nativeEvent.layout.height;
        this.setState({width: w, height: h});
    },


    render() {
        if (!this.props.AppIsReady) {
            return (
                <View style={styles.page}>
                    <ActivityIndicator animating={true} size='large'/>
                </View>
            )
        }
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <CustomStatus/>
                {/*<Image style={[{flex: 1, position: 'absolute', width: deviceWidth}]}*/}
                       {/*source={require('../assets/images/background.jpg')}/>*/}
                <View style={styles.top}>
                    <Image style={styles.logo} source={require('../assets/images/new-logo.png')}/>
                    <Text style={[styles.trizing, GlobalStyle.redText]}>{letterSpacing('SimpleCoach', 3)}</Text>
                </View>
                <View style={styles.center} onLayout={this.setSize}>
                    {/*<View style={{flex: 1}}>*/}
                        {/*<Image style={[styles.splashImage, {height: this.state.height - 100}]}*/}
                               {/*source={require('../assets/images/stronger.jpg')}/>*/}
                        {/*<Text style={styles.splashText}>Workouts made simple</Text>*/}
                    {/*</View>*/}
                </View>
                <View style={styles.bottom}>
                    <SubmitButton onPress={() => navigate('Login')} text="LOG IN" buttonStyle={[styles.button, {marginBottom: 20}]}/>
                    <SubmitButton onPress={() => navigate('SignUp')} text="GET STARTED" buttonStyle={styles.button}/>
                    {/*<TouchableOpacity style={styles.login} onPress={() => navigate('Login')}>*/}
                        {/*<Text style={styles.loginText}>Already have an account?*/}
                            {/*<Text style={GlobalStyle.redText}> Log In</Text>*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={styles.signUpButton} onPress={() => navigate('SignUp')}>*/}
                        {/*<Text style={styles.signUpText}>*/}
                            {/*GET STARTED*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
    },
    button: {
        marginTop: 0,
        marginBottom: 0
    },
    top: {
        flex: .2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    center: {
        flex: .5
    },
    splashImage: {
        width: deviceWidth,
        resizeMode: 'contain'
    },
    splashText: {
        fontSize: getFontSize(18),
        textAlign: 'center',
        fontFamily: 'Heebo-Medium',
        color: '#00AFA3'
    },
    bottom: {
        flex: .3
    },
    logo: {
        width: 50,
        height: 50
    },
    trizing: {
        fontFamily: 'Heebo-Bold',
        fontSize: getFontSize(32),
        paddingLeft: 5
    },
    login: {
        flex: .5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#999999',
        fontFamily: 'Heebo-Medium',
    },
    signUpButton: {
        flex: .5,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#aaaaaa',
        flexDirection: 'row',
        backgroundColor: '#00AFA3'
    },
    signUpText: {
        color: 'white',
        fontSize: getFontSize(20),
        paddingLeft: 10,
        fontFamily: 'Heebo-Bold',
    }
});

const stateToProps = (state) => {
    return {
        ...state.Global,
    };
};

const dispatchToProps = (dispatch) => {
    return {
        removeToken: bindActionCreators(GlobalActions.removeToken, dispatch),
        setTokenInRedux: bindActionCreators(GlobalActions.setTokenInRedux, dispatch),
        initializeApp: bindActionCreators(GlobalActions.initializeApp, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(SplashScreen);

//
// export default SplashScreen;
