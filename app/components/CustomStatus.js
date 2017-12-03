import React from 'react';
const CreateClass = require('create-react-class');
import {
    StyleSheet,
    View,
    StatusBar,
    Platform,
    Dimensions
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

const isIphoneX = () => {
    let d = Dimensions.get('window');
    console.log(d);
    const {height, width} = d;

    return (
        // This has to be iOS duh
        Platform.OS === 'ios' &&

        // Accounting for the height in either orientation
        (height === 812 || width === 812)
    );
};

// const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

// StatusBarHeight is where Carrier info and date display at top
// iPhone X has a cut-out in top of dispaly where sensor package is located.
// For iPhone X increase height so cut-out does not hide text
const StatusBarHeightIos = isIphoneX() ? 44 : 20;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? StatusBarHeightIos : 0;

const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT,
    },
});