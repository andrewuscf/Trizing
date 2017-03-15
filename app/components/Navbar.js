import React from 'react';
import _ from 'lodash';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getRoute} from '../routes';

var NavBar = React.createClass({
    propTypes: {
        route: React.PropTypes.string.isRequired,
        scrollToTopEvent: React.PropTypes.func.isRequired
    },

    _onPress(routeName) {
        if (this.isActiveRoute(routeName)) {
            this.props.scrollToTopEvent(routeName)
        } else {
            let index;
            if (routeName == 'Profile') {
                index = _.findIndex(this.props.navigator.state.routeStack, {
                    name: routeName,
                    passProps: {user: this.props.RequestUser.id}
                });
            } else {
                index = _.findIndex(this.props.navigator.state.routeStack, {name: routeName});
            }
            if (index != -1) {
                this.props.navigator.popToRoute(this.props.navigator.state.routeStack[index]);
            } else {
                if (routeName == 'Profile') {
                    this.props.navigator.push(getRoute(routeName, {id: this.props.RequestUser.id}));
                    return;
                }
                this.props.navigator.push(getRoute(routeName));
            }
        }
    },

    isActiveRoute(routeName){
        return routeName == this.props.route;
    },


    render: function () {
        const user = this.props.RequestUser;
        return (
            <View style={styles.primaryBar}>

                <TouchableOpacity style={styles.buttonWrap} onPress={this._onPress.bind(null, 'Home', null)}>
                    <View style={styles.button}>
                        <Icon name="home" size={20}
                              color={ (!this.isActiveRoute('Home')) ? iconColor : iconColorActive }/>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonWrap} onPress={this._onPress.bind(null, 'Calendar', null)}>
                    <View style={styles.button}>
                        <Icon name="calendar-check-o" size={20}
                              color={ (!this.isActiveRoute('Calendar')) ? iconColor : iconColorActive }/>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonWrap} onPress={this._onPress.bind(null, 'Feed', null)}>
                    <View style={styles.createButton}>
                        <Icon name="fire" size={20}
                              color={ (!this.isActiveRoute('Feed')) ? iconColor : iconColorActive }/>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonWrap} onPress={this._onPress.bind(null, 'Chat', null)}>
                    <View style={styles.button}>
                        <Icon name="comment-o" size={20}
                              color={ (!this.isActiveRoute('Chat')) ? iconColor : iconColorActive }/>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonWrap} onPress={this._onPress.bind(null, 'Profile', null)}>
                    <View style={styles.button}>
                        <Icon name="user" size={20}
                              color={ (!this.isActiveRoute('Profile')) ? iconColor : iconColorActive }/>
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
});

var iconColor = '#b1aea5';
var iconColorActive = '#ffa272';

var styles = StyleSheet.create({
    primaryBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 47,
        backgroundColor: 'white',
        borderColor: '#e1e3df',
        borderTopWidth: 1
    },

    text: {
        color: iconColor,
        marginTop: 1,
        fontSize: 10
    },
    textActive: {
        color: iconColorActive,
        marginTop: 1,
        fontSize: 10
    },
    buttonWrap: {
        alignItems: 'center',
        flex: 0.2
    },
    createButton: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        alignItems: 'center',
        alignSelf: 'stretch'
    }
});


export default NavBar;