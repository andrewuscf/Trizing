import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    AsyncStorage,
    TouchableOpacity,
    Dimensions,
    TextInput
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {GiftedChat} from 'react-native-gifted-chat';

import * as ChatActions from '../../actions/chatActions';

import {fetchData, API_ENDPOINT, checkStatus} from '../../actions/utils';


const ChatRoom = React.createClass({
    propTypes: {
        room_label: React.PropTypes.string.isRequired
    },

    getInitialState() {
        return {
            messages: [],
            next: null,
            isLoadingEarlier: false
        }
    },

    componentDidMount() {
        this.getMessages();
    },

    componentDidUpdate(prevProps, prevState) {
        const newMessage = this.props.PushedMessage;
        if (newMessage && newMessage != prevProps.PushedMessage) {
            if (newMessage.room_label == this.state.label) {
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.append(previousState.messages, [{
                            ...newMessage,
                        }]),
                    };
                });
            }
        }
    },

    getMessages() {
        let url = `${API_ENDPOINT}social/messages/?room_label=${this.props.room_label}`;
        if (this.state.next) {
            url = this.state.next;
        }
        fetch(url, fetchData('GET', null, this.props.UserToken))
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState((previousState) => {
                    return {
                        messages: (this.state.next) ? GiftedChat.prepend(previousState.messages, responseJson.results)
                            : GiftedChat.append(previousState.messages, responseJson.results),
                        next: responseJson.next
                    };
                });
            });

    },

    onSendPress(messages = []) {
        const data = {room: {label: this.props.room_label}, text: messages[0].text};
        let url = `${API_ENDPOINT}social/messages/`;

        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
        fetch(url, fetchData('POST', JSON.stringify(data), this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {this.props.actions.sendMessage(responseJson)});
    },

    _back() {
        this.props.navigation.goBack()
    },

    render() {
        return (
            <View style={styles.container}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={this.onSendPress}
                    renderAvatarOnTop={true}
                    loadEarlier={!!this.state.next}
                    onLoadEarlier={this.getMessages}
                    isLoadingEarlier={this.state.isLoadingEarlier}
                    user={{_id: this.props.RequestUser.id}}
                />
            </View>
        );
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        UserToken: state.Global.UserToken
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ChatActions, dispatch)
    }
};


export default connect(stateToProps, dispatchToProps)(ChatRoom);
