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

import {fetchData, API_ENDPOINT} from '../../actions/utils';


const ChatRoom = React.createClass({
    propTypes: {
        roomId: React.PropTypes.number.isRequired
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

    getMessages() {
        let url = `${API_ENDPOINT}social/messages/?room_id=${this.props.roomId}`;
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
        const data = {room: this.props.roomId, text: messages[0].text};
        let url = `${API_ENDPOINT}social/messages/`;

        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
        fetch(url, fetchData('POST', JSON.stringify(data), this.props.UserToken))
            // .then((response) => response.json())
            // .then((responseJson) => {});
    },

    _back() {
        this.props.navigation.goBack()
    },

    render() {
        // const list = this.state.messages.map((message, index) => {
        //     return (
        //         <MessageBox key={index} message={message}
        //                     position={message.user.id == this.props.RequestUser.id ? 'right' : 'left'}/>
        //     )
        // });
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
    return {}
};


export default connect(stateToProps, dispatchToProps)(ChatRoom);
