import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

import {trunc, getFontSize} from '../actions/utils';

import AvatarImage from './AvatarImage';

const PeopleBar = CreateClass({
    propTypes: {
        people: PropTypes.array.isRequired,
        navigate: PropTypes.func.isRequired,
        action: PropTypes.func,
        selected: PropTypes.array
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
                        image={image} cache={true}
                        redirect={this.goToProfile.bind(null, user.id)}/>
                    <Text style={styles.userText}>{trunc(user.username, 6)}</Text>
                </View>
            )
        });

        return (
            <View style={[styles.container, this.props.style]}>
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
        // borderColor: '#e1e3df',
        // borderBottomWidth: .5,
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
