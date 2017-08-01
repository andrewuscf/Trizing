import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    ScrollView,
    Dimensions,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';

import * as ChatActions from '../actions/chatActions';

import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';


import CustomIcon from '../components/CustomIcon';
import ChatRoomBox from '../components/ChatRoomBox';
import Loading from '../components/Loading';

const Chat = React.createClass({
    componentDidMount() {
        if (!this.props.Rooms.length) {
            this.props.actions.getChatRooms();
        }
    },

    _refresh() {
        this.props.actions.getChatRooms(true);
    },

    _redirect(routeName, props = null) {
        this.props.navigation.navigate(routeName, props);
    },

    onEndReached() {
        if (this.props.RoomsNext)
            this.props.actions.getChatRooms();
    },

    newChat() {
        this.props.navigation.navigate('CreateChatRoom');
    },


    render() {
        if (this.props.ChatIsLoading) return <Loading />;
        if (this.props.Rooms.length) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            const dataSource = ds.cloneWithRows(this.props.Rooms);
            return (
                <View style={GlobalStyle.noHeaderContainer}>
                    <ListView showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}
                        style={styles.scrollContainer} enableEmptySections={true}
                        removeClippedSubviews={false}
                        dataSource={dataSource} onEndReached={this.onEndReached}
                        onEndReachedThreshold={Dimensions.get('window').height}
                        renderRow={(room, i) => <ChatRoomBox key={i} room={room} RequestUser={this.props.RequestUser}
                                                             _redirect={this._redirect}/>}
                    />
                    <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                        <ActionButton.Item buttonColor='#FD795B' title="New Chat"
                                           onPress={this.newChat}>
                            <CustomIcon name="new-note" color="white" size={22}/>
                        </ActionButton.Item>
                    </ActionButton>
                </View>
            );
        }
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer} style={GlobalStyle.noHeaderContainer}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}>
                <View style={styles.noRequests}>
                    <MaterialIcon name="message" size={60} color='#b1aea5'/>
                    <Text style={styles.noRequestTitle}>
                        You should chat with your trainer or fellow clients.
                    </Text>
                </View>
                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                    <ActionButton.Item buttonColor='#FD795B' title="New Chat"
                                       onPress={this.newChat}>
                        <CustomIcon name="new-note" color="white" size={22}/>
                    </ActionButton.Item>
                </ActionButton>
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
        fontFamily: 'Heebo-Medium'
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
        fontFamily: 'Heebo-Medium',
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
