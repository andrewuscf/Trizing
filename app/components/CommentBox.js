import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';

import GlobalStyle from '../containers/globalStyle';

import AvatarImage from './AvatarImage';

moment.updateLocale('en', {
    relativeTime: {
        mm: "%dm",
        h:  "1h",
        hh: "%dh",
        s:  "%ds",
        d:  "1d",
        dd: "%dd"
    }
});


const CommentBox = React.createClass({
    propTypes: {
        comment: React.PropTypes.object.isRequired,
    },

    goToProfile(userId) {
        this.props.navigator.push(getRoute('Profile', {'id': this.props.comment.user.id}));
    },

    onPress() {
        console.log('log')
    },


    render() {
        const comment = this.props.comment;
        let image = comment.user.profile.thumbnail ? comment.user.profile.thumbnail : comment.user.profile.avatar;
        return (
            <View style={[styles.container]}>
                <AvatarImage redirect={this.goToProfile} image={image} style={styles.postAvatar}/>
                <View style={styles.detailSection}>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <View style={styles.timeStamp}>
                        <Icon name="clock-o" size={12} color='#4d4d4e' />
                        <Text style={styles.timeStampText}>{moment.utc(comment.created_at).fromNow(false)}</Text>
                    </View>
                </View>
            </View>
        );
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 5
    },
    postAvatar: {
        height: 30,
        width: 30,
        borderRadius: 15,
        alignSelf: 'center'
    },
    detailSection: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 10
    },
    commentText: {
        flexWrap: 'wrap',
        fontSize: getFontSize(16),
        fontFamily: 'OpenSans-SemiBold'
    },
    timeStamp: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeStampText: {
        color: '#999791',
        fontSize: getFontSize(11),
        paddingLeft: 5
    },
});

export default CommentBox;
