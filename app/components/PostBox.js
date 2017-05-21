import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';

import GlobalStyle from '../containers/globalStyle';

import AvatarImage from './AvatarImage';
import CommentBox from './CommentBox';


const PostBox = React.createClass({
    propTypes: {
        post: React.PropTypes.object.isRequired,
        liked: React.PropTypes.bool.isRequired,
        updateLike: React.PropTypes.func.isRequired,
        navigate: React.PropTypes.func.isRequired,
    },

    goToProfile(userId) {
        this.props.navigate('Profile', {'id': this.props.post.user.id});
    },

    onPress() {
        this.props.navigate('PostDetail', {post: this.props.post});
    },

    likePress() {
        if (this.props.liked) {
            this.props.updateLike(this.props.post.id, 'DELETE');
        } else {
            this.props.updateLike(this.props.post.id, 'POST');
        }
    },


    render() {
        const post = this.props.post;
        let image = post.user.profile.thumbnail ? post.user.profile.thumbnail : post.user.profile.avatar;
        let comments = null;
        if (post.comments.count > 0) {
            comments = post.comments.comments.map((comment, index) => {
                return <CommentBox key={index} comment={comment} navigate={this.props.navigate}/>
            })
        }
        return (
            <TouchableOpacity style={[styles.postBox, {borderColor: '#e1e3df', borderBottomWidth: 1}]} onPress={this.onPress}>
                <View style={[styles.container, {borderColor: '#e1e3df', borderTopWidth: 1}]}>
                    <AvatarImage redirect={this.goToProfile} image={image} style={styles.postAvatar}/>
                    <View style={styles.noteInfo}>
                        <View style={styles.noteText}>
                            <Text style={styles.notifText}>
                                <Text
                                    style={styles.firstName}>{post.user.profile.first_name} {post.user.profile.last_name}</Text>
                            </Text>
                            <Text style={styles.timeStampText}>
                                <Icon name="clock-o" size={12} color='#4d4d4e'
                                /> {moment.utc(post.created_at).local().format('MMM DD, YY h:mma')}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this.likePress} style={styles.likeButton}>

                        {this.props.liked ?
                            <Icon name="heart" size={20} color="black">
                                {post.liked_by.length ?
                                    <Text style={styles.likeText}>{post.liked_by.length}</Text> : null}
                            </Icon>
                            :
                            <Icon name="heart-o" size={20} color="black">
                                {post.liked_by.length ?
                                    <Text style={styles.likeText}>{post.liked_by.length}</Text> : null}
                            </Icon>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.noteInfo}>
                    <Text style={styles.postText}>
                        {post.text}
                    </Text>
                </View>
                <View style={styles.commentSection}>
                    <Text style={styles.commentCount}>{post.comments.comments.length} Comments</Text>
                    {comments ?
                        <View style={[GlobalStyle.simpleTopBorderMedium]}/>
                        : null
                    }
                    {comments}
                </View>
                {(post.comments.count > 4) ?
                    <TouchableOpacity style={styles.viewAllComments}>
                        <Text style={styles.viewAllCommentsText}>View all {post.comments.count} comments</Text>
                    </TouchableOpacity>
                    : null
                }
            </TouchableOpacity>
        );
    }
});


const styles = StyleSheet.create({
    postBox: {
        backgroundColor: 'white',
        marginBottom: 5,
        paddingTop: 5
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
    },
    commentSection: {
        paddingBottom: 5,
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
        color: '#393839',
        alignSelf: 'center',
        paddingBottom: 10
    },
    viewAllComments: {
        alignSelf: 'center',
        padding: 5
        // height
    },
    viewAllCommentsText: {
        fontFamily: 'OpenSans-Semibold',
        fontSize: getFontSize(11),
    },
    likeText: {
        paddingRight: 8,
        color: '#999791',
        fontSize: getFontSize(18)
    },
    commentCount: {
        alignSelf: 'flex-end',
        paddingRight: 5,
        color: '#999791',
        fontSize: getFontSize(22)
    },
    likeButton: {
        alignSelf: 'center',
        flexDirection: 'row',
        margin: 10,
        marginTop: 0
    }
});

export default PostBox;
