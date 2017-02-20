import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';
import {getRoute} from '../routes';
import AvatarImage from './AvatarImage';

const PersonBox = React.createClass({
    propTypes: {
        person: React.PropTypes.object.isRequired,
        RequestUser: React.PropTypes.object.isRequired,
        removeClient: React.PropTypes.func.isRequired,
        sendRequest: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            invited: this.props.RequestUser.profile.requested
        }
    },

    _action() {
        console.log('hit')
        if (this.props.RequestUser.id != this.props.person.profile.trainer) {
            this.props.sendRequest({to_user: this.props.person.id});
            this.setState({invited: true});
        }

    },

    _removeClient() {
        Alert.alert(
            'Removing Client',
            'Are you sure you want remove this client?',
            [
                {text: 'Cancel', null, style: 'cancel'},
                {text: 'Delete', onPress: () => this.props.removeClient(this.props.person.id)},
            ]
        );
    },

    goToProfile() {
        this.props.navigator.push(getRoute('Profile', {id:this.props.person.id}));
    },


    render() {
        const person = this.props.person;
        const trainer = this.props.RequestUser;
        console.log(person)
        return (
            <View style={styles.container}>
                <AvatarImage style={styles.avatar} image={person.profile.thumbnail} resizeImage={102}
                             goToProfile={this.goToProfile}/>
                <View style={styles.text}>
                    <Text style={styles.userName}>{person.profile.first_name} {person.profile.last_name}</Text>
                    <Text style={styles.title}>Test</Text>
                </View>
                {!this.state.invited ?
                    person.id != trainer.id ?
                        trainer.id == person.profile.trainer ?
                            <TouchableOpacity activeOpacity={1} onPress={this._removeClient}>
                                <Icon name="trash" size={28} color='red'/>
                            </TouchableOpacity> :
                            <TouchableOpacity activeOpacity={1} onPress={this._action} style={styles.addUser}>
                                <Icon name="plus" size={20} color='green'/>
                                <Text style={styles.addText}>Add</Text>
                            </TouchableOpacity>
                        : null
                    : null
                }

            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        // borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e1e3df',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 4
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
        borderColor: 'green',
        borderWidth: .5,
        flexDirection: 'row',
        borderRadius: 8,
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
