import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    Platform,
    TextInput,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as FeedActions from '../actions/feedActions';

import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

import AvatarImage from '../components/AvatarImage';

import PostBox from '../components/PostBox';

const Feed = React.createClass({

    getInitialState() {
        return {
            text: null,
            height: 30,
            notify_clients: false
        }
    },

    scrollToTopEvent(args) {
        if (args.routeName == 'Feed') {
            const isTrue = true;
            this.refs.posts_list.scrollTo({y: 0, isTrue});
        }
    },

    componentDidMount() {
        if (!this.props.Posts.length) {
            this.props.actions.getFeed(true);
        }
    },

    _refresh() {
        this.props.actions.getFeed(true);
    },

    onEndReached() {
    },

    renderCreatePost(){
        const user = this.props.RequestUser;
        const isTrainer = user.type == 1;
        let image = user.profile.thumbnail ? user.profile.thumbnail : user.profile.avatar;
        return (
            <View style={styles.createPost}>
                <View style={{flexDirection: 'row', padding: 5}}>
                    <AvatarImage image={image} style={styles.postAvatar}/>
                    <View style={[styles.inputWrap, {height: this.state.height ? this.state.height : 30}]}>
                        <TextInput ref='post_text'
                                   style={[styles.textInput, {height: this.state.height}]}
                                   multiline={true}
                                   maxLength={255}
                                   underlineColorAndroid='transparent'
                                   autoCapitalize='sentences'
                                   placeholderTextColor='#4d4d4d'
                                   onChange={this.postChange}
                                   value={this.state.text}
                                   placeholder="Post Something"/>
                    </View>
                    {this.state.text ?
                        <TouchableOpacity style={styles.postSubmit} onPress={this._createPost}>
                            <Icon name="telegram" size={20} color='#22c064'/>
                        </TouchableOpacity> :
                        null
                    }
                </View>
                {this.state.text && isTrainer ?
                    <TouchableOpacity style={styles.notifyClientSection}
                                      onPress={this._notifyClients}>
                        <Text style={[styles.notifyText, this.state.notify_clients? {color: '#22c064'}: null]}>
                            Notify Clients
                        </Text>
                        {this.state.notify_clients ?
                            <Icon name="check-circle-o" size={16} color='#22c064'/> :
                            <Icon name="times-circle-o" size={16} color='black'/>
                        }
                    </TouchableOpacity> :
                    null
                }
            </View>
        )
    },

    _createPost() {
        if (this.state.text) {
            this.props.actions.createPost(this.state);
            this.setState(this.getInitialState());
            Keyboard.dismiss();
        }
    },

    _notifyClients() {
        this.setState({notify_clients: !this.state.notify_clients})
    },

    postChange(event) {
        const text = event.nativeEvent.text;
        this.setState({text: text, height: event.nativeEvent.contentSize.height + 10});
    },


    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(this.props.Posts);
        return (
            <ListView ref='posts_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                      renderHeader={this.renderCreatePost}
                      keyboardShouldPersistTaps="handled"
                      refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}
                      style={[GlobalStyle.noHeaderContainer,styles.feedContainer]}
                      enableEmptySections={true} dataSource={dataSource}
                      onEndReached={this.onEndReached}
                      renderRow={(post) => <PostBox
                          updateLike={this.props.actions.updateLike}
                          liked={_.indexOf(post.liked_by, this.props.RequestUser.id) != -1}
                          post={post} navigate={this.props.navigation.navigate}/>}
            />
        )
    }
});


const styles = StyleSheet.create({
    feedContainer: {
    },
    createPost: {
        minHeight: 50,
        // margin: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderColor: '#e1e3df',
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    postAvatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 10
    },
    detailSection: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 10
    },
    inputWrap: {
        height: 30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        paddingTop: 5,
    },
    textInput: {
        color: 'black',
        fontSize: getFontSize(22),
        fontFamily: 'OpenSans-SemiBold',
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        height: 30,
    },
    postSubmit: {
        alignSelf: 'center'
    },
    notifyClientSection: {
        alignSelf: 'center',
        flexDirection: 'row',
        padding: 5
    },
    notifyText: {
        fontSize: getFontSize(16),
        fontFamily: 'OpenSans-SemiBold',
        paddingRight: 5
    }
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
