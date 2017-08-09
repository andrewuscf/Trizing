import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Platform, ActivityIndicator} from 'react-native';
import {getFontSize} from '../actions/utils';

import CustomIcon from './CustomIcon';


const Save = React.createClass({
    propTypes: {
        save: React.PropTypes.func.isRequired,
        disabled: React.PropTypes.bool.isRequired,
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
            <TouchableOpacity style={styles.container} onPress={this.props.save} disabled={this.props.disabled}>
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
    }
});

export default Save;