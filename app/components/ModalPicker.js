import React, {PropTypes}  from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Platform,
    Picker
} from 'react-native';
import t from 'tcomb-form-native';
import Modal from 'react-native-modal';


import {getFontSize} from '../actions/utils';


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
        children: React.PropTypes.node
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

export class ModalPicker extends t.form.Select {

    getTemplate() {
        return (locals) => {
            const selectedOption = locals.options.find(option => option.value === locals.value);

            const {stylesheet} = locals;
            let touchableStyle = stylesheet.pickerTouchable.normal;
            let pickerValue = stylesheet.pickerValue.normal;
            if (locals.hasError) {
                touchableStyle = stylesheet.pickerTouchable.error;
                pickerValue = stylesheet.pickerValue.error;
            }

            let formGroupStyle = stylesheet.formGroup.normal;
            let controlLabelStyle = stylesheet.controlLabel.normal;

            if (locals.hasError) {
                formGroupStyle = stylesheet.formGroup.error;
                controlLabelStyle = stylesheet.controlLabel.error;
            }
            const label = locals.label ? <Text style={controlLabelStyle} onPress={() => {
                this.refs.modal.setVisible(true)
            }}>{locals.label}</Text> : null;
            return (
                <View style={formGroupStyle}>
                    {label}
                    <TouchableOpacity style={[touchableStyle]} onPress={() => {
                        this.refs.modal.setVisible(true)
                    }}>
                        <Text style={pickerValue}>
                            {selectedOption.text}
                        </Text>
                    </TouchableOpacity>
                    <StandaloneModal ref="modal">
                        <View style={styles.innerModal}>
                            <View style={styles.bottom}>
                                <Text style={styles.okText} onPress={() => {
                                    this.refs.modal.setVisible(false)
                                }}>Done</Text>
                                <CollapsiblePickerIOS locals={locals}/>
                            </View>
                        </View>
                    </StandaloneModal>
                </View>
            );
        };
    }
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
        fontSize: getFontSize(22),
        color: 'blue'
    },
});
