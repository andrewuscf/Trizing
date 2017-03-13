import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as FeedActions from '../actions/feedActions';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

import PostBox from '../components/PostBox';

const Feed = React.createClass({

    componentDidMount() {
        if (!this.props.Posts.length) {
            this.props.actions.getFeed(true);
        }
    },

    _refresh() {
        this.props.actions.getFeed(true);
    },

    onEndReached() {
        console.log('End reach')
    },

    _redirect(routeName, props = null) {
        this.props.navigator.push(getRoute(routeName, props));
    },


    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(this.props.Posts);
        return (
            <ListView ref='posts_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                      refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}
                      style={GlobalStyle.container} enableEmptySections={true} dataSource={dataSource}
                      onEndReached={this.onEndReached}
                      renderRow={(post) => <PostBox post={post} navigator={this.props.navigator}/>}
            />
        )
    }
});


const styles = StyleSheet.create({
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        ...state.Feed
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(FeedActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Feed);
