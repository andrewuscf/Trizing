import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableHighlight,
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';

import AvatarImage from './AvatarImage';

moment.updateLocale('en', {
    relativeTime: {
        mm: "%dm",
        h:  "1h",
        hh: "%dh",
        s:  "%ds",
        d:  "1d",
        dd: "%dd",
    }
});

const ChatRoomBox = React.createClass({
    propTypes: {
        room: React.PropTypes.object.isRequired,
        _redirect: React.PropTypes.func.isRequired,
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
        // return (
        //     <TouchableHighlight style={styles.container} onPress={this._toRoom} underlayColor='white'>
        //         <View style={styles.inner}>
        //             <AvatarImage image={sender.profile.avatar}/>
        //             <View style={styles.details}>
        //                 <Text style={styles.name}>{sender.first_name} {sender.last_name[0]}.</Text>
        //                 <Text style={styles.small}>
        //                     6 miles away
        //                 </Text>
        //                 <View style={styles.lastMessageSection}>
        //                     <Text style={styles.bold}>{this.trimToLength(room.last_message.message, 25)}</Text>
        //                     {(room.last_message.message) ?
        //                         <Text style={styles.timeAgo}>{moment(room.last_message.timestamp).fromNow(false)}</Text>
        //                         : null
        //                     }
        //                 </View>
        //             </View>
        //         </View>
        //     </TouchableHighlight>
        // )
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomWidth: .5,
        borderBottomColor: 'rgba(0,0,0,.15)'
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