import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

import {trunc, getFontSize} from '../actions/utils';

import AvatarImage from './AvatarImage';

const PeopleBar = React.createClass({
    propTypes: {
        people: React.PropTypes.array.isRequired,
        navigate: React.PropTypes.func.isRequired,
        manageClients: React.PropTypes.func,
        action: React.PropTypes.func,
        selected: React.PropTypes.array
    },

    goToProfile(userId) {
        if (this.props.action) {
            this.props.action(userId)
        } else {
            this.props.navigate('Profile', {id: userId});
        }
    },

    render() {
        const list = this.props.people.map((user, i) => {
            let image = user.profile.thumbnail ? user.profile.thumbnail : user.profile.avatar;

            return (
                <View style={{alignItems: 'center'}} key={i}>
                    <AvatarImage
                        style={[styles.avatar,
                            (this.props.selected && _.includes(this.props.selected, user.id)) ? styles.selected : null]}
                        image={image}
                        redirect={this.goToProfile.bind(null, user.id)}/>
                    <Text style={styles.userText}>{trunc(user.username, 6)}</Text>
                </View>
            )
        });

        return (
            <View style={styles.container}>
                <ScrollView style={styles.peopleList} contentContainerStyle={styles.checkContentContainer}
                            showsHorizontalScrollIndicator={false} horizontal={true}>

                    {this.props.manageClients ?
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity onPress={this.props.manageClients} style={styles.manageClients}>
                                <Icon name="user-plus" color='#bfbfbf' size={22}/>
                            </TouchableOpacity>
                            <Text style={styles.userText}>Manage Clients</Text>
                        </View>
                        : null
                    }

                    {list}
                </ScrollView>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    peopleList: {
        flex: 1
    },
    checkContentContainer: {
        flexDirection: "row",
        position: 'relative',
        overflow: 'hidden',
        alignItems: 'center',
        paddingLeft: 6,
        paddingRight: 6,
        height: 90,
    },
    avatar: {
        marginRight: 12,
        height: 60,
        width: 60,
        borderRadius: 30
    },
    manageClients: {
        marginRight: 12,
        height: 59,
        width: 59,
        borderRadius: 30,
        borderColor: '#bfbfbf',
        borderWidth: .5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userText: {
        fontSize: getFontSize(12),
        color: '#b1aea5',
        marginLeft: -5,
        marginTop: 5
    },
    selected: {
        borderWidth: 2,
        borderColor: 'red',
    }
});

export default PeopleBar;
