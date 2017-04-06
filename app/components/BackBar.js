import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';


const BackBar = React.createClass({
    propTypes: {
        back: React.PropTypes.func.isRequired,
        backText: React.PropTypes.string,
    },

    render() {
        return (
            <View style={[styles.nav, this.props.navStyle]}>
                <TouchableOpacity onPress={this.props.back}
                                  style={[styles.topNavButton]}>
                    <Icon name="angle-left" size={30} style={[this.props.textStyle, styles.textColor]}/>
                    <Text style={[styles.cancel, styles.textColor, this.props.textStyle]}>
                        {this.props.backText ? this.props.backText: null}
                    </Text>
                </TouchableOpacity>
                {this.props.children}
            </View>
        );
    }
});


const styles = StyleSheet.create({
    nav: {
        borderColor: '#d4d4d4',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        minHeight:50,
        backgroundColor: 'white'
    },
    topNavButton: {
        zIndex: 999,
        position: 'absolute',
        left: 10,
        top: 10,
        flexDirection: 'row',
        // justifyContent: 'center',
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
        color: '#333333',
    }
});

export default BackBar;