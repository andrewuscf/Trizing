import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import moment from 'moment';

import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import PeopleBar from '../../components/PeopleBar';

const PostDetail = React.createClass({
    propTypes: {
        post: React.PropTypes.object.isRequired,
    },


    render: function () {
        const post = this.props.post;
        console.log(post)
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this.props.navigator.pop}/>
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