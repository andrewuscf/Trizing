import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';

import GlobalStyle from '../containers/globalStyle';

import AvatarImage from './AvatarImage';
import CommentBox from './CommentBox';


const PostBox = React.createClass({
    propTypes: {
        post: React.PropTypes.object.isRequired,
    },

    goToProfile(userId) {
        this.props.navigator.push(getRoute('Profile', {'id': this.props.post.user.id}));
    },

    onPress() {
        console.log('log')
    },


    render() {
        const post = this.props.post;
        let image = post.user.profile.thumbnail ? post.user.profile.thumbnail : post.user.profile.avatar;
        let comments = null;
        if (post.comments.length) {
            comments = post.comments.map((comment, index) => {return <CommentBox key={index} comment={comment}/>})
        }
        return (
            <View>
                <View style={[styles.container]}>
                    <AvatarImage redirect={this.goToProfile} image={image} style={styles.postAvatar}/>
                    <View style={styles.noteInfo}>
                        <View style={styles.noteText}>
                            <Text style={styles.notifText}>
                                <Text style={styles.firstName}>{post.user.profile.first_name}</Text>
                            </Text>
                            <Text style={styles.timeStampText}>
                                {moment.utc(post.created_at).local().format('MMM DD, YY h:mma')}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={GlobalStyle.simpleBottomBorder}>
                    <View style={styles.noteInfo}>
                        <Text style={styles.postText}>
                            test
                        </Text>
                    </View>
                </View>
                <View style={styles.commentSection}>
                    {comments}
                </View>
            </View>
        );
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
    },
    commentSection: {
        padding: 5,
    },
    notifText: {
        fontFamily: 'OpenSans-Semibold',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent'
    },
    noteInfo: {
        flexDirection: 'column',
        flex: 1,
        paddingLeft: 10
    },
    timeStampText: {
        color: '#999791',
        fontSize: 11
    },
    firstName: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 11,
        color: '#393839'
    },
    noteText: {
        flexWrap: 'wrap',
        flex: 1
    },
    postAvatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignSelf: 'center'
    },
    postText: {
        flexWrap: 'wrap',
        flex: 1,
        fontFamily: 'OpenSans-Bold',
        fontSize: 15,
        color: '#393839'
    }
});

export default PostBox;
