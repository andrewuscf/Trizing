import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {getFontSize} from '../actions/utils';

import CustomIcon from './CustomIcon';


const Save = React.createClass({
    propTypes: {
        save: React.PropTypes.func.isRequired,
        disabled: React.PropTypes.bool.isRequired,
        text: React.PropTypes.string,
    },

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.save} disabled={this.props.disabled}>
                {this.props.text ? <Text style={styles.text}>{this.props.text}</Text>
                    :
                    <CustomIcon name="done" size={25} color='#00AFA3'/>
                }
            </TouchableOpacity>
        );
    }
});


const styles = StyleSheet.create({
    container: {
        height: Platform.OS === 'ios' ? 44 : 56,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60
    },
    text: {
        color: '#00AFA3',
        fontSize: getFontSize(24),
        fontFamily: 'OpenSans-Semibold',
    }
});

export default Save;