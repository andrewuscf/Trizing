import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Picker
} from 'react-native';
import Modal from 'react-native-modal';


class CollapsiblePickerIOS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const locals = this.props.locals;
        const {stylesheet} = locals;
        let selectStyle = stylesheet.select.normal;
        if (locals.hasError) {
            selectStyle = stylesheet.select.error;
        }
        const options = locals.options.map(({value, text}) => <Picker.Item key={value} value={value} label={text}/>);
        return (
            <Picker
                accessibilityLabel={locals.label}
                ref="input"
                style={selectStyle}
                selectedValue={locals.value}
                onValueChange={locals.onChange}
                help={locals.help}
                enabled={locals.enabled}
                mode={locals.mode}
                prompt={locals.prompt}
                itemStyle={locals.itemStyle}
            >
                {options}
            </Picker>
        );
    }
}

CollapsiblePickerIOS.propTypes = {
    locals: PropTypes.object.isRequired
};


class StandaloneModal extends React.Component {
    static propTypes = {
        children: PropTypes.node
    };

    state = {
        visible: false
    };

    setVisible(visible) {
        this.setState({visible});
    };

    render() {
        return (
            <Modal ref="modal" isVisible={this.state.visible} style={styles.modal}
                   hideOnBack={true}>
                <TouchableOpacity style={styles.modal} onPress={() => {
                    this.setVisible(false)
                }}>
                    {this.props.children}
                </TouchableOpacity>
            </Modal>
        );
    }
}

function select(locals) {

    const selectedOption = locals.options.find(option => option.value === locals.value);
    const {stylesheet} = locals;
    let touchableStyle = stylesheet.pickerTouchable.normal;
    let controlLabelStyle = stylesheet.controlLabel.normal;
    let pickerValue = stylesheet.pickerValue.normal;
    let formGroupStyle = stylesheet.formGroup.normal;

    if (locals.hasError) {
        touchableStyle = stylesheet.pickerTouchable.error;
        pickerValue = stylesheet.pickerValue.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        formGroupStyle = stylesheet.formGroup.error;
    }

    const label = locals.label ? (
        <Text style={controlLabelStyle}>{locals.label}</Text>
    ) : null;
    let modal = null;

    return (
        <View style={formGroupStyle}>
            {label}
            <TouchableOpacity
                style={[touchableStyle]}
                onPress={() => {
                    modal.setVisible(true)
                }}>
                <Text style={[pickerValue]}>{selectedOption ? selectedOption.text : null}</Text>
            </TouchableOpacity>
            <StandaloneModal ref={innerModal => modal = innerModal}>
                <View style={styles.innerModal}>
                    <View style={styles.bottom}>
                        <Text style={styles.okText} onPress={() => {
                            modal.setVisible(false)
                        }}>Done</Text>
                        <CollapsiblePickerIOS locals={locals}/>
                    </View>
                </View>
            </StandaloneModal>
        </View>
    );
}


const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 0,
        margin: 0
    },
    innerModal: {
        backgroundColor: 'white',
    },
    bottom: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 4,
        borderTopWidth: .5,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    okText: {
        textAlign: 'right',
        paddingBottom: 10,
        fontSize: 15,
        fontFamily: 'Heebo-Regular',
        color: '#2e7fb2'
    },
});

module.exports = select;
