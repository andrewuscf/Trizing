import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';

import GlobalStyle from '../containers/globalStyle';

import AvatarImage from './AvatarImage';


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
                <Text>{comment.text}</Text>
            </View>
        );
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
        // padding: 5,
    },
    postAvatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignSelf: 'center'
    }
});

export default CommentBox;
