import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    ScrollView,
} from 'react-native';

import {getFontSize} from '../../actions/utils';


const PostDetail = React.createClass({
    propTypes: {
        post: React.PropTypes.object.isRequired,
    },

    render: function () {
        const post = this.props.post;
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{post.text}</Text>
            </ScrollView>
        )
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentContainerStyle: {
        overflow: 'hidden'
    },
    title: {
        fontFamily: 'OpenSans-Bold',
        fontSize: getFontSize(32),
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: '#4d4d4e',
    },
    smallTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'OpenSans-SemiBold',
    },
});

export default PostDetail;