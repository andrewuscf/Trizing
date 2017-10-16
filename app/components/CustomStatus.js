import React from 'react';
const CreateClass = require('create-react-class');
import {
    StyleSheet,
    View,
    StatusBar,
    Platform,
} from 'react-native';
import PropTypes from 'prop-types';


export default CreateClass({
    propTypes: {
        backgroundColor: PropTypes.string,
        barStyle: PropTypes.string,
    },

    render() {
        const backgroundColor = this.props.backgroundColor;
        const barStyle = this.props.barStyle;
        return (
            <View style={[styles.statusBar, backgroundColor ? {backgroundColor} : {backgroundColor: 'white'}]}>
                <StatusBar backgroundColor={backgroundColor ? backgroundColor : 'white'}
                           barStyle={barStyle ? barStyle : "dark-content"}/>
            </View>
        )
    }
});

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT,
    },
});