import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';
import GlobalStyle from '../containers/globalStyle';

import AvatarImage from './AvatarImage';

const PersonBox = CreateClass({
    propTypes: {
        person: PropTypes.object.isRequired,
        RequestUser: PropTypes.object,
        removeClient: PropTypes.func,
        sendRequest: PropTypes.func,
        selectUser: PropTypes.func,
        selected: PropTypes.bool,
        navigate: PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            invited: this.props.person.profile.requested
        }
    },

    _action() {
        if (this.props.RequestUser.id !== this.props.person.profile.trainer) {
            this.props.sendRequest({to_user: this.props.person.id});
            this.setState({invited: true});
        }

    },

    _removeClient() {
        Alert.alert(
            'Removing Client',
            'Are you sure you want remove this client?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', onPress: () => this.props.removeClient(this.props.person.id)},
            ]
        );
    },

    goToProfile() {
        if (typeof this.props.selectUser !== 'undefined') {
            this.props.selectUser();
        } else {
            this.props.navigate('Profile', {id: this.props.person.id});
        }
    },


    render() {
        const person = this.props.person;
        const requestUser = this.props.RequestUser;

        let renderButton = null;

        if (!this.state.invited && typeof this.props.sendRequest !== 'undefined') {
            if (person.id !== requestUser.id) {
                if (requestUser.id == person.profile.trainer) {
                    renderButton = (
                        <TouchableOpacity activeOpacity={1} onPress={this._removeClient}
                                          style={[styles.addUser, {
                                              borderColor: 'red',
                                              backgroundColor: 'red'
                                          }]}>
                            <Text style={styles.buttonText}>
                                {requestUser.type === 2 ? "REMOVE TRAINER" : "REMOVE CLIENT"}
                            </Text>
                        </TouchableOpacity>
                    )
                } else {
                    renderButton = (
                        <TouchableOpacity activeOpacity={1} onPress={this._action}
                                          style={[styles.addUser, {
                                              borderColor: '#00AFA3',
                                              backgroundColor: '#00AFA3'
                                          }]}>
                            <Text style={styles.buttonText}>
                                {requestUser.type === 2 ? "REQUEST TRAINER" : "ADD CLIENT"}
                            </Text>
                        </TouchableOpacity>
                    )
                }

                if (requestUser.profile.trainer == person.id) renderButton = null;
            }
        }

        return (
            <TouchableOpacity style={styles.container} onPress={this.goToProfile}>
                <AvatarImage style={styles.avatar} image={person.profile.thumbnail} resizeImage={102}/>
                <View style={styles.text}>
                    <Text style={styles.userName}>{person.username}</Text>
                    <Text style={styles.title}>{person.profile.first_name} {person.profile.last_name[0]}.</Text>
                </View>
                {this.props.selected ? <Icon name="circle" size={20} style={GlobalStyle.lightBlueText}/> : null}
                {renderButton}

            </TouchableOpacity>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        // borderRadius: 8,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    text: {
        paddingLeft: 18,
        flexWrap: 'wrap',
        flex: 1,
    },
    userName: {
        fontSize: getFontSize(18),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'Heebo-Medium',
    },
    title: {
        paddingTop: 5,
        color: '#999999',
        fontFamily: 'Heebo-Medium',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    touchable: {},
    addUser: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: .5,
        borderRadius: 5
    },
    addText: {
        paddingLeft: 5,
        color: 'green'
    },
    buttonText: {
        color: 'white',
        fontSize: getFontSize(10)
    }
});

export default PersonBox;
