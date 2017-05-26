import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableHighlight,
} from 'react-native';
import moment from 'moment';

import AvatarImage from './AvatarImage';

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

const ChatRoomBox = React.createClass({
    propTypes: {
        room: React.PropTypes.object.isRequired,
        _redirect: React.PropTypes.func.isRequired,
        RequestUser: React.PropTypes.object.isRequired,
    },

    _toRoom() {
        this.props._redirect('ChatRoom', {roomId: this.props.room.id});
    },

    trimToLength(text, m) {
        return (text.length > m)
            ? text.substring(0, m).split(" ").slice(0, -1).join(" ") + "..."
            : text;
    },

    render() {
        const room = this.props.room;
        console.log(room)
        return null;
        let sender = room.users[room.users.length - 1];
        if (this.props.RequestUser.id == sender.id && room.users.length > 1) {
            sender = room.users[room.users.length - 2];
        }
        let image = sender.profile.thumbnail ? sender.profile.thumbnail : sender.profile.avatar
        return (
            <TouchableHighlight style={styles.container} onPress={this._toRoom} underlayColor='white'>
                <View style={styles.inner}>
                    <AvatarImage image={sender.profile.avatar}/>
                    <View style={styles.details}>
                        <Text style={styles.name}>{sender.profile.first_name} {sender.profile.last_name[0]}.</Text>
                        {(room.last_message && room.last_message.message) ?
                            <View style={styles.lastMessageSection}>
                                <Text style={styles.bold}>{this.trimToLength(room.last_message.message, 25)}</Text>
                                <Text style={styles.timeAgo}>{moment(room.last_message.timestamp).fromNow(false)}</Text>

                            </View> : null
                        }
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomWidth: .5,
        borderBottomColor: 'rgba(0,0,0,.15)',
        marginTop:10,
        backgroundColor: 'white'
    },
    inner: {
        flex: 1,
        flexDirection: 'row',
        margin: 15,
        flexWrap: 'wrap'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    details: {
        // flex: 1,
        flexDirection: 'column',
        paddingTop: 5,
        paddingLeft: 10,
    },
    small: {
        fontSize: 11,
        color: 'gray'
    },
    name: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black'
    },
    bold: {
        fontWeight: 'bold'
    },
    lastMessageSection: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 5
    },
    timeAgo: {
        paddingLeft: 6,
        color: 'rgba(0,0,0,.45)'
    }
});

export default ChatRoomBox;