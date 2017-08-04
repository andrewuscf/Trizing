import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {getFontSize} from '../actions/utils';

const CustomBack = React.createClass({
    propTypes: {
        back: React.PropTypes.func.isRequired,
        title: React.PropTypes.string,
        // right: React.PropTypes.func
    },

    render() {
        return (
            <View style={[styles.nav]}>
                <TouchableOpacity style={[styles.topNavButton]} onPress={this.props.back}>
                    <Icon name="keyboard-arrow-left" size={getFontSize(30)} style={[styles.textColor, {marginLeft: 10}]}/>
                </TouchableOpacity>
                <View style={[styles.discoverTitle]} >
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
        flexDirection:'row'
    }
});

export default CustomBack;