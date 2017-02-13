import React, {Component} from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';

const Loading = React.createClass({
    render() {
        // <View style={styles.logoContainer}>
        //     <Image style={styles.logo} source={require('../assets/images/small-white-logo.png')}/>
        // </View>
        return (
            <View style={styles.container}>
                
                
                <View style={styles.iconContainer}>
                    <Image style={styles.icon} source={require('../assets/images/wait-white.gif')}/>
                </View>
            </View>
        )
    }
});

const window = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00BFFF',
        justifyContent: 'flex-end',
    },
    logoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100
    },
    iconContainer: {
        marginBottom: window.height / 8,
        alignItems: 'center',
    },
    icon: {
        width: 36,
        height: 9,
        backgroundColor: '#00BFFF'
    }
});

export default Loading;
