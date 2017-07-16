import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';
import GlobalStyle from '../containers/globalStyle';

import AvatarImage from './AvatarImage';

const PersonBox = React.createClass({
    propTypes: {
        person: React.PropTypes.object.isRequired,
        RequestUser: React.PropTypes.object,
        removeClient: React.PropTypes.func,
        sendRequest: React.PropTypes.func,
        selectUser: React.PropTypes.func,
        selected: React.PropTypes.bool,
        navigate: React.PropTypes.func.isRequired,
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
            this.props.navigate('Profile', {id:this.props.person.id});
        }
    },


    render() {
        const person = this.props.person;
        const trainer = this.props.RequestUser;
        return (
            <TouchableOpacity style={styles.container} onPress={this.goToProfile}>
                <AvatarImage style={styles.avatar} image={person.profile.thumbnail} resizeImage={102}/>
                <View style={styles.text}>
                    <Text style={styles.userName}>{person.username}</Text>
                    <Text style={styles.title}>{person.profile.first_name} {person.profile.last_name[0]}.</Text>
                </View>
                {this.props.selected? <Icon name="circle" size={20} style={GlobalStyle.lightBlueText}/>: null}
                {!this.state.invited && typeof this.props.sendRequest !== 'undefined' ?
                    person.id !== trainer.id ?
                        trainer.id === person.profile.trainer ?
                            <TouchableOpacity activeOpacity={1} onPress={this._removeClient} style={styles.addUser}>
                                <Icon name="minus-circle" size={30} color='red'/>
                            </TouchableOpacity> :
                            <TouchableOpacity activeOpacity={1} onPress={this._action} style={styles.addUser}>
                                <Icon name="plus-circle" size={30} color='#22c064'/>
                            </TouchableOpacity>
                        : <Icon name="check" size={30} color='green'/>
                    : null
                }

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
        // marginLeft: 10,
        // marginRight: 10,
        marginTop: 20
    },
    text: {
        paddingLeft: 18,
        flexWrap: 'wrap',
        flex: 1,
    },
    userName: {
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'OpenSans-Semibold',
    },
    title: {
        fontSize: 14,
        paddingTop: 5,
        color: '#999999',
        fontFamily: 'OpenSans-Semibold',
    },
    avatar: {
        width: 68,
        height: 68,
        borderRadius: 34
    },
    touchable: {},
    addUser: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addText: {
        paddingLeft: 5,
        color: 'green'
    }
});

export default PersonBox;
