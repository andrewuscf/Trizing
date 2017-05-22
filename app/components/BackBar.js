import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;


const BackBar = React.createClass({
    propTypes: {
        back: React.PropTypes.func,
        backText: React.PropTypes.string,
    },

    render() {
        return (
            <View style={[styles.nav, this.props.navStyle]}>
                {this.props.back ?
                    <TouchableOpacity onPress={this.props.back}
                                      style={[styles.topNavButton]}>
                        <Icon name="angle-left" size={30} style={[this.props.textStyle, styles.textColor]}/>
                    </TouchableOpacity>
                    : null
                }
                {this.props.children}
            </View>
        );
    }
});


const styles = StyleSheet.create({
    nav: {
        paddingTop: STATUSBAR_HEIGHT,
        height: STATUSBAR_HEIGHT + APPBAR_HEIGHT,
        borderColor: '#d4d4d4',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    topNavButton: {
        left: 0,
        position: 'absolute',
        paddingLeft: 10,
        paddingTop: STATUSBAR_HEIGHT,
        width: 70,
        minHeight: STATUSBAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cancel: {
        textAlign: 'center',
        marginLeft: 5,
        color: '#d4d4d4',
        fontSize: 15,
        fontWeight: 'bold',
    },
    textColor: {
        color: 'blue',
    }
});

export default BackBar;