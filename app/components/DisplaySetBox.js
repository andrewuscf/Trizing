import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';
import GlobalStyle from '../containers/globalStyle';


const DisplaySetBox = React.createClass({
    propTypes: {
        set: React.PropTypes.object.isRequired,
        setIndex: React.PropTypes.number.isRequired,
    },


    render: function () {
        return (
            <View style={styles.setContainer}>
                <View style={[styles.setInfoSection]}>
                    <Text style={styles.setTitle}>Set {this.props.setIndex + 1}</Text>
                    <View>
                        <Text style={styles.inputLabel}>Weight</Text>
                        <Text style={styles.inputLabel}>
                            {this.props.set.weight} <Text style={{color: '#4d4d4d'}}>lb</Text>
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.inputLabel}>Reps</Text>
                        <Text style={styles.inputLabel}>
                            {this.props.set.reps}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    setContainer: {
        marginTop: 10,
        borderTopWidth: 0.5,
        borderColor: '#e1e3df',
    },
    setTitle: {
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
    },
    setInfoSection: {
        // marginTop: 5,
        // marginBottom: 5,
        margin: 10,
        height: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10
    },
    inputLabel: {
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        alignSelf: 'center',
    },
    textInput: {
        flex: 1,
        color: 'black',
        fontSize: 17,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent',
    }
});


export default DisplaySetBox;
