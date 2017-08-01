import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Swiper from 'react-native-swiper';

import * as GlobalActions from '../actions/globalActions';
import {resetNav, letterSpacing} from '../actions/utils';
import GlobalStyle from './globalStyle';

import CustomStatus from '../components/CustomStatus';


const {width: deviceWidth} = Dimensions.get('window');

const SplashScreen = React.createClass({

    componentDidMount () {
        this.props.initializeApp();
    },

    componentDidUpdate () {
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
                <View style={styles.top}>
                    <Image style={styles.logo} source={require('../assets/images/red-logo.png')}/>
                    <Text style={[styles.trizing]}>{letterSpacing('TRIZING', 20)}</Text>
                </View>
                <View style={styles.center}>
                    <Swiper style={styles.wrapper} showsButtons={false} activeDotColor="green" dotColor="#ece9e5">
                        <View style={{flex: 1}}>
                            <Image style={styles.splashImage} source={require('../assets/images/better.jpg')}/>
                            <Text style={styles.splashText}>Workouts made simple</Text>
                        </View>
                        <View style={styles.slide2}>
                            <Image style={styles.splashImage} source={require('../assets/images/stronger.jpg')}/>
                            <Text style={styles.splashText}>Find a certified trainer</Text>
                        </View>
                        <View style={styles.slide3}>
                            <Image style={styles.splashImage} source={require('../assets/images/stronger.jpg')}/>
                            <Text style={styles.splashText}>Create an account. It's free.</Text>
                        </View>
                    </Swiper>
                </View>
                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.login} onPress={()=> navigate('Login')}>
                        <Text style={styles.loginText}>Already have an account?
                            <Text style={GlobalStyle.redText}> Log In</Text>
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signUpButton} onPress={()=> navigate('SignUp')}>
                        <Text style={styles.signUpText}>
                            GET STARTED
                        </Text>
                    </TouchableOpacity>
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
    top: {
        flex: .2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    center: {
        flex: .6
    },
    splashImage: {
        height: 250,
        width: deviceWidth,
        resizeMode: 'contain'
    },
    splashText: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Heebo-Medium',
        color: '#00AFA3'
    },
    bottom: {
        flex: .2,
    },
    logo: {
        width: 50,
        height: 50
    },
    trizing: {
        fontFamily: 'Heebo-Bold',
        fontSize: 22,
    },
    login: {
        flex: .5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#999999',
        fontSize: 14,
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
        fontSize: 20,
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
