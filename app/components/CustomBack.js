import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {getFontSize} from '../actions/utils';

const CustomBack = CreateClass({
    propTypes: {
        back: PropTypes.func.isRequired,
        title: PropTypes.string,
        // right: PropTypes.func
    },

    render() {
        return (
            <View style={[styles.nav]}>
                <TouchableOpacity style={[styles.topNavButton]} onPress={this.props.back}>
                    <Icon name="keyboard-arrow-left" size={getFontSize(30)}
                          style={[styles.textColor, {marginLeft: 10}]}/>
                </TouchableOpacity>
                <View style={[styles.discoverTitle]}>
                    <Text style={[styles.centerText, styles.textColor]}>
                        {this.props.title}
                    </Text>
                </View>
                <View style={[styles.fullCancel]}>
                    {this.props.right}
                </View>
            </View>
        );
    }
});


const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 50,
        backgroundColor: 'transparent'
    },
    topNavButton: {
        flex: .2,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 50,
    },
    centerText: {
        // textAlign: 'center',
        fontSize: getFontSize(22),
        // fontFamily: 'Gotham-Black',
    },
    textColor: {
        color: '#333333',
    },
    fullCancel: {
        flex: .2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    discoverTitle: {
        flex: .7,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
});

export default CustomBack;