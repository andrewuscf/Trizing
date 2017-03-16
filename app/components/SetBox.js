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
    },

    _repChange(text) {
        this.props.setSetState(this.props.setIndex, {reps: text})
    },

    _weightChange(text) {
        this.props.setSetState(this.props.setIndex, {weight: text})
    },

    _onDelete() {
        Keyboard.dismiss();
        Alert.alert(
            'Delete Set',
            `Are you sure you want delete this set?`,
            [
                {text: 'Cancel', null, style: 'cancel'},
                {text: 'Delete', onPress: () => console.log('ldjskl')},
            ]
        );
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
            <View style={styles.setContainer}>
                <View style={styles.setTitleView}>
                    <Text style={styles.setTitle}>Set {this.props.setIndex + 1}</Text>
                    <TouchableOpacity style={styles.edit} onPress={this._onDelete}>
                        <Icon name="times" size={20} color="red"/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.inputWrap, GlobalStyle.simpleBottomBorder]}>
                    <Text style={styles.inputLabel}>Weight <Text style={{color: '#4d4d4d'}}> lb</Text></Text>
                    <TextInput ref='reps'
                               style={[styles.textInput]}
                               underlineColorAndroid='transparent'
                               keyboardType="numeric"
                               maxLength={4}
                               placeholderTextColor='#4d4d4d'
                               onChangeText={this._weightChange}
                               value={this.props.set.weight}
                               onSubmitEditing={(event) => {
                                   this.refs.weight.focus()
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
                                   this.refs.weight.focus()
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
