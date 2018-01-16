import React from 'react';
const CreateClass = require('create-react-class');
import {
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    Text,
    Keyboard
} from 'react-native';
const INPUT_ACCESSORY_HEIGHT = 40;

const InputAccessory = CreateClass({
    getInitialState: function () {
        return {
            visibleHeight: Dimensions.get('window').height,
            opacity: 0
        };
    },

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener("keyboardWillShow", this.keyboardWillShow);
        this.keyboardDidHideListener = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide);
    },

    componentWillUnmount(){
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        let newSize = Dimensions.get('window').height;
        this.setState({
            visibleHeight: newSize,
            hideKA: true,
            opacity: 0
        })
    },

    keyboardWillShow (e) {
        let newSize = e.endCoordinates.screenY - (INPUT_ACCESSORY_HEIGHT - 1); //-1 so 1px is showing so it doesn't unmount
        this.setState({
            visibleHeight: newSize,
            hideKA: false,
            opacity: 1,
        })
    },

    rotateDevice: function () {
        return false;
    },

    keyboardWillHide (e) {
        this.setState({
            visibleHeight: Dimensions.get('window').height,
            hideKA: true,
            opacity: 0,
        })
    },

    dismissKeyboardHandler: function () {
        let newSize = Dimensions.get('window').height;
        this.setState({
            visibleHeight: newSize,
            hideKA: true,
            opacity: 0,
        });
        Keyboard.dismiss();
    },


    render() {
        return (
            <View style={[s.InputAccessory, {opacity: this.state.opacity, top: this.state.visibleHeight - 1}]}
                  onLayout={(e) => this.rotateDevice(e)}>
                <TouchableOpacity
                    onPress={() => this.dismissKeyboardHandler()}>
                    <Text style={[s.InputAccessoryButtonText]}>
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
});

const s = StyleSheet.create({
    InputAccessory: {
        alignItems: 'flex-end',
        backgroundColor: '#FFF',
        height: INPUT_ACCESSORY_HEIGHT,
        position: 'absolute',
        left: 0,
        right: 0,
    },
    InputAccessoryButtonText: {
        fontSize: 17,
        letterSpacing: 0.5,
        color: '#316b6f',
        backgroundColor: 'transparent',
        paddingHorizontal: 9,
        paddingVertical: 9,
    },
});


export default InputAccessory;