import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

const NotificationBox = React.createClass({
    propTypes: {
        notification: React.PropTypes.object.isRequired,
        navigator: React.PropTypes.object.isRequired,
    },

    onPress(userId) {
        if (this.props.redirect) {
            this.props.redirect();
        }
    },


    render() {
        return <View></View>;
    }
});

var styles = StyleSheet.create({
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25
    }
});

export default NotificationBox;
