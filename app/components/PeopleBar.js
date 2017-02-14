import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import _ from 'lodash';

import {getRoute} from '../routes';

import AvatarImage from './AvatarImage';

const PeopleBar = React.createClass({
    propTypes: {
        people: React.PropTypes.array.isRequired,
        navigator: React.PropTypes.object.isRequired
    },

    goToProfile(userId) {
        // this.props.navigator.push(getRoute('Profile', {'id': userId}));
    },

    render() {
        let list = this.props.people.map((user, i) => {
            let image = user.thumbnail ? user.thumbnail : user.avatar;
            return (
                <AvatarImage key={i} style={styles.avatar} image={image}
                             redirect={this.goToProfile.bind(null, user.user.id)}/>
            )
        });

        // add messages if no clients
        if (this.props.people.length == 0) {
            list = <Text key={0} style={styles.peopleEmpty}>You have no active clients!</Text>;
        }

        return (
            <View style={styles.container}>
                <ScrollView style={styles.peopleList} contentContainerStyle={styles.checkContentContainer}
                            showsHorizontalScrollIndicator={false} horizontal={true}>
                    {list}
                </ScrollView>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 13,
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 13
    },
    peopleEmpty: {
        alignSelf: 'center',
        color: '#b1aea5',
        fontSize: 16,
        fontFamily: 'OpenSans-Semibold',
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
        height: 50
    },
    avatar: {
        marginRight: 12
    }
});

export default PeopleBar;
