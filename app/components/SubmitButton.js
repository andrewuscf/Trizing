import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {TouchableOpacity, View, Image, Text, StyleSheet, ActivityIndicator} from 'react-native';

const SubmitButton = CreateClass({
    propTypes: {
        onPress: PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            busy: false,
            disabled: this.props.disabled
        }
    },


    onPress: function () {
        if (!this.state.busy && !this.props.disabled) {
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
            <TouchableOpacity style={[styles.button, this.props.buttonStyle, actionstyle]} onPress={this.onPress}
                              activeOpacity={.8}>
                <View style={styles.wrapper}>
                    <View style={[styles.iconWrapper, {opacity: (!this.state.busy) ? 0 : 1}]}>
                        <ActivityIndicator animating={this.state.busy} size='small'/>
                    </View>
                    <Text style={[styles.buttonText, {opacity: (this.state.busy) ? 0 : 1}, this.props.textStyle]}>
                        {content}
                    </Text>
                </View>
            </TouchableOpacity>
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
        color: '#00AFA3',
        fontFamily: 'Heebo-Bold',
        alignItems: 'center'
    },
    button: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00AFA3',
        // paddingTop: 10,
        // paddingBottom: 10,
        // paddingLeft: 15,
        // paddingRight: 15,
        borderRadius: 7,
        height: 55,
        margin: 20,
        marginRight: 40,
        marginLeft: 40
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
        height: 20,
    }
});

export default SubmitButton;
