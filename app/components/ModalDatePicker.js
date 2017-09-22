import React from 'react';
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
            let formattedValue = String(locals.value);
            if (locals.config) {
                if (locals.config.format) {
                    formattedValue = locals.config.format(locals.value);
                }
            }
            const stylesheet = locals.stylesheet;
            let touchableStyle = stylesheet.dateTouchable.normal;
            let dateValueStyle = stylesheet.dateValue.normal;
            let formGroupStyle = stylesheet.formGroup.normal;

            if (locals.hasError) {
                touchableStyle = stylesheet.dateTouchable.error;
                dateValueStyle = stylesheet.dateValue.error;
                formGroupStyle = stylesheet.formGroup.error;
            }
            return (<View style={formGroupStyle}>
                <TouchableOpacity style={[touchableStyle]}
                                  onPress={() => {
                                      this.refs.modal.setVisible(true)
                                  }}>
                    <Text style={[dateValueStyle]}>{formattedValue}</Text>
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
            </View>);
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
        fontSize: 15,
        color: '#2e7fb2'
    },
});
