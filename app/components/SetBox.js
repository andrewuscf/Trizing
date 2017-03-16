import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';


const SetBox = React.createClass({
    propTypes: {
        set: React.PropTypes.object.isRequired,
        setIndex: React.PropTypes.number.isRequired,
        setSetState: React.PropTypes.func.isRequired,
    },

    _repChange(text) {
        this.props.setSetState(this.props.setIndex, {reps: text})
    },

    _weightChange(text) {
        this.props.setSetState(this.props.setIndex, {weight: text})
    },


    // addDay() {
    //     Keyboard.dismiss();
    //     this.setState({
    //         sets: [
    //             ...this.state.sets,
    //             BlankSet
    //         ]
    //     });
    // },
    //
    // removeDay(index) {
    //     Keyboard.dismiss();
    //     if (this.state.sets.length > 1) {
    //         this.setState({
    //             sets: this.state.sets.slice(0, index).concat(this.state.sets.slice(index + 1))
    //         })
    //     }
    // },


    render: function () {
        console.log(this.props.set)
        return (
            <View style={[styles.inputWrap]}>
                <TextInput ref='reps'
                           style={[styles.textInput]}
                           underlineColorAndroid='transparent'
                           keyboardType="numeric"
                           maxLength={4}
                           placeholderTextColor='#4d4d4d'
                           onChangeText={this._repChange}
                           value={this.props.set.reps.toString()}
                           onSubmitEditing={(event) => {this.refs.weight.focus()}}
                           placeholder="Reps"/>
                <TextInput ref='weight'
                           style={[styles.textInput]}
                           underlineColorAndroid='transparent'
                           keyboardType="numeric"
                           maxLength={6}
                           placeholderTextColor='#4d4d4d'
                           onChangeText={this._weightChange}
                           value={this.props.set.weight}
                           placeholder="Reps"/>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    inputWrap: {
        flex: 1,
        marginBottom: 12,
        height: 30,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    textInput: {
        color: 'black',
        fontSize: 17,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        height: 30,
        textAlign: 'center'
    }
});


export default SetBox;
