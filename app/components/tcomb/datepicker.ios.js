import React from 'react';

import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    DatePickerIOS
} from 'react-native';
import Modal from 'react-native-modal';


import CustomIcon from '../CustomIcon';
import {getFontSize} from "../../actions/utils";

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

function datepicker(locals) {

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
    let controlLabelStyle = stylesheet.controlLabel.normal;

    if (locals.hasError) {
        touchableStyle = stylesheet.dateTouchable.error;
        dateValueStyle = stylesheet.dateValue.error;
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
    }
    let datePickerModal = null;

    const label = locals.label ? (
        <Text style={controlLabelStyle}>{locals.label}</Text>
    ) : null;
    return (
        <View style={formGroupStyle}>
            {label}
            <TouchableOpacity
                style={[touchableStyle, styles.button]}
                onPress={() => {
                    datePickerModal.setVisible(true)
                }}>
                <Text style={[dateValueStyle]}>{formattedValue}</Text>
            </TouchableOpacity>
            {locals.config && locals.config && locals.config.delete ?
                <TouchableOpacity activeOpacity={1} onPress={locals.config.delete} style={styles.delete}>
                    <CustomIcon name='Close' size={18}/>
                </TouchableOpacity>
                : null
            }
            <StandaloneModal ref={modal => datePickerModal = modal}>
                <View style={styles.innerModal}>
                    <View style={styles.bottom}>
                        <Text style={styles.okText} onPress={() => {
                            locals.onChange(locals.value);
                            datePickerModal.setVisible(false);
                        }}>Done</Text>
                        <CollapsibleDatePickerIOS locals={locals} ref="picker"/>
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
        fontSize: getFontSize(15),
        fontFamily: 'Heebo-Regular',
        color: '#2e7fb2'
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 4,
        justifyContent: 'center'
    },
    delete: {
        position: 'absolute',
        backgroundColor: 'transparent',
        padding: 10,
        right: 0,
        top: '40%',
        zIndex: 10
    }
});

module.exports = datepicker;
