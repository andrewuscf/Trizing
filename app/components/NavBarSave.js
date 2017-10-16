import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity, Platform, ActivityIndicator, Keyboard} from 'react-native';
import {getFontSize} from '../actions/utils';

import CustomIcon from './CustomIcon';


const Save = CreateClass({
    propTypes: {
        save: PropTypes.func.isRequired,
        disabled: PropTypes.bool.isRequired,
    },

    _onPress() {
        Keyboard.dismiss();
        this.props.save();
    },

    render() {
        let content = null;
        if (this.props.disabled) {
            content = <ActivityIndicator animating={true} size='small'/>;
        } else if (typeof this.props.text === "string") {
            content = <Text style={styles.text}>{this.props.text}</Text>;
        } else if (this.props.text) {
            content = this.props.text;
        } else {
            content = <CustomIcon name="done" size={getFontSize(25)} color='#00AFA3'/>;
        }
        return (
            <TouchableOpacity style={styles.container} onPress={this._onPress} disabled={this.props.disabled}>
                {content}
            </TouchableOpacity>
        );
    }
});


const styles = StyleSheet.create({
    container: {
        height: Platform.OS === 'ios' ? 44 : 56,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50
    },
    text: {
        color: '#00AFA3',
        fontFamily: 'Heebo-Medium',
        fontSize: getFontSize(16)
    }
});

export default Save;