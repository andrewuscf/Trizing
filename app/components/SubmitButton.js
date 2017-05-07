import React, {Component} from 'react';
import {TouchableHighlight, View, Image, Text, StyleSheet} from 'react-native';

const SubmitButton = React.createClass({
    propTypes: {
        onPress: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            busy: false,
            disabled: this.props.disabled
        }
    },


    onPress: function () {
        if (this.state.busy) {
            console.log('This button is busy -- onPress blocked');
        } else if (this.props.disabled) {
            console.log('This button is disabled -- onPress blocked');
        } else {
            this.props.onPress();
        }
    },
    render() {

        // button style based on action
        let actionstyle = null;
        if (this.state.busy) {
            actionstyle = styles.activeButtonStyle;
        } else if (this.props.disabled) {
            actionstyle = styles.disabledButtonStyle;
        }

        // text or icon?
        let content = null;
        // if(this.props.iconName){
        //     content = <MiddleIcon name={this.props.iconName} size={14} color='#fff'/>
        // }else{
        content = this.props.text;
        // }

        // render
        return (
            <TouchableHighlight style={[styles.button, this.props.buttonStyle, actionstyle]} onPress={this.onPress}
                                underlayColor='#99d9f4'>
                <View style={styles.wrapper}>
                    <View style={[styles.iconWrapper, {opacity:(!this.state.busy)?0:1}]}>
                        <Image style={styles.icon} source={require('../assets/images/wait-white.gif')}/>
                    </View>
                    <Text style={[styles.buttonText, {opacity:(this.state.busy)?0:1}, this.props.textStyle]}>
                        {content}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
});

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabledButtonStyle: {
        backgroundColor: '#d9d6cd'
    },
    activeButtonStyle: {
        backgroundColor: '#fff'
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    },
    button: {
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 21,
        height: 60,
        margin: 20,
    },
    iconWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 36,
        height: 9,
    }
});

export default SubmitButton;
