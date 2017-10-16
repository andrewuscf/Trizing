import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {getFontSize} from '../actions/utils';
import GlobalStyle from '../containers/globalStyle';

import AvatarImage from './AvatarImage';

const TrainerBox = CreateClass({
    propTypes: {
        trainer: PropTypes.object.isRequired,

        navigate: PropTypes.func.isRequired,
    },

    goToProfile() {
        if (typeof this.props.selectUser !== 'undefined') {
            this.props.selectUser();
        } else {
            // this.props.navigate('Profile', {id: this.props.person.id});
        }
    },


    render() {
        const person = this.props.trainer;
        return (
            <TouchableOpacity style={styles.container} onPress={this.goToProfile}>
                <AvatarImage style={styles.avatar} image={person.profile.thumbnail}/>
                <View style={styles.mainContent}>
                    <Text style={styles.userName}>{person.profile.first_name} {person.profile.last_name}</Text>
                    <Text style={{fontFamily: 'Heebo-Medium', color: '#4d4d4e',}}>CERTIFICATES</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <FontIcon name="circle" size={getFontSize(6)} style={GlobalStyle.lightBlueText}/>
                        <Text style={[GlobalStyle.lightBlueText, styles.certificates]}>
                            Personal Trainer
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <FontIcon name="circle" size={getFontSize(6)} style={GlobalStyle.lightBlueText}/>
                        <Text style={[GlobalStyle.lightBlueText, styles.certificates]}>
                            Personal Trainer
                        </Text>
                    </View>
                </View>
                <View style={{flex: .3}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <MaterialIcon name="star" style={GlobalStyle.redText}/>
                        <MaterialIcon name="star" style={GlobalStyle.redText}/>
                        <MaterialIcon name="star" style={GlobalStyle.redText}/>
                        <MaterialIcon name="star" style={GlobalStyle.redText}/>
                        <MaterialIcon name="star-border" style={GlobalStyle.redText}/>
                    </View>
                    <Text style={{alignSelf: 'flex-end', fontSize: getFontSize(10)}}>2 REVIEWS</Text>
                </View>

            </TouchableOpacity>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
    },
    mainContent: {
        paddingLeft: 18,
        flexWrap: 'wrap',
        flex: .7,
    },
    userName: {
        fontSize: getFontSize(20),
        backgroundColor: 'transparent',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: '#00AFA3',
        borderWidth: 1
    },
    certificates: {
        paddingLeft: 5,
        fontSize: getFontSize(12),
    }
});

export default TrainerBox;
