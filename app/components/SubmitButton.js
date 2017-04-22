import React, {Component} from 'react';
import {TouchableHighlight, View, Image, Text, StyleSheet} from 'react-native';

const SubmitButton = React.createClass({
    getInitialState() {
        return {
            busy: false,
            disabled: this.props.disabled
        }
    },
    onPress: function () {
        if (!this.state.busy && !this.state.disabled) {
            this.props.onPress();
        }
    },
    render() {

        // button style based on action
        let actionstyle = null;
        if (this.state.busy) {
            actionstyle = styles.activeButtonStyle;
        } else if (this.state.disabled) {
            actionstyle = styles.disabledButtonStyle;
        }

        // text or icon?
        let content = this.props.text;

        // render
        return (
            <TouchableHighlight style={[this.props.buttonStyle, actionstyle]} onPress={this.onPress}
                                underlayColor='#99d9f4' activeOpacity={1}>
                <View style={styles.wrapper}>
                    {this.state.busy ?
                        <View style={[styles.iconWrapper]}>
                            <Image style={[styles.icon, this.props.iconStyle]}
                                   source={require('../assets/images/wait-white.gif')}/>
                        </View> :
                        <Text style={[this.props.textStyle, styles.submitText]}>
                            {content}
                        </Text>
                    }
                </View>
            </TouchableHighlight>
        )
    }
});

const styles = StyleSheet.create({
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabledButtonStyle: {
        backgroundColor: '#d9d6cd'
    },
    activeButtonStyle: {
        backgroundColor: '#fff'
    },
    iconWrapper: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    icon: {
        width: 36,
        height: 9
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    },
});

export default SubmitButton;
