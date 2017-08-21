import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';

import * as chatActions from '../../actions/chatActions';
import {getFontSize, trunc} from '../../actions/utils';

import AvatarImage from '../../components/AvatarImage';
import PersonBox from '../../components/PersonBox';


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


    asyncActions(start, chatroom = null) {
        if (start) {
            // Need to provide messages to select users.
        } else {
            if (chatroom) {
                this.props.navigation.dispatch({
                    type: 'ReplaceCurrentScreen',
                    routeName: 'ChatRoom',
                    params: {room_label: chatroom},
                    key: 'ChatRoom'
                });
            }
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
        if (this.props.RequestUser.type === 2) {
            source = this.props.Team
        }

        return (

            <ScrollView style={styles.flexCenter} showsVerticalScrollIndicator={false}>
                {source.map((client, i) => {
                    return <PersonBox key={i} navigate={this.props.navigation.navigate} person={client}
                                      selected={_.includes(this.state.selected, client.id)}
                                      selectUser={this.selectUser.bind(null, client.id)}/>;

                })}
            </ScrollView>
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
        fontFamily: 'Heebo-Bold',
    },
    selected: {
        borderWidth: 2,
        borderColor: 'red',
    }
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
