import React from 'react';
import {
    View,
    Dimensions,
    TouchableOpacity,
    LayoutAnimation,
    StyleSheet,
    Text,
    Keyboard
} from 'react-native';
const INPUT_ACCESSORY_HEIGHT = 40;

const InputAccessory = React.createClass({
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
        let newSize = e.endCoordinates.screenY - (INPUT_ACCESSORY_HEIGHT + 70); //-1 so 1px is showing so it doesn't unmount
        LayoutAnimation.configureNext({
            duration: 500,
            create: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.scaleXY
            },
            update: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.scaleXY
            },
        });

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
        LayoutAnimation.configureNext({
            duration: 100,
            create: {
                type: LayoutAnimation.Types.linear,
            },
            update: {
                type: LayoutAnimation.Types.linear,
            },
        });

        let newSize = Dimensions.get('window').height;
        this.setState({
            visibleHeight: newSize,
            hideKA: true,
            opacity: 0,
        });
        Keyboard.dismiss();
    },

    render: function () {
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
        color: '#00AFA3',
        backgroundColor: 'transparent',
        paddingHorizontal: 9,
        paddingVertical: 9,
    },
});


export default InputAccessory;