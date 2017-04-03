import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';
import AvatarImage from './AvatarImage';
import moment from 'moment';

moment.updateLocale('en', {
    relativeTime: {
        mm: "%d mins"
    }
});

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');

const MessageBox = React.createClass({
    propTypes: {
        message: React.PropTypes.object.isRequired,
        position: React.PropTypes.string.isRequired,
    },

    render() {
        const message = this.props.message;
        console.log(message)
        let image = message.user.profile.thumbnail ? message.user.profile.thumbnail : message.user.profile.avatar
        return (
            <View style={[styles[this.props.position].container]}>
                {this.props.position == 'left' ?
                    <AvatarImage image={image} style={styles.left.messageAvatar}/>
                    : null
                }
                <View style={[styles.left.wrapper]}>
                    <Text>{message.message}</Text>
                </View>
            </View>
        )
    }
});

const styles = {
    left: StyleSheet.create({
        container: {
            flex: 1,
            margin: 5,
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        wrapper: {
            borderRadius: 15,
            backgroundColor: '#f0f0f0',
            maxWidth: deviceWidth * .75,
            marginLeft: 10,
            justifyContent: 'flex-end',
            padding: 10
        },
        messageAvatar: {
            height: 30,
            width: 30,
            borderRadius: 15
        }
    }),
    right: StyleSheet.create({
        container: {
            flex: 1,
            margin: 5,
            alignItems: 'flex-end',
        },
        wrapper: {
            borderRadius: 15,
            maxWidth: deviceWidth * .75,
            backgroundColor: '#f0f0f0',
            marginLeft: 10,
            justifyContent: 'flex-end',
            padding: 10
        },
        messageAvatar: {
            height: 30,
            width: 30,
            borderRadius: 15
        }
    }),
};

export default MessageBox;