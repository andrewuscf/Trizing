import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    ScrollView,
    Dimensions,
    TouchableOpacity
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

    scrollToTopEvent(args) {
        // if (args.routeName == 'Chat') {
        //     const isTrue = true;
        //     this.refs.todayscroll.scrollTo({y: 0, true});
        // }
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
        if (this.props.RoomsNext)
            this.props.actions.getChatRooms();
    },

    newChat() {
        this.props.navigator.push(getRoute('CreateChatRoom'))
    },

    renderHeader() {
        return (
            <TouchableOpacity style={styles.header} onPress={this.newChat}>
                <Icon name="send" size={30} color='#b1aea5' style={{marginTop: 2}}/>
                <Text style={styles.newChatText}>New Message</Text>
            </TouchableOpacity>
        )
    },


    render() {
        if (this.props.Rooms.length) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            const dataSource = ds.cloneWithRows(this.props.Rooms);
            return (
                <ListView
                    refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}
                    style={styles.container} enableEmptySections={true}
                    removeClippedSubviews={false}
                    renderHeader={this.renderHeader}
                    dataSource={dataSource} onEndReached={this.onEndReached} onEndReachedThreshold={Dimensions.get('window').height}
                    renderRow={(room, i) => <ChatRoomBox key={i} room={room} RequestUser={this.props.RequestUser}
                                                         _redirect={this._redirect}/>}
                />
            );
        }
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}
                        refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}>
                {this.renderHeader()}
                <View style={styles.noRequests}>
                    <Icon name="comment-o" size={60}
                          color='#b1aea5'/>
                    <Text style={styles.noRequestTitle}>
                        You should chat with your trainer or fellow clients.
                    </Text>
                </View>
            </ScrollView>
        );
    }
});


const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
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
    },
    header: {
        backgroundColor: 'white',
        height: 50,
        margin: 5,
        borderColor: '#e1e3df',
        borderTopWidth: .5,
        borderBottomWidth: .5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    newChatText: {
        fontSize: getFontSize(22),
        color: '#b1aeb9',
        fontFamily: 'OpenSans-Semibold',
        paddingLeft: 10
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
