import React from 'react';

const CreateClass = require('create-react-class');
import {View, ActivityIndicator, StyleSheet, Text, Image, Dimensions, AsyncStorage} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {purgeStoredState} from 'redux-persist';

import {removeToken, initializeApp} from '../actions/globalActions';
import {resetNav, letterSpacing, getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

import CustomStatus from '../components/CustomStatus';
import SubmitButton from '../components/SubmitButton';


const {width: deviceWidth} = Dimensions.get('window');

const SplashScreen = CreateClass({

    getInitialState() {
        return {
            width: 0,
            height: 0
        }
    },

    componentDidMount() {
        this.props.initializeApp();
    },

    componentDidUpdate(prevProps) {
        if (this.props.AppIsReady && (prevProps.AppIsReady !== this.props.AppIsReady || prevProps.RequestUser !== this.props.RequestUser)) {
            if (this.props.RequestUser && this.props.RequestUser.profile.completed && this.props.navigation.state.routeName !== 'Home') {
                this._navigateTo('Home')
            } else if (this.props.RequestUser && !this.props.RequestUser.profile.completed && this.props.navigation.state.routeName !== 'EditProfile') {
                this._navigateTo('EditProfile')
            }
        } else if (!this.props.AppIsReady && this.props.AppIsReady !== prevProps.AppIsReady) {
            return purgeStoredState({storage: AsyncStorage}).then(() => {
                this.props.removeToken();
            }).catch(() => {
                console.log('purge of someReducer failed')
            });
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
                    <Text style={[styles.titleStyle, GlobalStyle.redText]}>{letterSpacing('TrainerBase', 3)}</Text>
                </View>
                <View style={styles.center} onLayout={this.setSize}>
                    {/*<View style={{flex: 1}}>*/}
                    {/*<Image style={[styles.splashImage, {height: this.state.height - 100}]}*/}
                    {/*source={require('../assets/images/stronger.jpg')}/>*/}
                    {/*<Text style={styles.splashText}>Workouts made simple</Text>*/}
                    {/*</View>*/}
                </View>
                <View style={styles.bottom}>
                    <SubmitButton onPress={() => navigate('Login')} text="LOG IN"
                                  buttonStyle={[styles.button, {marginBottom: 20}]}/>
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
    titleStyle: {
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
        removeToken: bindActionCreators(removeToken, dispatch),
        initializeApp: bindActionCreators(initializeApp, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(SplashScreen);

//
// export default SplashScreen;
