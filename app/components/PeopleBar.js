import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getRoute} from '../routes';
import {trunc} from '../actions/utils';

import AvatarImage from './AvatarImage';

const PeopleBar = React.createClass({
    propTypes: {
        people: React.PropTypes.array.isRequired,
        navigator: React.PropTypes.object.isRequired,
        manageClients: React.PropTypes.func.isRequired
    },

    goToProfile(userId) {
        this.props.navigator.push(getRoute('Profile', {id: userId}));
    },

    render() {
        let list = this.props.people.map((user, i) => {
            let image = user.profile.thumbnail ? user.profile.thumbnail : user.profile.avatar;
            return (
                <View style={{alignItems: 'center'}}  key={i}>
                    <AvatarImage style={styles.avatar} image={image}
                                 redirect={this.goToProfile.bind(null, user.id)}/>
                    <Text style={{fontSize: 10, marginLeft: -5, marginTop: 5}}>{trunc(user.username, 6)}</Text>
                </View>
            )
        });

        // add messages if no clients
        if (this.props.people.length == 0) {
            list = <Text key={0} style={styles.peopleEmpty}>You have no active clients!</Text>;
        } else {
            list = (
                <ScrollView style={styles.peopleList} contentContainerStyle={styles.checkContentContainer}
                            showsHorizontalScrollIndicator={false} horizontal={true}>

                    <View  style={{alignItems: 'center'}}>
                        <TouchableOpacity onPress={this.props.manageClients} style={styles.manageClients}>
                            <Icon name="user-plus" color='#bfbfbf' size={22}/>
                        </TouchableOpacity>
                        <Text style={{fontSize: 10, marginLeft: -8, marginTop: 5}}>Manage</Text>
                    </View>

                    {list}
                </ScrollView>
            )
        }

        return (
            <View style={styles.container}>
                {list}
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
    peopleEmpty: {
        color: '#b1aea5',
        fontSize: 16,
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center',
        flex: 1
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
        height: 80,
    },
    avatar: {
        marginRight: 12
    },
    manageClients: {
        marginRight: 12,
        height: 49,
        width: 49,
        borderRadius: 25,
        borderColor: '#bfbfbf',
        borderWidth: .5,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default PeopleBar;
