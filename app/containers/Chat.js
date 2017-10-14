import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    ScrollView,
    Dimensions,
    LayoutAnimation
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';
import _ from 'lodash';

import * as ChatActions from '../actions/chatActions';

import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';


import CustomIcon from '../components/CustomIcon';
import EditButton from '../components/EditButton';
import ChatRoomBox from '../components/ChatRoomBox';
import Loading from '../components/Loading';

const Chat = React.createClass({
    getInitialState() {
        return {
            isActionButtonVisible: true
        }
    },

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

    _listViewOffset: 0,

    _onScroll(event) {
        const CustomLayoutLinear = {
            duration: 100,
            create: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity},
            update: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity},
            delete: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity}
        };
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = (currentOffset > 0 && currentOffset > this._listViewOffset) ? 'down' : 'up';
        const isActionButtonVisible = direction === 'up';
        if (isActionButtonVisible !== this.state.isActionButtonVisible) {
            LayoutAnimation.configureNext(CustomLayoutLinear);
            this.setState({isActionButtonVisible})
        }
        this._listViewOffset = currentOffset;
    },


    render() {
        if (this.props.ChatIsLoading) return <Loading/>;
        if (this.props.Rooms.length) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            const dataSource = ds.cloneWithRows(this.props.Rooms);
            return (
                <View style={GlobalStyle.container}>
                    <ListView showsVerticalScrollIndicator={false}
                              refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                              onRefresh={this._refresh}/>}
                              style={styles.scrollContainer} enableEmptySections={true}
                              removeClippedSubviews={false}
                              onScroll={this._onScroll}
                              dataSource={dataSource} onEndReached={this.onEndReached}
                              onEndReachedThreshold={Dimensions.get('window').height}
                              renderRow={(room, i) => <ChatRoomBox key={i} room={room}
                                                                   chatNotifications={_.filter(this.props.Notifications, {
                                                                       action: {
                                                                           description: 'Message',
                                                                           action_object: {room_label: room.label}
                                                                       },
                                                                       unread: true
                                                                   })}
                                                                   RequestUser={this.props.RequestUser}
                                                                   _redirect={this._redirect}/>}
                    />
                    <EditButton isActionButtonVisible={this.state.isActionButtonVisible}>
                        <ActionButton.Item buttonColor='#FD795B' title="New Chat"
                                           onPress={this.newChat}>
                            <CustomIcon name="new-note" color="white" size={22}/>
                        </ActionButton.Item>
                    </EditButton>
                </View>
            );
        }
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer} style={GlobalStyle.noHeaderContainer}
                        showsVerticalScrollIndicator={false}
                        onScroll={this._onScroll}
                        refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}>
                <View style={styles.noRequests}>
                    <MaterialIcon name="message" size={60} color='#b1aea5'/>
                    <Text style={styles.noRequestTitle}>
                        You should chat with your trainer or fellow clients.
                    </Text>
                </View>
                <EditButton isActionButtonVisible={this.state.isActionButtonVisible}>
                    <ActionButton.Item buttonColor='#FD795B' title="New Chat"
                                       onPress={this.newChat}>
                        <CustomIcon name="new-note" color="white" size={22}/>
                    </ActionButton.Item>
                </EditButton>
            </ScrollView>
        );
    }
});


const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        // backgroundColor: '#f1f1f3'
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
        Notifications: state.Global.Notifications,
        ...state.Chat
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ChatActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Chat);
