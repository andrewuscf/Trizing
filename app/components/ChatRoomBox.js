import React from 'react';
const CreateClass = require('create-react-class');
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import FontIcon from 'react-native-vector-icons/FontAwesome';

import AvatarImage from './AvatarImage';
import {getFontSize, trunc} from "../actions/utils";
import GlobalStyle from "../containers/globalStyle";

moment.updateLocale('en', {
    relativeTime: {
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        s: "%ds",
        d: "1d",
        dd: "%dd",
    }
});

const ChatRoomBox = CreateClass({
    propTypes: {
        room: PropTypes.object.isRequired,
        _redirect: PropTypes.func.isRequired,
        RequestUser: PropTypes.object.isRequired,
        chatNotifications: PropTypes.array.isRequired
    },

    _toRoom() {
        this.props._redirect('ChatRoom', {room_label: this.props.room.label});
    },

    trimToLength(text, m) {
        return (text.length > m)
            ? text.substring(0, m).split(" ").slice(0, -1).join(" ") + "..."
            : text;
    },

    render() {
        const room = this.props.room;
        console.log(room)
        let avatar = null;
        let title = '';
        let lastMessage = '';
        const hasUnread = this.props.chatNotifications.length > 0;
        if (room.last_message) {
            lastMessage = room.last_message.text;
        }
        let sender = room.all_users[room.all_users.length - 1];
        if (this.props.RequestUser.id === sender.id && room.all_users.length > 1) {
            sender = room.all_users[room.all_users.length - 2];
        }
        if (sender) {
            avatar = sender.avatar;
            title = sender.name;
        }
        console.log(room.last_message)
        // let image = sender.profile.thumbnail ? sender.profile.thumbnail : sender.profile.avatar;
        return (
            <TouchableHighlight style={styles.container} onPress={this._toRoom} underlayColor='white'>
                <View style={styles.inner}>
                    <AvatarImage image={avatar} style={styles.avatar}/>
                    <View style={styles.details}>
                        <Text style={styles.actor}>{title}</Text>
                        {room.last_message ?
                            <Text style={styles.sender}>
                                {room.last_message.user.id !== this.props.RequestUser.id ?
                                    <Text style={styles.senderName}>{room.last_message.user.name.split(' ')[0]}:</Text>
                                    : null
                                }
                                <Text style={styles.smallText}> {trunc(lastMessage, 40)}</Text>
                            </Text> :
                            null
                        }
                    </View>
                    <View style={styles.rightSec}>
                        {(room.last_message ) ?
                            <Text style={[styles.timeAgo]}>
                                {moment(room.last_message.createdAt).fromNow(false)}
                            </Text>
                            : null
                        }
                        {hasUnread ?
                            <FontIcon name="circle" style={[GlobalStyle.lightBlueText, {paddingTop: 5}]}/> : null}
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        backgroundColor: 'white',
        marginBottom: 5,
        borderRadius: 5,
    },
    inner: {
        flex: 1,
        flexDirection: 'row',
        margin: 15,
        flexWrap: 'wrap'
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    details: {
        flex: .9,
        paddingTop: 5,
        paddingLeft: 10,
    },
    smallText: {
        fontFamily: 'Heebo-Medium',
        color: '#7f7f7f'
    },
    sender: {
        fontFamily: 'Heebo-Medium',
        color: '#3D3C3A'
    },
    senderName: {
        fontFamily: 'Heebo-Medium',
        color: '#3D3C3A',
        fontSize: getFontSize(12)
    },
    timeAgo: {
        paddingLeft: 6,
        color: 'rgba(0,0,0,.45)',
    },
    rightSec: {
        // justifyContent: 'center',
        alignItems: 'flex-end'
    },
    actor: {
        fontFamily: 'Heebo-Medium',
        color: '#00AFA3',
        fontSize: getFontSize(16)
    },
});

export default ChatRoomBox;