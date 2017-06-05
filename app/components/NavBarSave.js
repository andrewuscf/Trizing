import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import {getFontSize} from '../actions/utils';


const Save = React.createClass({
    propTypes: {
        save: React.PropTypes.func.isRequired,
        text: React.PropTypes.string,
    },

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.save}>
                <Text style={styles.text}>
                    {this.props.text ? this.props.text : 'Save'}
                </Text>
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