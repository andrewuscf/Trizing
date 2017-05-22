import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    ScrollView,
    Dimensions
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';

import * as chatActions from '../../actions/chatActions';
import {getFontSize, trunc} from '../../actions/utils';

import AvatarImage from '../../components/AvatarImage';


const window = Dimensions.get('window');


const CreateChatRoom = React.createClass({
    getInitialState() {
        return {
            selected: [],
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit});
        if (this.props.RequestUser.type == 2 && this.props.Team.length < 1) {
            this.props.actions.getTeam(true);
        }
    },


    asyncActions(start, chatroom= null){
        if (start) {
            // Need to provide messages to select users.
        } else {
            if (chatroom) this.props.navigation.navigate('ChatRoom', {roomId: chatroom});
        }
    },

    _onSubmit() {
        if (this.state.selected.length > 0) {
            const users = [
                ...this.state.selected,
                this.props.RequestUser.id
            ];
            this.props.actions.createChatRoom({users: users}, this.asyncActions)
        }
    },

    selectUser(userId) {
        const index = _.indexOf(this.state.selected, userId);
        if (index != -1) {
            this.setState({
                selected: [...this.state.selected.slice(0, index), ...this.state.selected.slice(index + 1)]
            });
        } else {
            this.setState({
                selected: [
                    ...this.state.selected,
                    userId
                ]
            })
        }
    },

    _back() {
        this.props.navigation.goBack()
    },


    render: function () {
        let source = this.props.Clients;
        if (this.props.RequestUser.type == 2) {
            source = this.props.Team
        }

        return (
            <View style={styles.flexCenter}>

                <ScrollView style={{paddingTop: 20}}
                            contentContainerStyle={{flexWrap: 'wrap', flexDirection: 'row'}}>
                    {source.map((client, i) => {
                        let image = client.profile.thumbnail ? client.profile.thumbnail : client.profile.avatar;
                        return (
                            <View style={styles.inviteBox} key={i}>
                                <AvatarImage style={[styles.avatar,
                                    (_.includes(this.state.selected, client.id)) ? styles.selected : null]}
                                             image={image}
                                             redirect={this.selectUser.bind(null, client.id)}/>
                                <Text style={styles.userText}>
                                    {trunc(`${client.profile.first_name} ${client.profile.last_name[0]}`.toUpperCase(), 13)}
                                </Text>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    },
    selected: {
        borderWidth: 2,
        borderColor: 'red',
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40
    },
    inviteBox: {
        width: window.width / 3,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    userText: {
        fontSize: getFontSize(18),
        marginTop: 5,
        fontFamily: 'OpenSans-SemiBold',
    },
});

CreateChatRoom.navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    return {
        title: 'Select users',
    };
};


const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Clients: state.Home.Clients,
        ...state.Chat
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(chatActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateChatRoom);
