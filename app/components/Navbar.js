import React from 'react';
import _ from 'lodash';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getRoute} from '../routes';

var NavBar = React.createClass({

    _onPress(routeName) {
        let index;
        if (routeName == 'Profile') {
            index = _.findIndex(this.props.navigator.state.routeStack, {
                name: routeName,
                passProps: {user: this.props.RequestUser}
            });
        } else {
            index = _.findIndex(this.props.navigator.state.routeStack, {name: routeName});
        }
        if (index != -1) {
            this.props.navigator.jumpTo(this.props.navigator.state.routeStack[index]);
        } else {
            if (routeName == 'Profile') {
                this.props.navigator.push(getRoute(routeName, {user: this.props.RequestUser}));
                return;
            }
            this.props.navigator.push(getRoute(routeName));
        }
    },

    isActiveRoute(routeName){
        return routeName == this.props.activeRoute;
    },

    render: function () {
        const user = this.props.RequestUser;
        return (
            <View style={styles.primaryBar}>
                <TouchableOpacity style={styles.buttonWrap} onPress={this._onPress.bind(null, 'Home')}>
                    <View style={styles.button}>
                        <Icon name="home" size={20}
                              color={ (!this.isActiveRoute('Home')) ? iconColor : iconColorActive }/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonWrap} onPress={this._onPress.bind(null, 'Calendar')}>
                    <View style={styles.button}>
                        <Icon name="calendar-check-o" size={20}
                              color={ (!this.isActiveRoute('Calendar')) ? iconColor : iconColorActive }/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonWrap} onPress={this.props.openModal}>
                    <View style={[styles.createButton, {
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderColor: '#b1aea5'
                    }]}>
                        <Icon name="check" size={20} color='#fff'/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonWrap} onPress={this._onPress.bind(null, 'Chat')}>
                    <View style={styles.button}>
                        <Icon name="comment-o" size={20}
                              color={ (!this.isActiveRoute('Chat')) ? iconColor : iconColorActive }/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonWrap} onPress={this._onPress.bind(null, 'Profile')}>
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
        fontSize: 10,
    },
    textActive: {
        color: iconColorActive,
        marginTop: 1,
        fontSize: 10,
    },
    buttonWrap: {
        alignItems: 'center',
        flex: 0.2
    },
    createButton: {
        width: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    createText: {
        fontWeight: '700',
        fontSize: 20,
        color: 'white',
        marginBottom: 2
    },
    button: {
        alignItems: 'center',
        alignSelf: 'stretch'
    }
});


export default NavBar;