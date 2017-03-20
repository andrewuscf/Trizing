import React from 'react';
import Subscribable from 'Subscribable';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as ChatActions from '../actions/chatActions';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

import ChatRoomBox from '../components/ChatRoomBox';

const Chat = React.createClass({
    mixins: [Subscribable.Mixin],

    scrollToTopEvent(args) {
        if (args.routeName == 'Chat') this.refs.todayscroll.scrollTo({y: 0, true});
    },

    componentDidMount() {
        // this.addListenerOn(this.props.events, 'scrollToTopEvent', this.scrollToTopEvent);
        if (!this.props.Rooms.length) {
            this.props.actions.getChatRooms();
        }
    },

    _refresh() {
        this.props.actions.getChatRooms(true);
    },

    _redirect(routeName, props = null) {
        this.props.navigator.push(getRoute(routeName, props));
    },

    onEndReached() {
        console.log('End reach')
    },

    _redirect(routeName, props = null) {
        this.props.navigator.push(getRoute(routeName, props));
    },


    render() {
        if (this.props.Rooms.length) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            const dataSource = ds.cloneWithRows(this.props.Rooms);
            return (
                <ListView
                    refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}
                    style={styles.container} enableEmptySections={true}
                    dataSource={dataSource} onEndReached={this.onEndReached} onEndReachedThreshold={50}
                    renderRow={(room, i) => <ChatRoomBox key={i} room={room} RequestUser={this.props.RequestUser}
                                                         _redirect={this._redirect}/>}
                />
            );
        }
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}
                        refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}>
                <View style={styles.noRequests}>
                    <Icon name="comment-o" size={60}
                          color='#b1aea5'/>
                    <Text style={styles.noRequestTitle}>
                        You need active clients to message.
                    </Text>
                </View>
            </ScrollView>
        );
    }
});


const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noRequests: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    noRequestTitle: {
        fontSize: 15,
        color: '#b1aeb9',
        textAlign: 'center',
        paddingTop: 20,
        fontFamily: 'OpenSans-Semibold'
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Refreshing: state.Global.Refreshing,
        ...state.Chat
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ChatActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Chat);
