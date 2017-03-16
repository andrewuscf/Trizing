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


const SetBox = React.createClass({
    propTypes: {
        set: React.PropTypes.object.isRequired,
        setIndex: React.PropTypes.number.isRequired,
        setSetState: React.PropTypes.func.isRequired,
        _deleteSet: React.PropTypes.func
    },

    _repChange(text) {
        this.props.setSetState(this.props.setIndex, {reps: text})
    },

    _weightChange(text) {
        this.props.setSetState(this.props.setIndex, {weight: text})
    },

    _deleteSet() {
        Keyboard.dismiss();
        Alert.alert(
            'Delete Set',
            `Are you sure you want delete this set?`,
            [
                {text: 'Cancel', null, style: 'cancel'},
                {text: 'Delete', onPress: () => this.props._deleteSet(this.props.setIndex)},
            ]
        );
    },


    render: function () {
        return (
            <View style={styles.setContainer}>
                <View style={styles.setTitleView}>
                    <Text style={styles.setTitle}>Set {this.props.setIndex + 1}</Text>
                    {typeof this.props._deleteSet === "function" ?
                        <TouchableOpacity style={styles.edit} onPress={this._deleteSet}>
                            <Icon name="times" size={20} color="red"/>
                        </TouchableOpacity>
                        : null
                    }
                </View>
                <View style={[styles.inputWrap, GlobalStyle.simpleBottomBorder]}>
                    <Text style={styles.inputLabel}>Weight <Text style={{color: '#4d4d4d'}}> lb</Text></Text>
                    <TextInput ref='weight'
                               style={[styles.textInput]}
                               underlineColorAndroid='transparent'
                               keyboardType="numeric"
                               maxLength={4}
                               placeholderTextColor='#4d4d4d'
                               onChangeText={this._weightChange}
                               value={this.props.set.weight}
                               onSubmitEditing={(event) => {
                                   this.refs.reps.focus()
                               }}
                               placeholder="Weight"/>
                </View>
                <View style={[styles.inputWrap]}>
                    <Text style={styles.inputLabel}>Reps</Text>
                    <TextInput ref='reps'
                               style={[styles.textInput]}
                               underlineColorAndroid='transparent'
                               keyboardType="numeric"
                               maxLength={4}
                               placeholderTextColor='#4d4d4d'
                               onChangeText={this._repChange}
                               value={this.props.set.reps}
                               onSubmitEditing={(event) => {
                                   Keyboard.dismiss();
                               }}
                               placeholder="Reps"/>
                </View>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    setContainer: {
        marginTop: 10,
    },
    setTitleView: {
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        flex: 1,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    setTitle: {
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
    },
    inputWrap: {
        marginTop: 5,
        marginBottom: 5,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10
    },
    inputLabel: {
        flex: 2
    },
    textInput: {
        flex: 1,
        color: 'black',
        fontSize: 17,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent',
        height: 30,
        textAlign: 'center'
    },
    edit: {
        position: 'absolute',
        right: 0,
        top: -5
    },
});


export default SetBox;
