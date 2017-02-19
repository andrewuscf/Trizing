import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';


const BackBar = React.createClass({
    propTypes: {
        back: React.PropTypes.func.isRequired,
        backText: React.PropTypes.string,
        navStyle: React.PropTypes.object,
    },

    render() {
        return (
            <View style={[styles.nav, this.props.navStyle]}>
                <TouchableOpacity onPress={this.props.back}
                                  style={[styles.topNavButton, styles.cancelButton]}>
                    <Icon name="arrow-left" size={20} style={[this.props.textStyle, styles.textColor]}/>
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
        // justifyContent: 'space-between',
    },
    topNavButton: {
        padding: 10,
        flexDirection: 'row'
    },
    cancelButton: {
        left: 0,
        alignSelf: 'center'
    },
    cancel: {
        marginLeft: 5,
        color: '#d4d4d4',
        fontSize: 15,
        fontWeight: 'bold'
    },
    textColor: {
        color: '#333333'
    }
});

export default BackBar;