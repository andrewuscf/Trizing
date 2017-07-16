import React  from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Platform,
    DatePickerIOS
} from 'react-native';
import t from 'tcomb-form-native';
import Modal from 'react-native-modal';


import {getFontSize} from '../actions/utils';


const UIPICKER_HEIGHT = 216;

class CollapsibleDatePickerIOS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const locals = this.props.locals;
        const stylesheet = locals.stylesheet;
        let datepickerStyle = stylesheet.datepicker.normal;
        if (locals.hasError) {
            datepickerStyle = stylesheet.datepicker.error;
        }
        return (
            <DatePickerIOS
                ref="input"
                accessibilityLabel={locals.label}
                date={locals.value}
                maximumDate={locals.maximumDate}
                minimumDate={locals.minimumDate}
                minuteInterval={locals.minuteInterval}
                mode={locals.mode}
                onDateChange={(value) => locals.onChange(value)}
                timeZoneOffsetInMinutes={locals.timeZoneOffsetInMinutes}
                style={[datepickerStyle, {height: UIPICKER_HEIGHT}]}
            />
        );
    }
}

CollapsibleDatePickerIOS.propTypes = {
    locals: React.PropTypes.object.isRequired
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

export class ModalDatePicker extends t.form.DatePicker {

    getTemplate() {
        return (locals) => {
            const stylesheet = locals.stylesheet;
            let formattedValue = String(locals.value);
            if (locals.config) {
                if (locals.config.format) {
                    formattedValue = locals.config.format(locals.value);
                }
            }
            let touchableStyle = stylesheet.dateTouchable.normal;
            let dateValueStyle = stylesheet.dateValue.normal;
            if (locals.hasError) {
                touchableStyle = stylesheet.dateTouchable.error;
                dateValueStyle = stylesheet.dateValue.error;
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
                    <TouchableOpacity style={touchableStyle}
                                      disabled={locals.disabled}
                                      onPress={() => {
                                          this.refs.modal.setVisible(true)
                                      }}>
                        <Text style={dateValueStyle}>
                            {formattedValue}
                        </Text>
                    </TouchableOpacity>


                    <StandaloneModal ref="modal">
                        <View style={styles.innerModal}>
                            <View style={styles.bottom}>
                                <Text style={styles.okText} onPress={() => {
                                    this.refs.modal.setVisible(false)
                                }}>Done</Text>
                                <CollapsibleDatePickerIOS locals={locals}/>
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
        // fontFamily: 'Gotham-Black',
        color: 'blue'
    },
    button: {
        height: 36,
        paddingVertical: (Platform.OS === 'ios') ? 7 : 0,
        paddingHorizontal: 7,
        borderRadius: 4,
        borderColor: '#cccccc',
        borderWidth: 1,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontSize: 17,
    }
});
