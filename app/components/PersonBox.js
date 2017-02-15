'use strict';

import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';
import {getRoute} from '../routes';
import AvatarImage from './AvatarImage';

const PersonBox = React.createClass({
    propTypes: {
        person: React.PropTypes.object.isRequired,
    },

    goToProfile(userId) {
        this.props.navigator.push(getRoute('Profile', userId));
    },


    render() {
        const person = this.props.person;
        return (
            <TouchableOpacity activeOpacity={1} style={styles.touchable} onPress={this.goToProfile.bind(null, person.id)}>
                <View style={styles.container}>
                    <AvatarImage style={styles.avatar} image={person.thumbnail} resizeImage={102}
                                 goToProfile={this.goToProfile.bind(null, person.id)}/>
                    <View style={styles.text}>
                        <Text style={styles.userName}>{person.first_name} {person.last_name}</Text>
                        <Text style={styles.title}>Test</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
});

const styles = StyleSheet.create({
    touchable: {
    },
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
        paddingLeft: 18
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
    }
});

export default PersonBox;
