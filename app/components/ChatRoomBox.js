import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';
import moment from 'moment';
import FontIcon from 'react-native-vector-icons/FontAwesome';

import AvatarImage from './AvatarImage';
import {getFontSize} from "../actions/utils";
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

const ChatRoomBox = React.createClass({
    propTypes: {
        room: React.PropTypes.object.isRequired,
        _redirect: React.PropTypes.func.isRequired,
        RequestUser: React.PropTypes.object.isRequired,
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
        let sender = room.users[room.users.length - 1];
        if (this.props.RequestUser.id == sender.id && room.users.length > 1) {
            sender = room.users[room.users.length - 2];
        }
        let image = sender.profile.thumbnail ? sender.profile.thumbnail : sender.profile.avatar;
        return (
            <TouchableHighlight style={styles.container} onPress={this._toRoom} underlayColor='white'>
                <View style={styles.inner}>
                    <AvatarImage image={image} style={styles.avatar}/>
                    <View style={styles.details}>
                        <Text style={[styles.name, GlobalStyle.lightBlueText]}>
                            {sender.profile.first_name} {sender.profile.last_name}
                            </Text>
                        {(room.last_message && room.last_message.text) ?
                            <View style={styles.lastMessageSection}>
                                <Text style={styles.bold}>{this.trimToLength(room.last_message.text, 25)}</Text>

                            </View> : null
                        }
                    </View>
                    <View style={styles.rightSec}>
                        <Text style={[styles.timeAgo]}>{moment(room.last_message.createdAt).fromNow(false)}</Text>
                        <FontIcon name="circle" style={[GlobalStyle.lightBlueText, {paddingTop: 5}]}/>
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
        // margin: 10,
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
    small: {
        fontSize: 11,
        color: 'gray'
    },
    name: {
        fontSize: getFontSize(16),
        fontFamily: 'Heebo-Bold',
        color: 'black'
    },
    bold: {
        color: 'rgba(0,0,0,.70)',
        fontFamily: 'Heebo-Medium',
        // color: 'grey'
        // fontWeight: 'bold'
    },
    lastMessageSection: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 5
    },
    timeAgo: {
        paddingLeft: 6,
        color: 'rgba(0,0,0,.45)',
    },
    rightSec: {
        justifyContent: 'center',
        alignItems: 'flex-end'
    }
});

export default ChatRoomBox;