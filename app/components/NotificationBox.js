import React from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native';

const NotificationBox = React.createClass({
    propTypes: {
        notification: React.PropTypes.object.isRequired,
        navigator: React.PropTypes.object.isRequired,
    },

    _onPress() {
        console.log('hit')
    },


    render() {
        const notification = this.props.notification;
        console.log(notification)
        return (
            <View style={styles.box}>
                <Text>test</Text>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    box: {
        height: 50,
        backgroundColor: 'white',
        borderColor: '#e1e3df',
        borderBottomWidth: .5
    }
});

export default NotificationBox;
